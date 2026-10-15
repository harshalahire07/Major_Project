# M9B Pilot Evaluation Methodology

This directory contains the automated evaluation harness, the raw artifacts, and the computed metrics for the M9B real pilot evaluation phase.

## Objective
The objective of this pilot is to evaluate the Evidence-Grounded AI System for Document Question Answering by comparing a standard RAG generation (`baseline`) against the full architecture (`full`) which includes:
- M5 Claim Decomposition
- M6 NLI-based Fact Verification (DeBERTa-v3)
- M7 Bounded Claim Repair (Qwen-3:4B)

## Data
- **Corpus**: Four academic research papers (PDF format) ingested into PostgreSQL + FAISS.
- **Benchmark**: A synthetic set of 26 questions generated dynamically during early prototyping.

## Execution
The `evaluation/scripts/run_pilot.py` script executes the benchmark questions through the `POST /api/v1/queries` endpoint. For each question, two independent requests are issued:
1. `mode="baseline"`: Pure generation with no validation.
2. `mode="full"`: The proposed architecture orchestrating verification and claim-level repair.

To gracefully handle hardware constraints (such as connection timeouts or LLM generation failures), the runner checkpoints successful completions in `baseline.jsonl` and `full.jsonl`. Unsuccessful requests (`success: False`) are retried across execution cycles until valid completions are recorded.

## Metric Calculation
The `evaluation/scripts/calculate_metrics.py` script strictly processes the successfully recorded parallel executions. Hallucinations are quantified by evaluating the `status` of every generated atomic claim against the provided evidence chunk.

- **Baseline Hallucinations**: Inferred from the `original_verification_result.status` inside the `full_mode` claims. This accurately reflects the hallucination rate of the underlying generated draft answer before any targeted repair takes place.
- **Full-Pipeline Hallucinations**: Computed from the `final_verification_result.status` post-repair.
- **Repair Success**: Computed by observing the state transition of flagged claims (`REPAIRED` vs `FAILED`).
- **Collateral Damage**: Tracking whether any originally `SUPPORTED` claims were inadvertently mutated into unsupported states during the targeted repair loops.

## Generated Artifacts
1. **metrics.json**: Computed JSON dictionary of overall system performance metrics.
2. **summary.csv**: A question-level breakdown of latency and textual answers for quick inspection.
3. **human_evaluation.csv**: A granular, claim-level breakdown detailing the original generation, verification status, and post-repair states. This file is designed for manual annotation and quality review.
4. **M9B_REPORT.md**: A high-level, human-readable summary of the pilot execution results, constraints, and limitations.

*This framework prioritizes reproducible and transparent metric reporting without reliance on ungrounded automated judges, using cross-encoder NLI and subsequent human review for maximum rigor.*
