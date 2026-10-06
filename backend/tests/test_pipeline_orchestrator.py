import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock

from app.api.schemas.query import QueryRequest
from app.api.schemas.claim import Claim, ClaimSet
from app.api.schemas.verification import VerificationResult, VerificationResultSet
from app.api.schemas.repair import FinalClaimState, ClaimRepairResultSet
from app.services.pipeline.pipeline_orchestrator import PipelineOrchestrator
from app.services.pipeline.rag_service import RAGResponse
from app.services.retrieval.base import RetrievalResult

@pytest.fixture
def mock_rag():
    rag = AsyncMock()
    rag.generate_answer.return_value = RAGResponse(
        draft_answer="Draft answer.",
        used_evidence=[RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=1, text="ev", score=0.9)],
        model_name="mock"
    )
    return rag

@pytest.fixture
def mock_decomposition():
    decomp = AsyncMock()
    decomp.decompose.return_value = ClaimSet(claims=[
        Claim(claim_id=uuid.uuid4(), claim_order=1, claim_text="Draft claim 1.")
    ])
    return decomp

@pytest.fixture
def mock_verification():
    ver = AsyncMock()
    ver.verify_claims.return_value = VerificationResultSet(results=[])
    return ver

@pytest.fixture
def mock_repair():
    rep = AsyncMock()
    claim_id = uuid.uuid4()
    state = FinalClaimState(
        claim_id=claim_id,
        claim_order=1,
        original_claim_text="Draft claim 1.",
        current_claim_text="Draft claim 1.",
        original_verification_result=VerificationResult(claim_id=claim_id, claim_text="Draft claim 1.", status="SUPPORTED", model_name="mock"),
        final_verification_result=VerificationResult(claim_id=claim_id, claim_text="Draft claim 1.", status="SUPPORTED", model_name="mock"),
        repair_status="NOT_REQUIRED",
        repair_history=[]
    )
    rep.process_claims.return_value = ClaimRepairResultSet(final_states=[state])
    return rep

@pytest.mark.asyncio
class TestPipelineOrchestrator:

    async def test_baseline_mode(self, mock_rag, mock_decomposition, mock_verification, mock_repair):
        orchestrator = PipelineOrchestrator(mock_rag, mock_decomposition, mock_verification, mock_repair)
        req = QueryRequest(question="Test?", document_ids=[uuid.uuid4()], mode="baseline")
        
        resp = await orchestrator.execute_query(req)
        
        assert resp.mode == "baseline"
        assert resp.draft_answer == "Draft answer."
        assert resp.final_answer == "Draft answer."
        assert resp.claims is None
        assert len(resp.used_chunk_ids) == 1
        
        mock_rag.generate_answer.assert_called_once()
        mock_decomposition.decompose.assert_not_called()
        mock_verification.verify_claims.assert_not_called()
        mock_repair.process_claims.assert_not_called()
        
    async def test_full_mode_execution(self, mock_rag, mock_decomposition, mock_verification, mock_repair):
        orchestrator = PipelineOrchestrator(mock_rag, mock_decomposition, mock_verification, mock_repair)
        req = QueryRequest(question="Test?", document_ids=[uuid.uuid4()], mode="full")
        
        resp = await orchestrator.execute_query(req)
        
        assert resp.mode == "full"
        assert resp.draft_answer == "Draft answer."
        assert resp.final_answer == "Draft claim 1." # assembled from final states
        assert len(resp.claims) == 1
        assert resp.claims[0].repair_status == "NOT_REQUIRED"
        
        mock_rag.generate_answer.assert_called_once()
        mock_decomposition.decompose.assert_called_once()
        mock_verification.verify_claims.assert_called_once()
        mock_repair.process_claims.assert_called_once()

    async def test_final_answer_reconstruction_excludes_flagged(self, mock_rag, mock_decomposition, mock_verification, mock_repair):
        orchestrator = PipelineOrchestrator(mock_rag, mock_decomposition, mock_verification, mock_repair)
        
        claim_id_1 = uuid.uuid4()
        claim_id_2 = uuid.uuid4()
        
        state_supported = FinalClaimState(
            claim_id=claim_id_1, claim_order=1,
            original_claim_text="Claim 1.", current_claim_text="Claim 1.",
            original_verification_result=VerificationResult(claim_id=claim_id_1, claim_text="Claim 1.", status="SUPPORTED", model_name="mock"),
            final_verification_result=VerificationResult(claim_id=claim_id_1, claim_text="Claim 1.", status="SUPPORTED", model_name="mock"),
            repair_status="NOT_REQUIRED"
        )
        
        state_flagged = FinalClaimState(
            claim_id=claim_id_2, claim_order=2,
            original_claim_text="Claim 2.", current_claim_text="Claim 2.",
            original_verification_result=VerificationResult(claim_id=claim_id_2, claim_text="Claim 2.", status="UNVERIFIABLE", model_name="mock"),
            final_verification_result=VerificationResult(claim_id=claim_id_2, claim_text="Claim 2.", status="UNVERIFIABLE", model_name="mock"),
            repair_status="FLAGGED"
        )
        
        mock_repair.process_claims.return_value = ClaimRepairResultSet(final_states=[state_supported, state_flagged])
        
        req = QueryRequest(question="Test?", document_ids=[uuid.uuid4()], mode="full")
        resp = await orchestrator.execute_query(req)
        
        # Answer only includes Claim 1
        assert resp.final_answer == "Claim 1."
        assert len(resp.claims) == 2
        assert resp.claims[1].repair_status == "FLAGGED"
