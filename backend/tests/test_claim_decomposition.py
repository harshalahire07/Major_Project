import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock

from app.api.schemas.claim import Claim, ClaimSet
from app.services.llm.base import LLMProvider, LLMResponse
from app.services.pipeline.claim_decomposer import LLMClaimDecomposer, DecompositionError
from app.services.pipeline.claim_decomposition_service import ClaimDecompositionService

class MockLLMProvider(LLMProvider):
    def __init__(self, response_text: str = ""):
        self.response_text = response_text
        self.generate_called = False
        
    async def generate(self, prompt: str, **kwargs: object) -> LLMResponse:
        self.generate_called = True
        return LLMResponse(text=self.response_text, model="mock")
        
    async def is_available(self) -> bool:
        return True

@pytest.mark.asyncio
class TestClaimDecomposer:
    
    async def test_single_factual_sentence(self):
        json_resp = """
        {
          "claims": [
            {
              "claim_order": 1,
              "claim_text": "FAISS is used for vector search."
            }
          ]
        }
        """
        provider = MockLLMProvider(response_text=json_resp)
        decomposer = LLMClaimDecomposer(provider)
        claims = await decomposer.decompose("FAISS is used for vector search.")
        
        assert len(claims) == 1
        assert claims[0].claim_order == 1
        assert claims[0].claim_text == "FAISS is used for vector search."
        assert isinstance(claims[0].claim_id, uuid.UUID)
        
    async def test_multiple_independent_facts(self):
        json_resp = """
        {
          "claims": [
            {
              "claim_order": 1,
              "claim_text": "FAISS is used for retrieval."
            },
            {
              "claim_order": 2,
              "claim_text": "PostgreSQL stores metadata."
            }
          ]
        }
        """
        provider = MockLLMProvider(response_text=json_resp)
        decomposer = LLMClaimDecomposer(provider)
        claims = await decomposer.decompose("FAISS is used for retrieval. PostgreSQL stores metadata.")
        
        assert len(claims) == 2
        assert claims[0].claim_order == 1
        assert claims[1].claim_order == 2
        
    async def test_empty_answer_returns_empty_list(self):
        provider = MockLLMProvider(response_text="{}")
        decomposer = LLMClaimDecomposer(provider)
        
        claims = await decomposer.decompose("")
        assert claims == []
        
        claims = await decomposer.decompose("   ")
        assert claims == []
        
        assert not provider.generate_called

    async def test_no_evidence_answer_returns_empty_list(self):
        provider = MockLLMProvider(response_text="{}")
        decomposer = LLMClaimDecomposer(provider)
        
        answer = "There is insufficient evidence in the provided documents to answer the question."
        claims = await decomposer.decompose(answer)
        assert claims == []
        assert not provider.generate_called
        
    async def test_malformed_json_raises_error(self):
        provider = MockLLMProvider(response_text="This is not json")
        decomposer = LLMClaimDecomposer(provider)
        
        with pytest.raises(DecompositionError, match="Malformed JSON"):
            await decomposer.decompose("Some answer.")
            
    async def test_missing_claims_key_raises_error(self):
        provider = MockLLMProvider(response_text='{"other": 1}')
        decomposer = LLMClaimDecomposer(provider)
        
        with pytest.raises(DecompositionError, match="Missing 'claims' key"):
            await decomposer.decompose("Some answer.")
            
    async def test_missing_claim_text_raises_error(self):
        json_resp = '{"claims": [{"claim_order": 1}]}'
        provider = MockLLMProvider(response_text=json_resp)
        decomposer = LLMClaimDecomposer(provider)
        
        with pytest.raises(DecompositionError, match="Invalid or empty claim_text"):
            await decomposer.decompose("Some answer.")
            
    async def test_duplicate_order_raises_error(self):
        json_resp = '{"claims": [{"claim_order": 1, "claim_text": "A"}, {"claim_order": 1, "claim_text": "B"}]}'
        provider = MockLLMProvider(response_text=json_resp)
        decomposer = LLMClaimDecomposer(provider)
        
        with pytest.raises(DecompositionError, match="Duplicate claim_order"):
            await decomposer.decompose("Some answer.")
            
    async def test_markdown_formatting_is_stripped(self):
        json_resp = "```json\n{\"claims\": [{\"claim_order\": 1, \"claim_text\": \"A\"}]}\n```"
        provider = MockLLMProvider(response_text=json_resp)
        decomposer = LLMClaimDecomposer(provider)
        
        claims = await decomposer.decompose("Some answer.")
        assert len(claims) == 1
        assert claims[0].claim_text == "A"
        
    async def test_llm_failure_propagates_as_decomposition_error(self):
        class FailingProvider(LLMProvider):
            async def generate(self, prompt, **kwargs):
                raise RuntimeError("LLM crashed")
            async def is_available(self):
                return True
                
        decomposer = LLMClaimDecomposer(FailingProvider())
        with pytest.raises(DecompositionError, match="Generation failed: LLM crashed"):
            await decomposer.decompose("Some answer.")

@pytest.mark.asyncio
class TestClaimDecompositionService:
    async def test_service_orchestration(self):
        mock_decomposer = AsyncMock()
        mock_decomposer.decompose.return_value = [
            Claim(claim_id=uuid.uuid4(), claim_order=1, claim_text="Claim 1")
        ]
        
        service = ClaimDecompositionService(decomposer=mock_decomposer)
        claim_set = await service.decompose_answer("Draft answer")
        
        assert isinstance(claim_set, ClaimSet)
        assert len(claim_set.claims) == 1
        mock_decomposer.decompose.assert_called_once_with("Draft answer")
