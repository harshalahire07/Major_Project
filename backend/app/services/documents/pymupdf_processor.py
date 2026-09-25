from __future__ import annotations

import logging
import re

import pymupdf as fitz  # PyMuPDF

from app.services.documents.base import DocumentProcessor, ExtractedPage

logger = logging.getLogger(__name__)


def normalize_text(raw: str) -> str:
    """Conservative text normalization.

    - Collapses runs of whitespace within lines (tabs, multiple spaces) to single space.
    - Strips leading/trailing whitespace from each line.
    - Removes blank lines that are purely whitespace.
    - Preserves paragraph breaks (single newlines between content lines).
    - Does NOT alter punctuation, numbers, case, or meaningful content.
    """
    lines: list[str] = []
    for line in raw.splitlines():
        cleaned = re.sub(r"[ \t]+", " ", line).strip()
        lines.append(cleaned)

    # Collapse multiple consecutive blank lines into one
    result_lines: list[str] = []
    prev_blank = False
    for line in lines:
        if line == "":
            if not prev_blank:
                result_lines.append("")
            prev_blank = True
        else:
            result_lines.append(line)
            prev_blank = False

    # Strip leading/trailing blank lines from the whole text
    text = "\n".join(result_lines).strip()
    return text


class PyMuPDFProcessor(DocumentProcessor):
    """Extracts text from PDFs using PyMuPDF (fitz)."""

    def extract(self, file_path: str) -> list[ExtractedPage]:
        try:
            doc = fitz.open(file_path)
        except Exception as exc:
            raise ValueError(f"Failed to open PDF: {exc}") from exc

        try:
            if doc.page_count == 0:
                raise ValueError("PDF contains no pages")

            pages: list[ExtractedPage] = []
            for page_index in range(doc.page_count):
                page = doc.load_page(page_index)
                raw_text = page.get_text("text")
                text = normalize_text(raw_text)
                pages.append(ExtractedPage(
                    page_number=page_index + 1,
                    text=text,
                ))

            logger.info(
                "Extracted %d pages from %s", len(pages), file_path,
            )
            return pages
        finally:
            doc.close()
