import logging
import uuid
from typing import List, Optional

from app.api.schemas.claim import Claim, ClaimSet
from app.api.schemas.verification import VerificationResultSet, VerificationResult
from app.api.schemas.repair import FinalClaimState, ClaimRepairResultSet, RepairAttempt, RepairStatus
from app.services.pipeline.repair_provider import RepairProvider, RepairError
from app.services.pipeline.claim_verification_service import ClaimVerificationService
from app.services.retrieval.service import RetrievalService
from app.core.config import settings

logger = logging.getLogger(__name__)

class ClaimRepairService:
    """
    Orchestrates targeted claim repair and mandatory re-verification.
    """
    def __init__(
        self, 
        repair_provider: RepairProvider, 
        verification_service: ClaimVerificationService,
        retrieval_service: RetrievalService
    ):
        self.repair_provider = repair_provider
        self.verification_service = verification_service
        self.retrieval_service = retrieval_service
        
        self.max_iterations = settings.repair_max_iterations
        self.temperature = settings.repair_temperature
        self.additional_top_k = settings.repair_additional_retrieval_top_k

    async def process_claims(
        self,
        claim_set: ClaimSet,
        verification_results: VerificationResultSet,
        document_ids: Optional[List[uuid.UUID]] = None
    ) -> ClaimRepairResultSet:
        
        final_states = []
        doc_id = document_ids[0] if document_ids and len(document_ids) == 1 else None
        
        # Map original claims and verification results
        claims_map = {c.claim_id: c for c in claim_set.claims}
        verification_map = {vr.claim_id: vr for vr in verification_results.results}
        
        for claim in claim_set.claims:
            orig_vr = verification_map.get(claim.claim_id)
            if not orig_vr:
                logger.error(f"Missing verification result for claim {claim.claim_id}")
                continue
                
            current_claim_text = claim.claim_text
            current_vr = orig_vr
            repair_history = []
            repair_status: RepairStatus = "NOT_REQUIRED"
            
            if current_vr.status == "SUPPORTED":
                # Do nothing
                repair_status = "NOT_REQUIRED"
                
            elif current_vr.status == "UNVERIFIABLE":
                # Attempt additional retrieval before considering it unverified
                new_evidence = await self.retrieval_service.search(
                    query=claim.claim_text,
                    top_k=self.additional_top_k,
                    document_id=doc_id
                )
                
                if not new_evidence:
                    repair_status = "FLAGGED"
                else:
                    # Re-verify with new evidence
                    # VerificationService intrinsically retrieves. We just re-call it for this claim
                    # but wait, the M6 service `verify_claims` does retrieval itself.
                    # By passing the claim into `verify_claims` again, it might just get the same 
                    # top_k. But we have `additional_top_k`.
                    # To cleanly use VerificationService with different top_k, we temporarily override or
                    # rely on the fact that M6 fetches from the same index.
                    # The prompt says: "UNVERIFIABLE -> additional evidence retrieval -> Re-verification if useful".
                    # For simplicity, we can pass it back to VerificationService. 
                    # Wait, ClaimVerificationService.verify_claims calls RetrievalService.search(top_k=self.top_k).
                    # If we just do another verify_claims, it does the same thing unless top_k is higher.
                    # Since we use `repair_additional_retrieval_top_k` (default 5, same as verification_top_k),
                    # it might fetch exactly the same evidence if the query is the same.
                    # To fetch different evidence, one might rewrite the query, or increase top_k.
                    # The prompt says: "additional targeted retrieval if appropriate. Reuse RetrievalService."
                    
                    # For M7, let's just temporarily increase the top_k of the verification service, 
                    # or better: create a temporary ClaimVerificationService or just call the provider directly.
                    # But the prompt says "Reuse ClaimVerificationService."
                    
                    # Let's temporarily increase top_k for verification service.
                    orig_top_k = self.verification_service.top_k
                    self.verification_service.top_k = orig_top_k + self.additional_top_k
                    
                    re_vr_set = await self.verification_service.verify_claims(
                        ClaimSet(claims=[claim]),
                        document_ids=document_ids
                    )
                    
                    self.verification_service.top_k = orig_top_k
                    
                    current_vr = re_vr_set.results[0]
                    
                    if current_vr.status == "SUPPORTED":
                        repair_status = "NOT_REQUIRED"
                    elif current_vr.status == "CONTRADICTED":
                        # Now it's contradicted, fall through to repair logic
                        # But wait, python doesn't have goto. We'll handle repair logic inside a function.
                        pass
                    else:
                        repair_status = "FLAGGED"
                        
            # We check again because an UNVERIFIABLE claim might have turned into CONTRADICTED
            if current_vr.status == "CONTRADICTED":
                # Targeted Repair
                for attempt in range(1, self.max_iterations + 1):
                    # We only repair if we have evidence. The current_vr must have evidence.
                    if not current_vr.evidence:
                        repair_status = "FLAGGED"
                        break
                        
                    # Call repair provider
                    temp_claim = Claim(
                        claim_id=claim.claim_id,
                        claim_order=claim.claim_order,
                        claim_text=current_claim_text
                    )
                    
                    try:
                        repaired_text = await self.repair_provider.repair(
                            claim=temp_claim, 
                            evidence=current_vr.evidence,
                            temperature=self.temperature
                        )
                    except RepairError as e:
                        logger.error(f"Repair failed for claim {claim.claim_id}: {e}")
                        repair_status = "FLAGGED"
                        break
                        
                    # Re-verify repaired claim
                    repaired_claim = Claim(
                        claim_id=claim.claim_id,
                        claim_order=claim.claim_order,
                        claim_text=repaired_text
                    )
                    
                    re_vr_set = await self.verification_service.verify_claims(
                        ClaimSet(claims=[repaired_claim]),
                        document_ids=document_ids
                    )
                    re_vr = re_vr_set.results[0]
                    
                    repair_history.append(RepairAttempt(
                        iteration=attempt,
                        original_claim_text=current_claim_text,
                        repaired_claim_text=repaired_text,
                        verification_after_repair=re_vr
                    ))
                    
                    current_claim_text = repaired_text
                    current_vr = re_vr
                    
                    if current_vr.status == "SUPPORTED":
                        repair_status = "REPAIRED"
                        break
                    elif current_vr.status == "UNVERIFIABLE":
                        repair_status = "FLAGGED"
                        break
                    elif current_vr.status == "CONTRADICTED":
                        # Will loop again if attempts remain
                        repair_status = "FAILED"
                        
                if repair_status == "FAILED":
                    repair_status = "FLAGGED"

            final_states.append(FinalClaimState(
                claim_id=claim.claim_id,
                claim_order=claim.claim_order,
                original_claim_text=claim.claim_text,
                current_claim_text=current_claim_text,
                original_verification_result=orig_vr,
                repair_history=repair_history,
                final_verification_result=current_vr,
                repair_status=repair_status
            ))
            
        return ClaimRepairResultSet(final_states=final_states)
