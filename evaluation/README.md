# Retrieval & Pipeline Evaluation

This directory contains the foundation for offline retrieval evaluation (M3) and the Pilot Evaluation Harness (M9A).

## Structure

- `dataset/`: Contains evaluation datasets in JSONL format, including `pilot.jsonl`.
- `scripts/`: Scripts to run evaluations, such as `run_pilot.py`.
- `results/`: Output directories for `baseline.jsonl` and `full.jsonl` raw API responses.
- `metrics/`: Information regarding future metrics computation (deferred until M9B).

## M9A: Pilot Evaluation Harness

The M9A harness exists to query the `POST /api/v1/queries` endpoint securely in two experimentally distinguishable modes:
1. `mode="baseline"`: Pure RAG baseline (M4). Skips decomposition, verification, and repair.
2. `mode="full"`: Complete pipeline (M4 -> M5 -> M6 -> M7).

### Usage

1. Start the backend server: `uvicorn app.main:app`
2. Run the pilot script:
   ```bash
   python evaluation/scripts/run_pilot.py --dataset evaluation/dataset/pilot.jsonl --out-dir evaluation/results
   ```
3. The script iterates over the dataset exactly sequentially, querying the baseline and then the full pipeline for each record, recording execution latency, success state, and full HTTP responses.

### Failure Handling

Network failures, model unavailabilities, or unparseable JSON are caught and marked as `success: false` in the results output. We do NOT fabricate or automatically retry beyond the defined limits to preserve the raw reliability measurements of the pipelines.

## Retrieval Metrics (M3)

### Recall@K
Recall@K measures whether the correct chunk is present within the top K results returned by the retriever.
- Formula: `1` if any relevant chunk is in the top K results, `0` otherwise.
- Aggregation: The average Recall@K across all queries.

### Mean Reciprocal Rank (MRR)
MRR evaluates how high up the relevant chunk appears in the ranked results.
- Formula: `1 / rank` where rank is the position (1-indexed) of the first relevant chunk in the results. If no relevant chunk is found, the score is `0`.
- Aggregation: The average MRR across all queries.
