from typing import Sequence
import uuid

def calculate_recall_at_k(retrieved_chunk_ids: Sequence[uuid.UUID], relevant_chunk_ids: Sequence[uuid.UUID], k: int) -> float:
    """
    Calculate Recall@K for a single query.
    Returns 1.0 if at least one relevant chunk is in the top K retrieved chunks, else 0.0.
    """
    if not relevant_chunk_ids:
        return 0.0
        
    top_k_retrieved = retrieved_chunk_ids[:k]
    
    for relevant_id in relevant_chunk_ids:
        if relevant_id in top_k_retrieved:
            return 1.0
            
    return 0.0

def calculate_mrr(retrieved_chunk_ids: Sequence[uuid.UUID], relevant_chunk_ids: Sequence[uuid.UUID]) -> float:
    """
    Calculate Reciprocal Rank for a single query.
    Returns 1/rank of the first relevant chunk found, else 0.0.
    """
    if not relevant_chunk_ids:
        return 0.0
        
    for rank_idx, retrieved_id in enumerate(retrieved_chunk_ids):
        if retrieved_id in relevant_chunk_ids:
            return 1.0 / (rank_idx + 1)
            
    return 0.0

def aggregate_metric(scores: Sequence[float]) -> float:
    """Average a list of scores."""
    if not scores:
        return 0.0
    return sum(scores) / len(scores)
