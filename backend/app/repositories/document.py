import uuid
from typing import Sequence

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.document import Document


class DocumentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, document: Document) -> Document:
        self.session.add(document)
        await self.session.flush()
        return document

    async def get_by_id(
        self, document_id: uuid.UUID, *, load_pages: bool = False,
    ) -> Document | None:
        stmt = select(Document).where(Document.id == document_id)
        if load_pages:
            stmt = stmt.options(selectinload(Document.pages))
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_documents(
        self, *, offset: int = 0, limit: int = 20,
    ) -> tuple[Sequence[Document], int]:
        count_stmt = select(func.count()).select_from(Document)
        total = (await self.session.execute(count_stmt)).scalar_one()

        stmt = (
            select(Document)
            .order_by(Document.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all(), total
