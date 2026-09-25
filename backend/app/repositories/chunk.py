import uuid
from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.document import Chunk, Document


class ChunkRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create_chunks(self, chunks: list[Chunk]) -> None:
        """Bulk create chunks."""
        self.session.add_all(chunks)
        await self.session.flush()

    async def get_chunks_for_document(self, document_id: uuid.UUID) -> Sequence[Chunk]:
        """Get all chunks for a document ordered by chunk_index."""
        stmt = (
            select(Chunk)
            .where(Chunk.document_id == document_id)
            .order_by(Chunk.chunk_index.asc())
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_chunks_by_ids(self, chunk_ids: list[uuid.UUID]) -> Sequence[Chunk]:
        """Get specific chunks by their IDs."""
        if not chunk_ids:
            return []
        stmt = select(Chunk).where(Chunk.id.in_(chunk_ids))
        result = await self.session.execute(stmt)
        return result.scalars().all()
