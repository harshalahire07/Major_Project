import uuid
import pytest
from httpx import AsyncClient
from app.core.config import settings

@pytest.fixture
def mock_dependencies(monkeypatch):
    class MockRetrievalService:
        def __init__(self, session): pass
        async def search(self, query, top_k, document_id=None):
            from app.services.retrieval.base import RetrievalResult
            if query == "no evidence":
                return []
            if query == "retrieval fail":
                raise Exception("DB error")
            return [
                RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=1, text="Mock evidence 1", score=0.9),
                RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=2, text="Mock evidence 2", score=0.8)
            ]
            
    class MockLLMProvider:
        def __init__(self):
            self.available = True
            
        async def is_available(self):
            return self.available
            
        async def generate(self, prompt, **kwargs):
            from app.services.llm.base import LLMResponse
            if "fail llm" in prompt:
                raise Exception("LLM crash")
            return LLMResponse(text="Mocked draft answer", model="mock-model", token_count=10)

    monkeypatch.setattr("app.api.v1.queries.RetrievalService", MockRetrievalService)
    monkeypatch.setattr("app.api.v1.queries.OllamaQwenProvider", MockLLMProvider)
    return MockLLMProvider

@pytest.mark.asyncio
async def test_rag_query_valid(client: AsyncClient, mock_dependencies):
    payload = {
        "question": "What is the capital?",
        "document_ids": [str(uuid.uuid4())]
    }
    response = await client.post("/api/v1/queries", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["draft_answer"] == "Mocked draft answer"
    assert "used_chunk_ids" in data
    assert len(data["used_chunk_ids"]) == 2
    assert data["model_name"] == "mock-model"

@pytest.mark.asyncio
async def test_rag_query_no_evidence(client: AsyncClient, mock_dependencies):
    payload = {
        "question": "no evidence",
        "document_ids": [str(uuid.uuid4())]
    }
    response = await client.post("/api/v1/queries", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "insufficient evidence" in data["draft_answer"]
    assert len(data["used_chunk_ids"]) == 0
    assert data["model_name"] == "deterministic"

@pytest.mark.asyncio
async def test_rag_query_llm_unavailable(client: AsyncClient, monkeypatch):
    class UnavailableLLM:
        async def is_available(self): return False
    monkeypatch.setattr("app.api.v1.queries.OllamaQwenProvider", UnavailableLLM)
    
    payload = {"question": "test", "document_ids": [str(uuid.uuid4())]}
    response = await client.post("/api/v1/queries", json=payload)
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "LLM_UNAVAILABLE"

@pytest.mark.asyncio
async def test_rag_query_validation(client: AsyncClient, mock_dependencies):
    # Missing document_ids
    response = await client.post("/api/v1/queries", json={"question": "test", "document_ids": []})
    assert response.status_code == 422 # Pydantic validation (min_length=1)

    # Empty question
    response = await client.post("/api/v1/queries", json={"question": "   ", "document_ids": [str(uuid.uuid4())]})
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "INVALID_QUERY"

@pytest.mark.asyncio
async def test_rag_query_internal_error(client: AsyncClient, mock_dependencies):
    payload = {"question": "retrieval fail", "document_ids": [str(uuid.uuid4())]}
    response = await client.post("/api/v1/queries", json=payload)
    assert response.status_code == 500
    assert response.json()["error"]["code"] == "GENERATION_FAILED"
