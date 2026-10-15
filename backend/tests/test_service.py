"""Service-level tests for DocumentService.

Tests the upload flow using a real PyMuPDFProcessor but no database.
The repository is mocked so that persistence logic can be tested
in isolation from PostgreSQL.
"""
from __future__ import annotations

from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

import pymupdf as fitz
import pytest

from app.services.documents.service import DocumentService


def _create_pdf_bytes(pages: list[str]) -> bytes:
    doc = fitz.open()
    for text in pages:
        page = doc.new_page()
        if text:
            page.insert_text((72, 72), text, fontsize=12)
    data = doc.tobytes()
    doc.close()
    return data


@pytest.fixture
def mock_session() -> AsyncMock:
    session = AsyncMock()
    session.add = MagicMock()
    session.add_all = MagicMock()
    session.flush = AsyncMock()
    return session


@pytest.fixture
def service(mock_session: AsyncMock, tmp_path: Path) -> DocumentService:
    from app.core.config import settings

    original = settings.upload_dir
    settings.upload_dir = str(tmp_path)
    svc = DocumentService(mock_session)
    yield svc
    settings.upload_dir = original


class TestDocumentUpload:
    async def test_valid_single_page_pdf(self, service: DocumentService) -> None:
        content = _create_pdf_bytes(["Hello World"])
        doc = await service.upload("test.pdf", content)

        assert doc.status == "processed"
        assert doc.page_count == 1
        assert doc.filename == "test.pdf"
        assert len(doc.pages) == 1
        assert doc.pages[0].page_number == 1
        assert "Hello World" in doc.pages[0].text_content

    async def test_valid_multi_page_pdf(self, service: DocumentService) -> None:
        content = _create_pdf_bytes(["Page 1", "Page 2", "Page 3"])
        doc = await service.upload("multi.pdf", content)

        assert doc.status == "processed"
        assert doc.page_count == 3
        assert len(doc.pages) == 3
        for i, page in enumerate(doc.pages):
            assert page.page_number == i + 1

    async def test_page_ordering_preserved(self, service: DocumentService) -> None:
        texts = [f"Content for page {i}" for i in range(1, 8)]
        content = _create_pdf_bytes(texts)
        doc = await service.upload("ordered.pdf", content)

        for i, page in enumerate(doc.pages):
            assert page.page_number == i + 1
            assert f"Content for page {i + 1}" in page.text_content

    async def test_empty_page_handled(self, service: DocumentService) -> None:
        """An empty page should be stored with empty text."""
        d = fitz.open()
        d.new_page()  # blank page
        d.new_page()
        page2 = d[-1]
        page2.insert_text((72, 72), "Page two text", fontsize=12)
        content = d.tobytes()
        d.close()

        doc = await service.upload("empty.pdf", content)
        assert doc.page_count == 2
        assert doc.pages[0].text_content == ""
        assert doc.pages[0].text_length == 0
        assert "Page two text" in doc.pages[1].text_content

    async def test_text_preservation(self, service: DocumentService) -> None:
        """Numbers, punctuation, and special chars must be preserved."""
        text = "Results: 98.6°F, $1,234 (15% margin)."
        content = _create_pdf_bytes([text])
        doc = await service.upload("preserve.pdf", content)
        assert text in doc.pages[0].text_content

    async def test_page_text_length_matches(self, service: DocumentService) -> None:
        content = _create_pdf_bytes(["Hello"])
        doc = await service.upload("len.pdf", content)
        for page in doc.pages:
            assert page.text_length == len(page.text_content)

    async def test_custom_title(self, service: DocumentService) -> None:
        content = _create_pdf_bytes(["content"])
        doc = await service.upload("file.pdf", content, title="My Document")
        assert doc.title == "My Document"

    async def test_title_defaults_to_filename(self, service: DocumentService) -> None:
        content = _create_pdf_bytes(["content"])
        doc = await service.upload("report.pdf", content)
        assert doc.title == "report.pdf"

    async def test_file_stored_on_disk(
        self, service: DocumentService, tmp_path: Path,
    ) -> None:
        content = _create_pdf_bytes(["stored"])
        doc = await service.upload("disk.pdf", content)
        stored_path = Path(doc.file_path)
        assert stored_path.exists()
        assert stored_path.read_bytes() == content

    async def test_collision_safe_storage(self, service: DocumentService) -> None:
        """Two uploads with the same filename should not collide."""
        content = _create_pdf_bytes(["first"])
        doc1 = await service.upload("same.pdf", content)
        doc2 = await service.upload("same.pdf", content)
        assert doc1.file_path != doc2.file_path

    async def test_document_persistence_fields(
        self, service: DocumentService,
    ) -> None:
        content = _create_pdf_bytes(["A", "B"])
        doc = await service.upload("fields.pdf", content)
        assert doc.id is not None
        assert doc.file_size_bytes == len(content)
        assert doc.status == "processed"

    async def test_page_persistence_fields(self, service: DocumentService) -> None:
        content = _create_pdf_bytes(["Page content"])
        doc = await service.upload("pages.pdf", content)
        page = doc.pages[0]
        assert page.document_id == doc.id
        assert page.page_number == 1
        assert page.text_length > 0


class TestDocumentValidation:
    async def test_rejects_non_pdf_extension(self, service: DocumentService) -> None:
        with pytest.raises(ValueError, match="INVALID_FILE_TYPE"):
            await service.upload("test.txt", b"not a pdf")

    async def test_rejects_invalid_content(self, service: DocumentService) -> None:
        with pytest.raises(ValueError, match="INVALID_FILE_TYPE"):
            await service.upload("fake.pdf", b"this is not PDF content")

    async def test_rejects_oversized(self, service: DocumentService) -> None:
        from app.core.config import settings

        original = settings.max_upload_size_bytes
        settings.max_upload_size_bytes = 100
        try:
            content = _create_pdf_bytes(["big content"])
            with pytest.raises(ValueError, match="FILE_TOO_LARGE"):
                await service.upload("big.pdf", content)
        finally:
            settings.max_upload_size_bytes = original
