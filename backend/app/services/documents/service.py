from __future__ import annotations

import logging
import uuid
from pathlib import Path
from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.document import Document, Page
from app.repositories.document import DocumentRepository
from app.services.documents.base import DocumentProcessor
from app.services.documents.pymupdf_processor import PyMuPDFProcessor

logger = logging.getLogger(__name__)

# PDF magic bytes: %PDF
_PDF_MAGIC = b"%PDF"


class DocumentService:
    def __init__(
        self,
        session: AsyncSession,
        processor: DocumentProcessor | None = None,
    ) -> None:
        self._session = session
        self._repo = DocumentRepository(session)
        self._processor = processor or PyMuPDFProcessor()
        self._upload_dir = settings.resolved_upload_dir

    async def upload(
        self,
        filename: str,
        content: bytes,
        title: str | None = None,
    ) -> Document:
        """Validate, store, extract, and persist a PDF document.

        Args:
            filename: Original uploaded filename.
            content: Raw file bytes.
            title: Optional display title; defaults to filename.

        Returns:
            The persisted Document with populated pages.

        Raises:
            ValueError: On validation failure (file type, size, content).
        """
        self._validate(filename, content)

        doc_id = uuid.uuid4()
        safe_name = f"{doc_id}.pdf"
        doc_dir = self._upload_dir / str(doc_id)
        doc_dir.mkdir(parents=True, exist_ok=True)
        file_path = doc_dir / safe_name

        file_path.write_bytes(content)
        logger.info("Stored upload %s → %s", filename, file_path)

        document = Document(
            id=doc_id,
            title=title or filename,
            filename=filename,
            file_path=str(file_path),
            file_size_bytes=len(content),
            page_count=0,
            status="processing",
        )
        await self._repo.create(document)

        try:
            pages_data = self._processor.extract(str(file_path))
        except ValueError:
            document.status = "failed"
            document.error_message = "Failed to extract text from PDF"
            self._cleanup_file(file_path, doc_dir)
            raise

        document.page_count = len(pages_data)
        for ep in pages_data:
            document.pages.append(Page(
                document_id=doc_id,
                page_number=ep.page_number,
                text_content=ep.text,
                text_length=len(ep.text),
            ))
        document.status = "processed"

        logger.info(
            "Document %s processed: %d pages", doc_id, document.page_count,
        )
        return document

    async def get_document(self, document_id: uuid.UUID) -> Document | None:
        return await self._repo.get_by_id(document_id, load_pages=True)

    async def list_documents(
        self, *, offset: int = 0, limit: int = 20,
    ) -> tuple[Sequence[Document], int]:
        return await self._repo.list_documents(offset=offset, limit=limit)

    def _validate(self, filename: str, content: bytes) -> None:
        if len(content) > settings.max_upload_size_bytes:
            max_mb = settings.max_upload_size_bytes // (1024 * 1024)
            raise ValueError(
                f"FILE_TOO_LARGE:File exceeds the {max_mb} MB limit."
            )

        if not filename.lower().endswith(".pdf"):
            raise ValueError(
                "INVALID_FILE_TYPE:Only PDF files are supported."
            )

        if not content[:8].startswith(_PDF_MAGIC):
            raise ValueError(
                "INVALID_FILE_TYPE:File content is not a valid PDF."
            )

    @staticmethod
    def _cleanup_file(file_path: Path, doc_dir: Path) -> None:
        try:
            file_path.unlink(missing_ok=True)
            if doc_dir.exists() and not any(doc_dir.iterdir()):
                doc_dir.rmdir()
        except OSError:
            logger.warning("Failed to clean up %s", file_path, exc_info=True)
