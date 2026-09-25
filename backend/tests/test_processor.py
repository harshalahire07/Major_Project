"""Unit tests for PyMuPDF processor — independent of FastAPI."""
from __future__ import annotations

import tempfile
from pathlib import Path

import pymupdf as fitz
import pytest

from app.services.documents.pymupdf_processor import PyMuPDFProcessor, normalize_text


def _make_pdf(pages: list[str], path: Path) -> Path:
    """Create a real PDF with the given page texts."""
    doc = fitz.open()
    for text in pages:
        page = doc.new_page()
        # Insert text at (72, 72) — standard margin
        page.insert_text((72, 72), text, fontsize=12)
    doc.save(str(path))
    doc.close()
    return path


class TestNormalizeText:
    def test_collapses_internal_whitespace(self) -> None:
        assert normalize_text("hello   world") == "hello world"

    def test_collapses_tabs(self) -> None:
        assert normalize_text("hello\tworld") == "hello world"

    def test_preserves_single_newlines(self) -> None:
        result = normalize_text("line1\nline2")
        assert result == "line1\nline2"

    def test_collapses_multiple_blank_lines(self) -> None:
        result = normalize_text("a\n\n\n\nb")
        assert result == "a\n\nb"

    def test_strips_leading_trailing(self) -> None:
        result = normalize_text("  \n  hello  \n  ")
        assert result == "hello"

    def test_preserves_numbers_punctuation(self) -> None:
        text = "Price: $1,234.56 (15% off!)"
        assert normalize_text(text) == text

    def test_empty_string(self) -> None:
        assert normalize_text("") == ""


class TestPyMuPDFProcessor:
    def setup_method(self) -> None:
        self.processor = PyMuPDFProcessor()

    def test_single_page_extraction(self, tmp_path: Path) -> None:
        pdf_path = _make_pdf(["Hello World"], tmp_path / "single.pdf")
        pages = self.processor.extract(str(pdf_path))
        assert len(pages) == 1
        assert pages[0].page_number == 1
        assert "Hello World" in pages[0].text

    def test_multi_page_extraction(self, tmp_path: Path) -> None:
        pdf_path = _make_pdf(
            ["Page one content", "Page two content", "Page three content"],
            tmp_path / "multi.pdf",
        )
        pages = self.processor.extract(str(pdf_path))
        assert len(pages) == 3
        assert pages[0].page_number == 1
        assert pages[1].page_number == 2
        assert pages[2].page_number == 3

    def test_page_ordering(self, tmp_path: Path) -> None:
        texts = [f"Content of page {i}" for i in range(1, 6)]
        pdf_path = _make_pdf(texts, tmp_path / "ordered.pdf")
        pages = self.processor.extract(str(pdf_path))
        for i, page in enumerate(pages):
            assert page.page_number == i + 1
            assert f"Content of page {i + 1}" in page.text

    def test_empty_page_handling(self, tmp_path: Path) -> None:
        """A page with no text should still appear with empty string."""
        doc = fitz.open()
        doc.new_page()  # empty page
        path = tmp_path / "empty_page.pdf"
        doc.save(str(path))
        doc.close()

        pages = self.processor.extract(str(path))
        assert len(pages) == 1
        assert pages[0].page_number == 1
        assert pages[0].text == ""

    def test_text_preservation(self, tmp_path: Path) -> None:
        original = "Temperature was 98.6°F. Results: 42% improvement."
        pdf_path = _make_pdf([original], tmp_path / "preserve.pdf")
        pages = self.processor.extract(str(pdf_path))
        assert original in pages[0].text

    def test_invalid_pdf_raises(self, tmp_path: Path) -> None:
        bad_file = tmp_path / "bad.pdf"
        bad_file.write_bytes(b"this is not a PDF")
        with pytest.raises(ValueError, match="Failed to open PDF"):
            self.processor.extract(str(bad_file))

    def test_nonexistent_file_raises(self) -> None:
        with pytest.raises(ValueError, match="Failed to open PDF"):
            self.processor.extract("/nonexistent/path.pdf")
