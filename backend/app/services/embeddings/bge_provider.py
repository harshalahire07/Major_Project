from __future__ import annotations

import logging

from sentence_transformers import SentenceTransformer

from app.services.embeddings.base import EmbeddingProvider

logger = logging.getLogger(__name__)


class BGEEmbeddingProvider(EmbeddingProvider):
    """Embedding provider using BAAI/bge-small-en-v1.5 via SentenceTransformers."""

    def __init__(self, model_name: str = "BAAI/bge-small-en-v1.5", device: str | None = None) -> None:
        logger.info("Loading embedding model: %s on %s", model_name, device or "default")
        try:
            self.model = SentenceTransformer(model_name, device=device)
            self._dimension = self.model.get_embedding_dimension()
        except Exception as e:
            logger.error("Failed to load embedding model %s: %s", model_name, e)
            raise

    @property
    def dimension(self) -> int:
        return self._dimension

    def embed_text(self, text: str) -> list[float]:
        """Embed a single string, normalized for cosine similarity."""
        if not text or not text.strip():
            # Return zero vector if text is empty
            return [0.0] * self.dimension

        # normalize_embeddings=True is required for cosine similarity when used with inner product in FAISS
        embedding = self.model.encode(text, normalize_embeddings=True)
        return embedding.tolist()

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """Embed a batch of strings, normalized for cosine similarity."""
        if not texts:
            return []

        embeddings = self.model.encode(texts, normalize_embeddings=True)
        return embeddings.tolist()
