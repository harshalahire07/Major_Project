from __future__ import annotations

import abc
from dataclasses import dataclass


@dataclass(frozen=True)
class ExtractedPage:
    page_number: int
    text: str


class DocumentProcessor(abc.ABC):
    """Extracts text from a document file, returning per-page results."""

    @abc.abstractmethod
    def extract(self, file_path: str) -> list[ExtractedPage]:
        """Extract text from each page of the document.

        Args:
            file_path: Absolute path to the document on disk.

        Returns:
            Ordered list of ExtractedPage, one per page (1-indexed).

        Raises:
            ValueError: If the file cannot be parsed as a valid document.
        """
