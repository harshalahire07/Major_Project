import math
import os
import tempfile
import uuid

import numpy as np
import pytest

from app.services.embeddings.bge_provider import BGEEmbeddingProvider
from app.services.retrieval.faiss_retriever import FAISSRetriever


@pytest.fixture(scope="module")
def bge_provider():
    # Load on CPU to avoid GPU OOM during tests
    return BGEEmbeddingProvider(device="cpu")


class TestEmbeddings:
    def test_embedding_dimension(self, bge_provider):
        assert bge_provider.dimension == 384
        
    def test_single_embedding_normalization(self, bge_provider):
        text = "This is a test document."
        vec = bge_provider.embed_text(text)
        
        assert len(vec) == 384
        # Calculate L2 norm
        norm = math.sqrt(sum(x * x for x in vec))
        assert math.isclose(norm, 1.0, rel_tol=1e-5)
        
    def test_deterministic_output(self, bge_provider):
        text = "Consistent hashing."
        vec1 = bge_provider.embed_text(text)
        vec2 = bge_provider.embed_text(text)
        assert vec1 == vec2

    def test_batch_embedding(self, bge_provider):
        texts = ["First document", "Second document", "Third one"]
        vecs = bge_provider.embed_batch(texts)
        assert len(vecs) == 3
        assert all(len(v) == 384 for v in vecs)

    def test_empty_invalid_input(self, bge_provider):
        assert bge_provider.embed_text("") == [0.0] * 384
        assert bge_provider.embed_batch([]) == []


class TestFAISSRetriever:
    @pytest.fixture
    def temp_faiss_paths(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            index_path = os.path.join(temp_dir, "index.faiss")
            mapping_path = os.path.join(temp_dir, "mapping.json")
            yield index_path, mapping_path

    def test_index_creation_and_search(self, temp_faiss_paths):
        idx_path, map_path = temp_faiss_paths
        retriever = FAISSRetriever(dimension=4, index_path=idx_path, mapping_path=map_path)
        
        chunk_id_1 = uuid.uuid4()
        chunk_id_2 = uuid.uuid4()
        
        # Vectors must be normalized for cosine similarity
        v1 = [1.0, 0.0, 0.0, 0.0]
        v2 = [0.0, 1.0, 0.0, 0.0]
        
        retriever.add_chunks([(chunk_id_1, v1), (chunk_id_2, v2)])
        
        assert retriever.index.ntotal == 2
        
        # Search exact match for v1
        results = retriever.search(query_embedding=v1, top_k=1)
        assert len(results) == 1
        res_chunk_id, res_score = results[0]
        assert res_chunk_id == chunk_id_1
        assert math.isclose(res_score, 1.0, rel_tol=1e-5)

    def test_index_persistence_and_reload(self, temp_faiss_paths):
        idx_path, map_path = temp_faiss_paths
        
        # First session
        retriever1 = FAISSRetriever(dimension=4, index_path=idx_path, mapping_path=map_path)
        chunk_id = uuid.uuid4()
        retriever1.add_chunks([(chunk_id, [0.5, 0.5, 0.5, 0.5])])
        retriever1.save()
        
        # Reload session
        retriever2 = FAISSRetriever(dimension=4, index_path=idx_path, mapping_path=map_path)
        assert retriever2.index.ntotal == 1
        
        # Ensure mapping survived
        results = retriever2.search(query_embedding=[0.5, 0.5, 0.5, 0.5], top_k=1)
        assert len(results) == 1
        assert results[0][0] == chunk_id

    def test_empty_index_handling(self, temp_faiss_paths):
        idx_path, map_path = temp_faiss_paths
        retriever = FAISSRetriever(dimension=4, index_path=idx_path, mapping_path=map_path)
        assert retriever.search([1.0, 0, 0, 0]) == []
