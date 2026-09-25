import uuid
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
import math

from app.models.document import Document, Chunk
from app.services.retrieval.service import RetrievalService
from app.services.retrieval.base import RetrievalResult
from app.core.config import settings


@pytest.fixture
def mock_retrieval_service(monkeypatch):
    """Mocks RetrievalService to avoid real FAISS/DB calls for API boundary tests."""
    class MockRetrievalService:
        def __init__(self, session):
            self.session = session
            self.should_fail = False

        async def search(self, query: str, top_k: int, document_id: uuid.UUID | None = None):
            if self.should_fail:
                raise Exception("Simulated FAISS error")
                
            if not query.strip():
                return []
                
            # Simulate empty index
            if query == "empty_index":
                return []

            # Simulate found results
            results = []
            for i in range(min(top_k, 3)): # Max 3 available for testing
                results.append(RetrievalResult(
                    chunk_id=uuid.uuid4(),
                    document_id=document_id or uuid.uuid4(),
                    page_number=i + 1,
                    text=f"Mocked result for {query} {i}",
                    score=0.9 - (i * 0.1) # Decending order
                ))
            return results

    monkeypatch.setattr("app.api.v1.queries.RetrievalService", MockRetrievalService)


@pytest.mark.asyncio
async def test_retrieval_valid_request(client: AsyncClient, mock_retrieval_service):
    response = await client.post("/api/v1/queries/retrieve", json={"query": "test query", "top_k": 2})
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) == 2
    
    # Check Result ordering and propagation
    assert data["results"][0]["score"] > data["results"][1]["score"]
    assert "Mocked result" in data["results"][0]["text"]
    assert "chunk_id" in data["results"][0]
    assert "document_id" in data["results"][0]
    assert "page_number" in data["results"][0]


@pytest.mark.asyncio
async def test_retrieval_default_top_k(client: AsyncClient, mock_retrieval_service):
    response = await client.post("/api/v1/queries/retrieve", json={"query": "test query"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) <= settings.retrieval_top_k


@pytest.mark.asyncio
async def test_retrieval_empty_query(client: AsyncClient, mock_retrieval_service):
    # Validation at Pydantic level (min_length=1)
    response = await client.post("/api/v1/queries/retrieve", json={"query": ""})
    assert response.status_code == 422 
    # The requirement asks for standard error envelope, but FastAPI default validation error is 422.
    # Our API specific check for whitespace is 400.
    
    response2 = await client.post("/api/v1/queries/retrieve", json={"query": "   "})
    assert response2.status_code == 400
    assert response2.json()["error"]["code"] == "INVALID_QUERY"


@pytest.mark.asyncio
async def test_retrieval_invalid_top_k(client: AsyncClient, mock_retrieval_service):
    response = await client.post("/api/v1/queries/retrieve", json={"query": "test", "top_k": 0})
    assert response.status_code == 422 # Pydantic gt=0
    
    response = await client.post("/api/v1/queries/retrieve", json={"query": "test", "top_k": -5})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_retrieval_empty_index(client: AsyncClient, mock_retrieval_service):
    response = await client.post("/api/v1/queries/retrieve", json={"query": "empty_index", "top_k": 5})
    assert response.status_code == 200
    assert response.json()["results"] == []


@pytest.mark.asyncio
async def test_retrieval_document_scope(client: AsyncClient, mock_retrieval_service):
    doc_id = str(uuid.uuid4())
    response = await client.post("/api/v1/queries/retrieve", json={"query": "test", "document_id": doc_id})
    assert response.status_code == 200
    for res in response.json()["results"]:
        assert res["document_id"] == doc_id


@pytest.mark.asyncio
async def test_retrieval_internal_error_envelope(client: AsyncClient, monkeypatch):
    class FailingService:
        def __init__(self, session): pass
        async def search(self, *args, **kwargs):
            raise Exception("FAISS corrupted")
            
    monkeypatch.setattr("app.api.v1.queries.RetrievalService", FailingService)
    
    response = await client.post("/api/v1/queries/retrieve", json={"query": "test"})
    assert response.status_code == 500
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "RETRIEVAL_FAILED"
    assert "FAISS corrupted" not in data["error"]["message"] # Don't leak internals


# Integration test without mocking RetrievalService
@pytest.mark.asyncio
async def test_glue_layer_integration(monkeypatch):
    """
    Test the actual RetrievalService -> DB mapping.
    """
    doc_id = uuid.uuid4()
    chunk_1 = Chunk(id=uuid.uuid4(), document_id=doc_id, page_start=1, page_end=1, chunk_index=0, text_content="Apple banana cherry", faiss_index_id=0)
    chunk_2 = Chunk(id=uuid.uuid4(), document_id=doc_id, page_start=1, page_end=1, chunk_index=1, text_content="Dog elephant fox", faiss_index_id=1)
    
    class MockChunkRepo:
        def __init__(self, session): pass
        async def get_chunks_by_ids(self, chunk_ids):
            chunks = {chunk_1.id: chunk_1, chunk_2.id: chunk_2}
            return [chunks.get(cid) for cid in chunk_ids if cid in chunks]
            
    monkeypatch.setattr("app.services.retrieval.service.ChunkRepository", MockChunkRepo)
    
    # 2. Setup RetrievalService with mocked FAISS and embedding provider
    class MockFAISS:
        def search(self, query_emb, top_k):
            # For query "apple", return chunk 1
            if query_emb == [1.0]:
                return [(chunk_1.id, 0.9)]
            elif query_emb == [2.0]:
                return [(chunk_2.id, 0.8), (chunk_1.id, 0.4)]
            return []
            
    class MockEmbed:
        def embed_text(self, text):
            if "apple" in text.lower(): return [1.0]
            if "dog" in text.lower(): return [2.0]
            return [0.0]
            
    service = RetrievalService(
        session=None, # Session is not used because ChunkRepository is mocked
        embedding_provider=MockEmbed(),
        retrieval_provider=MockFAISS()
    )
    
    # 3. Test Retrieval
    results = await service.search("Find apple", top_k=5)
    assert len(results) == 1
    assert results[0].chunk_id == chunk_1.id
    assert results[0].text == "Apple banana cherry"
    assert results[0].page_number == 1
    
    # 4. Test Scoping
    wrong_doc_id = uuid.uuid4()
    results_scoped = await service.search("Find apple", top_k=5, document_id=wrong_doc_id)
    assert len(results_scoped) == 0
    
    results_scoped_right = await service.search("Find dog", top_k=5, document_id=doc_id)
    assert len(results_scoped_right) == 2
    assert results_scoped_right[0].chunk_id == chunk_2.id
