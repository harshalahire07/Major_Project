import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock

from app.api.schemas.claim import Claim, ClaimSet
from app.api.schemas.verification import VerificationResult, VerificationResultSet
from app.api.schemas.retrieval import RetrievalResultItem
from app.services.pipeline.claim_repair_service import ClaimRepairService
from app.services.pipeline.repair_provider import RepairProvider, RepairError
from app.services.pipeline.claim_verification_service import ClaimVerificationService
from app.services.retrieval.base import RetrievalResult

class MockRepairProvider(RepairProvider):
    def __init__(self, responses: dict):
        self.responses = responses
        
    async def repair(self, claim: Claim, evidence: list, temperature: float = 0.1) -> str:
        if claim.claim_text in self.responses:
            if isinstance(self.responses[claim.claim_text], Exception):
                raise self.responses[claim.claim_text]
            return self.responses[claim.claim_text]
        return f"Repaired: {claim.claim_text}"

@pytest.fixture
def mock_retrieval():
    return AsyncMock()
    
@pytest.fixture
def mock_verification():
    v = AsyncMock(spec=ClaimVerificationService)
    v.top_k = 5
    return v

@pytest.mark.asyncio
class TestClaimRepairService:
    
    async def test_supported_claim_no_repair(self, mock_verification, mock_retrieval):
        claim_id = uuid.uuid4()
        claim = Claim(claim_id=claim_id, claim_order=1, claim_text="Supported claim.")
        vr = VerificationResult(claim_id=claim_id, claim_text=claim.claim_text, status="SUPPORTED", model_name="mock")
        
        provider = MockRepairProvider({})
        service = ClaimRepairService(provider, mock_verification, mock_retrieval)
        
        result_set = await service.process_claims(ClaimSet(claims=[claim]), VerificationResultSet(results=[vr]))
        
        assert len(result_set.final_states) == 1
        fs = result_set.final_states[0]
        assert fs.repair_status == "NOT_REQUIRED"
        assert fs.current_claim_text == "Supported claim."
        assert len(fs.repair_history) == 0
        assert not mock_retrieval.search.called
        assert not mock_verification.verify_claims.called
        
    async def test_contradicted_claim_successful_repair(self, mock_verification, mock_retrieval):
        claim_id = uuid.uuid4()
        claim = Claim(claim_id=claim_id, claim_order=1, claim_text="Contradicted claim.")
        evidence = [RetrievalResultItem(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=1, text="Evidence", score=0.9)]
        vr = VerificationResult(claim_id=claim_id, claim_text=claim.claim_text, status="CONTRADICTED", evidence=evidence, model_name="mock")
        
        provider = MockRepairProvider({"Contradicted claim.": "Repaired claim."})
        service = ClaimRepairService(provider, mock_verification, mock_retrieval)
        
        re_vr = VerificationResult(claim_id=claim_id, claim_text="Repaired claim.", status="SUPPORTED", model_name="mock")
        mock_verification.verify_claims.return_value = VerificationResultSet(results=[re_vr])
        
        result_set = await service.process_claims(ClaimSet(claims=[claim]), VerificationResultSet(results=[vr]))
        
        fs = result_set.final_states[0]
        assert fs.repair_status == "REPAIRED"
        assert fs.current_claim_text == "Repaired claim."
        assert len(fs.repair_history) == 1
        assert fs.repair_history[0].iteration == 1
        assert fs.repair_history[0].verification_after_repair.status == "SUPPORTED"
        
    async def test_unverifiable_claim_becomes_supported(self, mock_verification, mock_retrieval):
        claim_id = uuid.uuid4()
        claim = Claim(claim_id=claim_id, claim_order=1, claim_text="Unverifiable claim.")
        vr = VerificationResult(claim_id=claim_id, claim_text=claim.claim_text, status="UNVERIFIABLE", model_name="mock")
        
        # Retrieval yields new evidence
        mock_retrieval.search.return_value = [RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=1, text="New evidence", score=0.9)]
        
        re_vr = VerificationResult(claim_id=claim_id, claim_text="Unverifiable claim.", status="SUPPORTED", model_name="mock")
        mock_verification.verify_claims.return_value = VerificationResultSet(results=[re_vr])
        
        provider = MockRepairProvider({})
        service = ClaimRepairService(provider, mock_verification, mock_retrieval)
        
        result_set = await service.process_claims(ClaimSet(claims=[claim]), VerificationResultSet(results=[vr]))
        
        fs = result_set.final_states[0]
        assert fs.repair_status == "NOT_REQUIRED"
        assert len(fs.repair_history) == 0
        mock_retrieval.search.assert_called_once()
        mock_verification.verify_claims.assert_called_once()
        
    async def test_unverifiable_claim_becomes_flagged(self, mock_verification, mock_retrieval):
        claim_id = uuid.uuid4()
        claim = Claim(claim_id=claim_id, claim_order=1, claim_text="Unverifiable claim.")
        vr = VerificationResult(claim_id=claim_id, claim_text=claim.claim_text, status="UNVERIFIABLE", model_name="mock")
        
        # Retrieval yields nothing
        mock_retrieval.search.return_value = []
        
        provider = MockRepairProvider({})
        service = ClaimRepairService(provider, mock_verification, mock_retrieval)
        
        result_set = await service.process_claims(ClaimSet(claims=[claim]), VerificationResultSet(results=[vr]))
        
        fs = result_set.final_states[0]
        assert fs.repair_status == "FLAGGED"
        assert len(fs.repair_history) == 0
        mock_retrieval.search.assert_called_once()
        assert not mock_verification.verify_claims.called
        
    async def test_repair_iteration_limit(self, mock_verification, mock_retrieval):
        claim_id = uuid.uuid4()
        claim = Claim(claim_id=claim_id, claim_order=1, claim_text="Contradicted claim.")
        evidence = [RetrievalResultItem(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=1, text="Evidence", score=0.9)]
        vr = VerificationResult(claim_id=claim_id, claim_text=claim.claim_text, status="CONTRADICTED", evidence=evidence, model_name="mock")
        
        # Repair keeps producing contradicted results
        re_vr = VerificationResult(claim_id=claim_id, claim_text="Repaired claim.", status="CONTRADICTED", evidence=evidence, model_name="mock")
        mock_verification.verify_claims.return_value = VerificationResultSet(results=[re_vr])
        
        provider = MockRepairProvider({"Contradicted claim.": "Repaired claim.", "Repaired claim.": "Repaired claim 2."})
        service = ClaimRepairService(provider, mock_verification, mock_retrieval)
        service.max_iterations = 2
        
        result_set = await service.process_claims(ClaimSet(claims=[claim]), VerificationResultSet(results=[vr]))
        
        fs = result_set.final_states[0]
        assert fs.repair_status == "FLAGGED"
        assert len(fs.repair_history) == 2
        
    async def test_no_evidence_repair_flagged(self, mock_verification, mock_retrieval):
        claim_id = uuid.uuid4()
        claim = Claim(claim_id=claim_id, claim_order=1, claim_text="Contradicted claim.")
        # NO evidence
        vr = VerificationResult(claim_id=claim_id, claim_text=claim.claim_text, status="CONTRADICTED", evidence=[], model_name="mock")
        
        provider = MockRepairProvider({})
        service = ClaimRepairService(provider, mock_verification, mock_retrieval)
        
        result_set = await service.process_claims(ClaimSet(claims=[claim]), VerificationResultSet(results=[vr]))
        
        fs = result_set.final_states[0]
        assert fs.repair_status == "FLAGGED"
        assert len(fs.repair_history) == 0
        
    async def test_repair_error_handled(self, mock_verification, mock_retrieval):
        claim_id = uuid.uuid4()
        claim = Claim(claim_id=claim_id, claim_order=1, claim_text="Contradicted claim.")
        evidence = [RetrievalResultItem(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=1, text="Evidence", score=0.9)]
        vr = VerificationResult(claim_id=claim_id, claim_text=claim.claim_text, status="CONTRADICTED", evidence=evidence, model_name="mock")
        
        provider = MockRepairProvider({"Contradicted claim.": RepairError("Malformed JSON")})
        service = ClaimRepairService(provider, mock_verification, mock_retrieval)
        
        result_set = await service.process_claims(ClaimSet(claims=[claim]), VerificationResultSet(results=[vr]))
        
        fs = result_set.final_states[0]
        assert fs.repair_status == "FLAGGED"
        assert len(fs.repair_history) == 0
