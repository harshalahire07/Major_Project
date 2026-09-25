from __future__ import annotations

import json
import logging
import os
import uuid
from typing import Sequence
import numpy as np

import faiss

from app.services.retrieval.base import RetrievalProvider
from app.core.config import settings

logger = logging.getLogger(__name__)


class FAISSRetriever(RetrievalProvider):
    """Retrieval provider using FAISS and cosine similarity."""

    def __init__(
        self, 
        dimension: int, 
        index_path: str = settings.faiss_index_path, 
        mapping_path: str = settings.faiss_mapping_path
    ) -> None:
        self.dimension = dimension
        self.index_path = index_path
        self.mapping_path = mapping_path
        
        # FAISS Index mapping: FAISS uses integer IDs internally.
        # We need to map FAISS integer IDs to our UUIDs.
        self._faiss_to_uuid: dict[int, uuid.UUID] = {}
        self._next_id = 0
        
        self._load_or_create_index()

    def _load_or_create_index(self) -> None:
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        
        if os.path.exists(self.index_path) and os.path.exists(self.mapping_path):
            try:
                # Load index
                self.index = faiss.read_index(self.index_path)
                if self.index.d != self.dimension:
                    raise ValueError(f"Loaded index dimension {self.index.d} does not match expected {self.dimension}")
                    
                # Load mapping
                with open(self.mapping_path, "r", encoding="utf-8") as f:
                    str_mapping = json.load(f)
                    self._faiss_to_uuid = {int(k): uuid.UUID(v) for k, v in str_mapping.items()}
                
                # Update next ID
                if self._faiss_to_uuid:
                    self._next_id = max(self._faiss_to_uuid.keys()) + 1
                    
                logger.info("Loaded FAISS index with %d vectors", self.index.ntotal)
            except Exception as e:
                logger.error("Failed to load FAISS index: %s", e)
                self._create_new_index()
        else:
            self._create_new_index()

    def _create_new_index(self) -> None:
        logger.info("Creating new FAISS index of dimension %d", self.dimension)
        # Using IndexFlatIP for cosine similarity (requires normalized vectors)
        self.index = faiss.IndexIDMap(faiss.IndexFlatIP(self.dimension))
        self._faiss_to_uuid = {}
        self._next_id = 0

    def add_chunks(self, chunks: Sequence[tuple[uuid.UUID, list[float]]]) -> None:
        if not chunks:
            return

        embeddings = []
        ids = []
        
        for chunk_id, vector in chunks:
            if len(vector) != self.dimension:
                raise ValueError(f"Vector dimension {len(vector)} does not match index {self.dimension}")
            
            embeddings.append(vector)
            faiss_id = self._next_id
            ids.append(faiss_id)
            self._faiss_to_uuid[faiss_id] = chunk_id
            self._next_id += 1
            
        vectors_np = np.array(embeddings, dtype=np.float32)
        ids_np = np.array(ids, dtype=np.int64)
        
        self.index.add_with_ids(vectors_np, ids_np)
        
    def search(self, query_embedding: list[float], top_k: int = 5) -> list[tuple[uuid.UUID, float]]:
        if self.index.ntotal == 0:
            return []
            
        if len(query_embedding) != self.dimension:
            raise ValueError(f"Query vector dimension {len(query_embedding)} does not match index {self.dimension}")

        query_np = np.array([query_embedding], dtype=np.float32)
        
        # search returns distances (scores) and indices (faiss IDs)
        scores, indices = self.index.search(query_np, top_k)
        
        results = []
        for i in range(len(indices[0])):
            faiss_id = int(indices[0][i])
            if faiss_id == -1:  # FAISS returns -1 if there are not enough results
                continue
                
            score = float(scores[0][i])
            chunk_id = self._faiss_to_uuid.get(faiss_id)
            if chunk_id:
                results.append((chunk_id, score))
                
        return results

    def save(self) -> None:
        faiss.write_index(self.index, self.index_path)
        
        # Save mapping
        str_mapping = {str(k): str(v) for k, v in self._faiss_to_uuid.items()}
        with open(self.mapping_path, "w", encoding="utf-8") as f:
            json.dump(str_mapping, f)
            
        logger.info("Saved FAISS index with %d vectors", self.index.ntotal)
