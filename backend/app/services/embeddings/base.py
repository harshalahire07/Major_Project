from __future__ import annotations

import abc


class EmbeddingProvider(abc.ABC):
    """Abstract interface for embedding generation."""

    @property
    @abc.abstractmethod
    def dimension(self) -> int:
        """Return the vector dimension of the embeddings."""
        pass

    @abc.abstractmethod
    def embed_text(self, text: str) -> list[float]:
        """Embed a single string."""
        pass

    @abc.abstractmethod
    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """Embed a batch of strings."""
        pass
