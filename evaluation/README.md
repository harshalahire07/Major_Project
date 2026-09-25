# Retrieval Evaluation

This directory contains the foundation for offline retrieval evaluation, ensuring the quality of our search results before they are passed to the language model for generation and verification.

## Structure

- `datasets/`: Contains ground-truth evaluation datasets in JSONL format.
- `scripts/`: Scripts to run evaluations against the current model and index.

## Dataset Format

Evaluation datasets should be placed in `datasets/` and follow the JSONL schema below. Each line represents a single test query.

```json
{
  "query_id": "q-001",
  "query": "What is the capital of France?",
  "relevant_document_id": "123e4567-e89b-12d3-a456-426614174000",
  "relevant_chunk_ids": [
    "987e6543-e21b-34c1-b789-526614174999"
  ]
}
```

- **query_id**: A unique identifier for the query.
- **query**: The exact search text.
- **relevant_document_id**: The UUID of the document containing the answer.
- **relevant_chunk_ids**: A list of UUIDs corresponding to the chunks that contain the direct evidence for the query.

*Note: Generating ground-truth data from the retriever itself is strictly prohibited. Ground-truth data must be manually curated or derived from validated external datasets.*

## Metrics

### Recall@K
Recall@K measures whether the correct chunk is present within the top K results returned by the retriever.
- Formula: `1` if any relevant chunk is in the top K results, `0` otherwise.
- Aggregation: The average Recall@K across all queries.

### Mean Reciprocal Rank (MRR)
MRR evaluates how high up the relevant chunk appears in the ranked results.
- Formula: `1 / rank` where rank is the position (1-indexed) of the first relevant chunk in the results. If no relevant chunk is found, the score is `0`.
- Aggregation: The average MRR across all queries.
