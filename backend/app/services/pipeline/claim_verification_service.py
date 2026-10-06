import logging
import uuid
from typing import List, Optional

from app.api.schemas.claim import ClaimSet
from app.api.schemas.verification import VerificationResult, VerificationResultSet, VerificationStatus
from app.api.schemas.retrieval import RetrievalResultItem
from app.services.pipeline.verification_provider import VerificationProvider
from app.services.retrieval.service import RetrievalService
from app.core.config import settings

logger = logging.getLogger(__name__)

class ClaimVerificationService:
    """
    Orchestrates claim-level evidence verification.
    """
    def __init__(self, retrieval_service: RetrievalService, provider: VerificationProvider):
        self.retrieval_service = retrieval_service
        self.provider = provider
        
        self.entailment_threshold = settings.verification_entailment_threshold
        self.contradiction_threshold = settings.verification_contradiction_threshold
        self.top_k = settings.verification_top_k
        self.model_name = settings.verification_model_name
        
    async def verify_claims(
        self, 
        claim_set: ClaimSet, 
        document_ids: Optional[List[uuid.UUID]] = None
    ) -> VerificationResultSet:
        """
        Verify an ordered set of claims against the provided document scope.
        """
        results = []
        doc_id = document_ids[0] if document_ids and len(document_ids) == 1 else None
        
        for claim in claim_set.claims:
            # 1. Retrieve candidate evidence for the claim text
            candidates = await self.retrieval_service.search(
                query=claim.claim_text,
                top_k=self.top_k,
                document_id=doc_id
            )
            
            if not candidates:
                results.append(VerificationResult(
                    claim_id=claim.claim_id,
                    claim_text=claim.claim_text,
                    status="UNVERIFIABLE",
                    model_name=self.model_name,
                    evidence=[]
                ))
                continue
                
            best_entailment_score = 0.0
            best_contradiction_score = 0.0
            best_neutral_score = 0.0
            
            # 2. Score each candidate
            # Evidence aggregation policy: Find max entailment and max contradiction across all chunks.
            # Preserve all evaluated evidence.
            evidence_items = []
            for chunk in candidates:
                scores = self.provider.verify(claim=claim.claim_text, evidence=chunk.text)
                entail = scores.get("entailment", 0.0)
                contra = scores.get("contradiction", 0.0)
                neutral = scores.get("neutral", 0.0)
                
                if entail > best_entailment_score:
                    best_entailment_score = entail
                if contra > best_contradiction_score:
                    best_contradiction_score = contra
                if neutral > best_neutral_score:
                    best_neutral_score = neutral
                    
                evidence_items.append(RetrievalResultItem(
                    chunk_id=chunk.chunk_id,
                    document_id=chunk.document_id,
                    page_number=chunk.page_number,
                    text=chunk.text,
                    score=chunk.score
                ))
                
            # 3. Apply Thresholds
            status: VerificationStatus = "UNVERIFIABLE"
            
            if best_entailment_score >= self.entailment_threshold:
                # If there's also strong contradiction, conservatively mark as CONTRADICTED or UNVERIFIABLE? 
                # The prompt says: "If conflicting strong evidence exists... introduce a conservative conflict rule
                # that avoids falsely labeling a claim as supported when strong contradictory evidence exists."
                if best_contradiction_score >= self.contradiction_threshold:
                    status = "CONTRADICTED"
                else:
                    status = "SUPPORTED"
            elif best_contradiction_score >= self.contradiction_threshold:
                status = "CONTRADICTED"
            else:
                status = "UNVERIFIABLE"
                
            results.append(VerificationResult(
                claim_id=claim.claim_id,
                claim_text=claim.claim_text,
                status=status,
                entailment_score=best_entailment_score,
                contradiction_score=best_contradiction_score,
                neutral_score=best_neutral_score,
                evidence=evidence_items,
                model_name=self.model_name
            ))
            
        return VerificationResultSet(results=results)
