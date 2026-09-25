from __future__ import annotations

import logging
import uuid
import tiktoken

from app.services.chunking.base import ChunkingStrategy, ExtractedChunk
from app.core.config import settings

logger = logging.getLogger(__name__)


class TiktokenChunker(ChunkingStrategy):
    """Chunks text using tiktoken, ensuring chunks don't cross page boundaries."""

    def __init__(
        self,
        chunk_size: int = settings.chunk_size_tokens,
        chunk_overlap: int = settings.chunk_overlap_tokens,
        encoding_name: str = "cl100k_base"
    ) -> None:
        if chunk_size <= 0:
            raise ValueError("Chunk size must be positive")
        if chunk_overlap < 0:
            raise ValueError("Chunk overlap cannot be negative")
        if chunk_overlap >= chunk_size:
            raise ValueError("Chunk overlap must be less than chunk size")

        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        try:
            self.encoder = tiktoken.get_encoding(encoding_name)
        except Exception as e:
            logger.error("Failed to load tiktoken encoding: %s", e)
            raise

    def chunk_text(self, document_id: uuid.UUID, page_number: int, text: str, start_chunk_index: int = 0) -> list[ExtractedChunk]:
        if not text or not text.strip():
            return []

        tokens = self.encoder.encode(text)
        total_tokens = len(tokens)
        chunks: list[ExtractedChunk] = []

        if total_tokens == 0:
            return []

        idx = 0
        current_chunk_index = start_chunk_index

        while idx < total_tokens:
            end_idx = min(idx + self.chunk_size, total_tokens)
            chunk_tokens = tokens[idx:end_idx]
            chunk_text = self.encoder.decode(chunk_tokens)

            chunks.append(ExtractedChunk(
                document_id=document_id,
                page_start=page_number,
                page_end=page_number,
                chunk_index=current_chunk_index,
                text_content=chunk_text.strip()
            ))

            current_chunk_index += 1
            idx += (self.chunk_size - self.chunk_overlap)

        return chunks
