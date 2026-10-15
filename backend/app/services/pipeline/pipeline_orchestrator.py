import logging
import uuid
from typing import List, Optional

from app.api.schemas.query import QueryRequest, QueryResponse
from app.api.schemas.repair import FinalClaimState
from app.services.pipeline.rag_service import RAGService
from app.services.pipeline.claim_decomposition_service import ClaimDecompositionService
from app.services.pipeline.claim_verification_service import ClaimVerificationService
from app.services.pipeline.claim_repair_service import ClaimRepairService

logger = logging.getLogger(__name__)

class PipelineOrchestrator:
    """
    Integrates M4 RAG -> M5 Decomposition -> M6 Verification -> M7 Repair -> Final Assembly.
    """
    def __init__(
        self,
        rag_service: RAGService,
        decomposition_service: Optional[ClaimDecompositionService] = None,
        verification_service: Optional[ClaimVerificationService] = None,
        repair_service: Optional[ClaimRepairService] = None
    ):
        self.rag_service = rag_service
        self.decomposition_service = decomposition_service
        self.verification_service = verification_service
        self.repair_service = repair_service

    async def execute_query(self, request: QueryRequest) -> QueryResponse:
        """
        Executes the query processing pipeline based on requested mode.
        """
        query_id = uuid.uuid4()
        mode = request.mode
        
        # M4: RAG Baseline (Always runs)
        logger.info(f"[{query_id}] Executing M4 RAG generation.")
        rag_response = await self.rag_service.generate_answer(
            query=request.question,
            document_ids=request.document_ids,
            top_k=request.top_k
        )
        
        used_chunk_ids = [ev.chunk_id for ev in rag_response.used_evidence]
        
        # Baseline Mode
        if mode == "baseline":
            return QueryResponse(
                query_id=query_id,
                mode=mode,
                question=request.question,
                draft_answer=rag_response.draft_answer,
                final_answer=rag_response.draft_answer,
                claims=None,
                used_chunk_ids=used_chunk_ids,
                model_name=rag_response.model_name
            )
            
        # Full Mode
        logger.info(f"[{query_id}] Executing M5 Claim Decomposition.")
        claim_set = await self.decomposition_service.decompose_answer(rag_response.draft_answer)
        
        # If no claims decomposed, just return baseline behavior
        if not claim_set.claims:
            return QueryResponse(
                query_id=query_id,
                mode=mode,
                question=request.question,
                draft_answer=rag_response.draft_answer,
                final_answer=rag_response.draft_answer,
                claims=[],
                used_chunk_ids=used_chunk_ids,
                model_name=rag_response.model_name
            )
            
        logger.info(f"[{query_id}] Executing M6 Claim Verification.")
        verification_results = await self.verification_service.verify_claims(
            claim_set=claim_set,
            document_ids=request.document_ids
        )
        
        logger.info(f"[{query_id}] Executing M7 Claim Repair.")
        repair_results = await self.repair_service.process_claims(
            claim_set=claim_set,
            verification_results=verification_results,
            document_ids=request.document_ids
        )
        
        logger.info(f"[{query_id}] Assembling Final Answer.")
        final_answer = self._assemble_final_answer(repair_results.final_states)
        
        return QueryResponse(
            query_id=query_id,
            mode=mode,
            question=request.question,
            draft_answer=rag_response.draft_answer,
            final_answer=final_answer,
            claims=repair_results.final_states,
            used_chunk_ids=used_chunk_ids,
            model_name=rag_response.model_name
        )
        
    def _assemble_final_answer(self, final_states: List[FinalClaimState]) -> str:
        """
        Constructs the final answer from accepted claims (SUPPORTED or REPAIRED).
        Maintains order. Excludes FLAGGED or FAILED claims.
        """
        # Sort by claim_order just in case
        sorted_states = sorted(final_states, key=lambda s: s.claim_order)
        
        accepted_texts = []
        for state in sorted_states:
            # We include it if it's considered valid
            if state.final_verification_result.status == "SUPPORTED":
                # Ensure it ends with punctuation if missing (basic normalization)
                text = state.current_claim_text.strip()
                if text and text[-1] not in ".!?":
                    text += "."
                accepted_texts.append(text)
                
        # If all claims were flagged/failed
        if not accepted_texts:
            return "No verifiable claims could be established from the provided documents."
            
        # Join claims. A real system might do better synthesis, but this meets M8 determinism constraint.
        return " ".join(accepted_texts)
