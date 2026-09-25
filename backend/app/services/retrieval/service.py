from __future__ import annotations

import logging
import uuid
from typing import Sequence

from app.models.document import Chunk
from app.services.embeddings.base import EmbeddingProvider
from app.services.embeddings.bge_provider import BGEEmbeddingProvider
from app.services.retrieval.base import RetrievalProvider, RetrievalResult
from app.services.retrieval.faiss_retriever import FAISSRetriever

from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.chunk import ChunkRepository
from app.core.config import settings

logger = logging.getLogger(__name__)


class RetrievalService:
    """Service to orchestrate embeddings and vector retrieval."""

    def __init__(
        self,
        session: AsyncSession,
        embedding_provider: EmbeddingProvider | None = None,
        retrieval_provider: RetrievalProvider | None = None,
    ) -> None:
        self.session = session
        self._chunk_repo = ChunkRepository(session)
        self.embedding = embedding_provider or BGEEmbeddingProvider()
        self.retriever = retrieval_provider or FAISSRetriever(dimension=self.embedding.dimension)

    def embed_and_index_chunks(self, chunks: Sequence[Chunk]) -> None:
        """
        Embed a list of chunks and add them to the vector store.
        """
        if not chunks:
            return

        logger.info("Embedding %d chunks", len(chunks))
        texts = [chunk.text_content for chunk in chunks]
        
        embeddings = self.embedding.embed_batch(texts)
        
        chunk_embeddings = [
            (chunk.id, vector)
            for chunk, vector in zip(chunks, embeddings)
        ]
        
        self.retriever.add_chunks(chunk_embeddings)
        self.retriever.save()
        logger.info("Indexed %d chunks successfully", len(chunks))

    async def search(self, query: str, top_k: int = settings.retrieval_top_k, document_id: uuid.UUID | None = None) -> list[RetrievalResult]:
        """
        Search for the most relevant chunks.
        """
        if not query.strip():
            return []

        query_embedding = self.embedding.embed_text(query)
        
        # If filtering by document_id, fetch more results from FAISS to increase 
        # the likelihood of finding enough chunks for the target document after post-filtering.
        fetch_k = top_k * 10 if document_id else top_k
        raw_results = self.retriever.search(query_embedding, top_k=fetch_k)
        
        if not raw_results:
            return []

        # raw_results is list[(chunk_id, score)]
        chunk_ids = [cid for cid, _ in raw_results]
        db_chunks = await self._chunk_repo.get_chunks_by_ids(chunk_ids)
        
        # Map db chunks by ID for quick lookup
        chunk_map = {c.id: c for c in db_chunks}
        
        results: list[RetrievalResult] = []
        for chunk_id, score in raw_results:
            db_chunk = chunk_map.get(chunk_id)
            if db_chunk:
                if document_id and db_chunk.document_id != document_id:
                    continue
                    
                results.append(
                    RetrievalResult(
                        chunk_id=db_chunk.id,
                        document_id=db_chunk.document_id,
                        page_number=db_chunk.page_start,
                        text=db_chunk.text_content,
                        score=score,
                    )
                )
                
                if len(results) >= top_k:
                    break
                
        return results

