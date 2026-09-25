from __future__ import annotations

import abc
import uuid
from dataclasses import dataclass
from typing import Sequence


@dataclass(frozen=True)
class RetrievalResult:
    chunk_id: uuid.UUID
    document_id: uuid.UUID
    page_number: int
    text: str
    score: float


class RetrievalProvider(abc.ABC):
    """Abstract interface for vector retrieval."""

    @abc.abstractmethod
    def add_chunks(self, chunks: Sequence[tuple[uuid.UUID, list[float]]]) -> None:
        """
        Add new chunk embeddings to the index.
        Args:
            chunks: A list of tuples containing (chunk_id, embedding_vector).
        """
        pass

    @abc.abstractmethod
    def search(self, query_embedding: list[float], top_k: int = 5) -> list[tuple[uuid.UUID, float]]:
        """
        Search the index for the most similar chunks.
        Args:
            query_embedding: The vector for the query.
            top_k: Number of results to return.
        Returns:
            A list of tuples (chunk_id, similarity_score).
        """
        pass
        
    @abc.abstractmethod
    def save(self) -> None:
        """Save the index and mappings to disk."""
        pass
