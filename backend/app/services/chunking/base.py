from __future__ import annotations

import abc
from dataclasses import dataclass
import uuid


@dataclass(frozen=True)
class ExtractedChunk:
    document_id: uuid.UUID
    page_start: int
    page_end: int
    chunk_index: int
    text_content: str


class ChunkingStrategy(abc.ABC):
    """Abstract interface for document chunking."""

    @abc.abstractmethod
    def chunk_text(self, document_id: uuid.UUID, page_number: int, text: str, start_chunk_index: int = 0) -> list[ExtractedChunk]:
        """Chunk a specific text (typically a page).

        Args:
            document_id: ID of the source document.
            page_number: Source page number.
            text: Text to chunk.
            start_chunk_index: The starting index for these chunks.

        Returns:
            Ordered list of ExtractedChunk.
        """
        pass
