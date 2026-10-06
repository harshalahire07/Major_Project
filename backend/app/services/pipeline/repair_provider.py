import json
import logging
from abc import ABC, abstractmethod
from typing import List

from app.api.schemas.claim import Claim
from app.api.schemas.retrieval import RetrievalResultItem
from app.services.llm.base import LLMProvider

logger = logging.getLogger(__name__)

class RepairError(Exception):
    """Raised when claim repair fails or returns malformed output."""
    pass

class RepairProvider(ABC):
    @abstractmethod
    async def repair(self, claim: Claim, evidence: List[RetrievalResultItem], temperature: float = 0.1) -> str:
        """
        Takes a claim and candidate evidence and returns a single repaired claim text.
        """
        pass

class LLMRepairProvider(RepairProvider):
    def __init__(self, llm_provider: LLMProvider):
        self.llm_provider = llm_provider

    def _build_prompt(self, claim_text: str, evidence: List[RetrievalResultItem]) -> str:
        evidence_text = "\n\n".join([f"Evidence {i+1}:\n{e.text}" for i, e in enumerate(evidence)])
        
        return f"""You are a strict factual correction assistant. Your task is to repair the provided claim using ONLY the provided evidence.

RULES:
1. Correct the claim using the evidence.
2. Preserve supported parts of the original claim.
3. Modify only the contradicted content based on the evidence.
4. DO NOT introduce external information. DO NOT use outside knowledge.
5. DO NOT invent numbers or broaden the claim.
6. DO NOT produce an explanation.
7. Output ONLY the repaired claim in the specified JSON format.
8. If the evidence cannot establish a correction, produce the safest evidence-grounded formulation of the claim.
9. Output ONLY a valid JSON object matching the exact structure below, with no markdown formatting, no code blocks, and no extra text.

OUTPUT FORMAT:
{{
  "repaired_claim": "..."
}}

ORIGINAL CLAIM:
{claim_text}

EVIDENCE:
{evidence_text}
"""

    async def repair(self, claim: Claim, evidence: List[RetrievalResultItem], temperature: float = 0.1) -> str:
        if not evidence:
            raise RepairError("Cannot repair claim without evidence.")
            
        prompt = self._build_prompt(claim.claim_text, evidence)
        
        try:
            response = await self.llm_provider.generate(prompt=prompt, temperature=temperature)
            text_output = response.text.strip()
            
            # Clean markdown
            if text_output.startswith("```json"):
                text_output = text_output[7:]
            elif text_output.startswith("```"):
                text_output = text_output[3:]
            if text_output.endswith("```"):
                text_output = text_output[:-3]
                
            text_output = text_output.strip()
            
            try:
                parsed = json.loads(text_output)
            except json.JSONDecodeError as e:
                logger.error("Failed to parse LLM repair output as JSON. Output: %s", text_output)
                raise RepairError("Malformed JSON from LLM") from e
                
            if not isinstance(parsed, dict) or "repaired_claim" not in parsed:
                raise RepairError("Missing 'repaired_claim' key in LLM output")
                
            repaired_text = parsed.get("repaired_claim")
            
            if not isinstance(repaired_text, str) or not repaired_text.strip():
                raise RepairError("Invalid or empty repaired_claim")
                
            return repaired_text.strip()
            
        except RepairError:
            raise
        except Exception as e:
            logger.error("LLM repair generation failed: %s", e)
            raise RepairError(f"Generation failed: {e}") from e
