from __future__ import annotations

import logging
import uuid
from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document import Chunk, Document
from app.repositories.chunk import ChunkRepository
from app.repositories.document import DocumentRepository
from app.services.chunking.base import ChunkingStrategy
from app.services.chunking.tiktoken_chunker import TiktokenChunker

logger = logging.getLogger(__name__)


class ChunkingService:
    def __init__(
        self,
        session: AsyncSession,
        strategy: ChunkingStrategy | None = None,
    ) -> None:
        self._session = session
        self._chunk_repo = ChunkRepository(session)
        self._doc_repo = DocumentRepository(session)
        self._strategy = strategy or TiktokenChunker()

    async def chunk_document(self, document_id: uuid.UUID) -> Sequence[Chunk]:
        """
        Loads a document's pages, chunks them using the strategy,
        persists the chunks to the database, and returns them.
        """
        document = await self._doc_repo.get_by_id(document_id, load_pages=True)
        if not document:
            raise ValueError(f"Document {document_id} not found")

        # If it already has chunks, we might want to delete them or raise an error.
        # For now, we assume it's a fresh document, or we just append.
        # Let's clear existing chunks if any exist, although the DB cascade might handle it if we delete.
        # Actually, let's just generate and insert.
        
        db_chunks: list[Chunk] = []
        global_chunk_index = 0

        for page in document.pages:
            extracted_chunks = self._strategy.chunk_text(
                document_id=document.id,
                page_number=page.page_number,
                text=page.text_content,
                start_chunk_index=global_chunk_index
            )
            
            for ec in extracted_chunks:
                chunk = Chunk(
                    document_id=ec.document_id,
                    page_start=ec.page_start,
                    page_end=ec.page_end,
                    chunk_index=ec.chunk_index,
                    text_content=ec.text_content,
                    text_length=len(ec.text_content)
                )
                db_chunks.append(chunk)
                
            global_chunk_index += len(extracted_chunks)

        if db_chunks:
            await self._chunk_repo.create_chunks(db_chunks)
            await self._session.commit()
            logger.info("Created %d chunks for document %s", len(db_chunks), document_id)

        return db_chunks
