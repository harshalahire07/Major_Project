import json
import uuid
import logging
from abc import ABC, abstractmethod
from typing import List, Dict, Any

from app.api.schemas.claim import Claim
from app.services.llm.base import LLMProvider

logger = logging.getLogger(__name__)

class ClaimDecomposer(ABC):
    """Abstraction for decomposing a text answer into atomic factual claims."""
    
    @abstractmethod
    async def decompose(self, answer: str) -> List[Claim]:
        pass

class DecompositionError(Exception):
    """Raised when claim decomposition fails or returns malformed output."""
    pass

class LLMClaimDecomposer(ClaimDecomposer):
    def __init__(self, llm_provider: LLMProvider):
        self.llm_provider = llm_provider

    def _build_prompt(self, answer: str) -> str:
        return f"""You are a strict text analysis assistant. Your task is to decompose the provided text into atomic, independently understandable factual claims.

RULES:
1. Break down the text into atomic factual claims. Each claim should contain one verifiable proposition.
2. PRESERVE FACTUAL MEANING EXACTLY. Do not add, infer, or remove factual details.
3. PRESERVE NUMBERS EXACTLY. Do not change numerical values or units.
4. PRESERVE QUALIFIERS (e.g., 'approximately', 'may', 'if', 'only', 'never'). Conditional statements are important.
5. PRESERVE ORIGINAL FACTUAL ORDER. The order of claims must match the narrative flow of the original text.
6. RESOLVE PRONOUNS if the context is clear (e.g., change "It stores" to "PostgreSQL stores" if obvious), but do not guess if ambiguous.
7. DO NOT judge truthfulness, verify facts, or mention hallucinations.
8. Output ONLY a valid JSON object matching the exact structure below, with no markdown formatting, no code blocks, and no extra text.

OUTPUT FORMAT:
{{
  "claims": [
    {{
      "claim_order": 1,
      "claim_text": "..."
    }},
    {{
      "claim_order": 2,
      "claim_text": "..."
    }}
  ]
}}

TEXT TO DECOMPOSE:
{answer}
"""

    async def decompose(self, answer: str) -> List[Claim]:
        if not answer or not answer.strip():
            return []
            
        # Treat the deterministic no-evidence response as empty claims
        if "insufficient evidence in the provided documents" in answer:
            return []

        prompt = self._build_prompt(answer.strip())
        
        try:
            # We enforce JSON output conceptually. With Qwen, we might just parse the result.
            response = await self.llm_provider.generate(prompt=prompt, temperature=0.1)
            text_output = response.text.strip()
            
            # Clean up potential markdown formatting from LLM
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
                logger.error("Failed to parse LLM decomposition output as JSON. Output: %s", text_output)
                raise DecompositionError("Malformed JSON from LLM") from e
                
            if not isinstance(parsed, dict) or "claims" not in parsed:
                raise DecompositionError("Missing 'claims' key in LLM output")
                
            raw_claims = parsed.get("claims")
            if not isinstance(raw_claims, list):
                raise DecompositionError("'claims' must be a list")
                
            claims = []
            seen_orders = set()

            # If LLM generated non-positive orders (e.g. -1 for sub-claims), re-index sequentially
            if any(isinstance(rc, dict) and isinstance(rc.get("claim_order"), int) and rc.get("claim_order") <= 0 for rc in raw_claims):
                for idx, rc in enumerate(raw_claims):
                    if isinstance(rc, dict):
                        rc["claim_order"] = idx + 1
            
            for raw_claim in raw_claims:
                if not isinstance(raw_claim, dict):
                    raise DecompositionError("Each claim must be an object")
                    
                order = raw_claim.get("claim_order")
                text = raw_claim.get("claim_text")
                
                if not isinstance(order, int) or order <= 0:
                    raise DecompositionError("Invalid claim_order")
                if order in seen_orders:
                    raise DecompositionError("Duplicate claim_order")
                seen_orders.add(order)
                
                if not isinstance(text, str) or not text.strip():
                    raise DecompositionError("Invalid or empty claim_text")
                    
                claims.append(Claim(
                    claim_id=uuid.uuid4(),
                    claim_order=order,
                    claim_text=text.strip()
                ))
                
            # Ensure sorted by order
            claims.sort(key=lambda c: c.claim_order)
            return claims
            
        except DecompositionError:
            raise
        except Exception as e:
            logger.error("LLM decomposition generation failed: %s", e)
            raise DecompositionError(f"Generation failed: {e}") from e
