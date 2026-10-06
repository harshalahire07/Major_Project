import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock

from app.api.schemas.claim import Claim, ClaimSet
from app.api.schemas.verification import VerificationResultSet
from app.services.pipeline.claim_verification_service import ClaimVerificationService
from app.services.pipeline.verification_provider import VerificationProvider
from app.services.retrieval.base import RetrievalResult

class MockVerificationProvider(VerificationProvider):
    def __init__(self, scores_map):
        self.scores_map = scores_map
        
    def verify(self, claim: str, evidence: str):
        key = (claim, evidence)
        return self.scores_map.get(key, {"entailment": 0.0, "contradiction": 0.0, "neutral": 1.0})

@pytest.mark.asyncio
class TestClaimVerificationService:
    
    @pytest.fixture
    def mock_retrieval(self):
        retrieval = AsyncMock()
        return retrieval
        
    def test_supported_claim(self):
        pass
        
    async def test_verification_scenarios(self, mock_retrieval):
        claim_id_1 = uuid.uuid4()
        claim_1 = Claim(claim_id=claim_id_1, claim_order=1, claim_text="FAISS is used for vector search.")
        
        chunk_1 = RetrievalResult(
            chunk_id=uuid.uuid4(),
            document_id=uuid.uuid4(),
            page_number=1,
            text="FAISS provides vector similarity search.",
            score=0.9
        )
        
        mock_retrieval.search.return_value = [chunk_1]
        
        scores_map = {
            ("FAISS is used for vector search.", "FAISS provides vector similarity search."): {
                "entailment": 0.95,
                "contradiction": 0.01,
                "neutral": 0.04
            }
        }
        provider = MockVerificationProvider(scores_map)
        
        service = ClaimVerificationService(retrieval_service=mock_retrieval, provider=provider)
        
        # Test SUPPORTED
        claim_set = ClaimSet(claims=[claim_1])
        result_set = await service.verify_claims(claim_set)
        
        assert len(result_set.results) == 1
        res = result_set.results[0]
        assert res.status == "SUPPORTED"
        assert res.entailment_score == 0.95
        assert len(res.evidence) == 1
        
    async def test_contradicted_claim(self, mock_retrieval):
        claim = Claim(claim_id=uuid.uuid4(), claim_order=1, claim_text="The system uses MongoDB.")
        chunk = RetrievalResult(
            chunk_id=uuid.uuid4(),
            document_id=uuid.uuid4(),
            page_number=1,
            text="The system uses PostgreSQL.",
            score=0.9
        )
        mock_retrieval.search.return_value = [chunk]
        scores_map = {
            (claim.claim_text, chunk.text): {
                "entailment": 0.05,
                "contradiction": 0.90,
                "neutral": 0.05
            }
        }
        service = ClaimVerificationService(mock_retrieval, MockVerificationProvider(scores_map))
        res_set = await service.verify_claims(ClaimSet(claims=[claim]))
        assert res_set.results[0].status == "CONTRADICTED"
        
    async def test_unverifiable_claim(self, mock_retrieval):
        claim = Claim(claim_id=uuid.uuid4(), claim_order=1, claim_text="The system supports 10,000 documents.")
        chunk = RetrievalResult(
            chunk_id=uuid.uuid4(),
            document_id=uuid.uuid4(),
            page_number=1,
            text="PostgreSQL is used for metadata storage.",
            score=0.5
        )
        mock_retrieval.search.return_value = [chunk]
        scores_map = {
            (claim.claim_text, chunk.text): {
                "entailment": 0.1,
                "contradiction": 0.1,
                "neutral": 0.8
            }
        }
        service = ClaimVerificationService(mock_retrieval, MockVerificationProvider(scores_map))
        res_set = await service.verify_claims(ClaimSet(claims=[claim]))
        assert res_set.results[0].status == "UNVERIFIABLE"
        
    async def test_no_evidence(self, mock_retrieval):
        claim = Claim(claim_id=uuid.uuid4(), claim_order=1, claim_text="No evidence.")
        mock_retrieval.search.return_value = []
        service = ClaimVerificationService(mock_retrieval, MockVerificationProvider({}))
        res_set = await service.verify_claims(ClaimSet(claims=[claim]))
        assert res_set.results[0].status == "UNVERIFIABLE"
        assert len(res_set.results[0].evidence) == 0
        
    async def test_multiple_evidence_strongest_entailment(self, mock_retrieval):
        claim = Claim(claim_id=uuid.uuid4(), claim_order=1, claim_text="Multiple.")
        chunk1 = RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=1, text="Weak.", score=0.5)
        chunk2 = RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=1, text="Strong.", score=0.9)
        mock_retrieval.search.return_value = [chunk1, chunk2]
        
        scores_map = {
            ("Multiple.", "Weak."): {"entailment": 0.4, "contradiction": 0.1, "neutral": 0.5},
            ("Multiple.", "Strong."): {"entailment": 0.85, "contradiction": 0.05, "neutral": 0.1}
        }
        service = ClaimVerificationService(mock_retrieval, MockVerificationProvider(scores_map))
        res_set = await service.verify_claims(ClaimSet(claims=[claim]))
        assert res_set.results[0].status == "SUPPORTED"
        assert res_set.results[0].entailment_score == 0.85
        assert len(res_set.results[0].evidence) == 2
        
    async def test_conflicting_evidence_conservative_rule(self, mock_retrieval):
        claim = Claim(claim_id=uuid.uuid4(), claim_order=1, claim_text="Conflict.")
        chunk1 = RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=1, text="Support.", score=0.9)
        chunk2 = RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=1, text="Contradict.", score=0.9)
        mock_retrieval.search.return_value = [chunk1, chunk2]
        
        scores_map = {
            ("Conflict.", "Support."): {"entailment": 0.9, "contradiction": 0.05, "neutral": 0.05},
            ("Conflict.", "Contradict."): {"entailment": 0.05, "contradiction": 0.95, "neutral": 0.0}
        }
        service = ClaimVerificationService(mock_retrieval, MockVerificationProvider(scores_map))
        res_set = await service.verify_claims(ClaimSet(claims=[claim]))
        
        # Conservative rule: if strong contradiction exists, it overrides support to CONTRADICTED.
        assert res_set.results[0].status == "CONTRADICTED"
        assert res_set.results[0].entailment_score == 0.9
        assert res_set.results[0].contradiction_score == 0.95
