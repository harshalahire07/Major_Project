"""API integration tests for document endpoints."""
from __future__ import annotations

import socket

import pymupdf as fitz
import pytest
from httpx import AsyncClient

from app.core.config import settings


def _db_available() -> bool:
    """Quick TCP probe to check if PostgreSQL is reachable."""
    try:
        sock = socket.create_connection(
            (settings.database_host, settings.database_port), timeout=1,
        )
        sock.close()
        return True
    except OSError:
        return False


def _create_pdf_bytes(pages: list[str]) -> bytes:
    """Generate valid PDF bytes with the given page texts."""
    doc = fitz.open()
    for text in pages:
        page = doc.new_page()
        if text:
            page.insert_text((72, 72), text, fontsize=12)
    data = doc.tobytes()
    doc.close()
    return data


class TestUploadValidation:
    async def test_rejects_non_pdf_extension(self, client: AsyncClient) -> None:
        files = {"file": ("test.txt", b"Hello World", "text/plain")}
        response = await client.post("/api/v1/documents", files=files)
        assert response.status_code == 400
        body = response.json()
        assert body["error"]["code"] == "INVALID_FILE_TYPE"

    async def test_rejects_invalid_pdf_content(self, client: AsyncClient) -> None:
        files = {"file": ("fake.pdf", b"not a real PDF file content", "application/pdf")}
        response = await client.post("/api/v1/documents", files=files)
        assert response.status_code == 400
        body = response.json()
        assert body["error"]["code"] == "INVALID_FILE_TYPE"

    async def test_rejects_oversized_file(self, client: AsyncClient) -> None:
        original = settings.max_upload_size_bytes
        settings.max_upload_size_bytes = 100
        try:
            pdf_data = _create_pdf_bytes(["some content"])
            files = {"file": ("big.pdf", pdf_data, "application/pdf")}
            response = await client.post("/api/v1/documents", files=files)
            assert response.status_code == 413
            body = response.json()
            assert body["error"]["code"] == "FILE_TOO_LARGE"
        finally:
            settings.max_upload_size_bytes = original

    async def test_error_response_envelope(self, client: AsyncClient) -> None:
        files = {"file": ("test.txt", b"not pdf", "text/plain")}
        response = await client.post("/api/v1/documents", files=files)
        body = response.json()
        assert "error" in body
        assert "code" in body["error"]
        assert "message" in body["error"]

    async def test_no_internal_paths_in_error(self, client: AsyncClient) -> None:
        files = {"file": ("bad.pdf", b"not a real PDF", "application/pdf")}
        response = await client.post("/api/v1/documents", files=files)
        body_str = response.text
        assert "C:\\" not in body_str
        assert "/home" not in body_str


class TestDocumentRetrieval:
    @pytest.mark.skipif(
        not _db_available(), reason="PostgreSQL is not available",
    )
    async def test_missing_document_returns_404(self, client: AsyncClient) -> None:
        response = await client.get(
            "/api/v1/documents/00000000-0000-0000-0000-000000000000"
        )
        assert response.status_code == 404
        body = response.json()
        assert body["error"]["code"] == "DOCUMENT_NOT_FOUND"

    async def test_invalid_uuid_returns_422(self, client: AsyncClient) -> None:
        response = await client.get("/api/v1/documents/not-a-uuid")
        assert response.status_code == 422


class TestListEndpoint:
    async def test_list_validates_limit_range(self, client: AsyncClient) -> None:
        response = await client.get("/api/v1/documents?limit=999")
        assert response.status_code == 422

    async def test_list_validates_negative_offset(self, client: AsyncClient) -> None:
        response = await client.get("/api/v1/documents?offset=-1")
        assert response.status_code == 422


class TestHealthStillWorks:
    async def test_health_returns_ok(self, client: AsyncClient) -> None:
        response = await client.get("/api/health")
        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "healthy"
        assert "version" in body
        assert "environment" in body
