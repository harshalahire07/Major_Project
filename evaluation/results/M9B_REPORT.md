# M9B Pilot Evaluation Report

## Overview
This report details the outcomes of the M9B real pilot evaluation for the Evidence-Grounded AI System for Document Question Answering, Hallucination Detection, and Claim-Level Repair.

The pilot targeted a 26-question test bank (Q001-Q026), executing them in both a standard RAG `baseline` mode and a `full` pipeline mode that includes claim decomposition, NLI verification, and targeted claim repair.

Due to localized context limits and hardware timeouts during generation with the `qwen3:4b-instruct` model on the testing environment, multiple runs resulted in failures (e.g. `GENERATION_FAILED`). 

The `run_pilot.py` script automatically retried failed runs. Upon audit, we found:
- 41 baseline run attempts, resulting in 24 successful execution records (covering 24 unique question IDs; 17 failed attempts).
- 156 full pipeline run attempts, resulting in 25 successful execution records (covering 17 unique question IDs; 8 questions were re-tested across retry passes, and 131 attempts failed due to local inference timeouts).
- **16 unique question IDs** resulted in a successful response across *both* baseline and full modes (q008 completed only in full mode).

The quantitative metrics below are computed strictly from these **16 paired successful runs** (using the last successful run per question). The baseline hallucination rate is approximated by analyzing the `original_verification_result` of the claims decomposed during the `full` pipeline. While the draft answers matched exactly in 12/16 cases, 4 answers had minor generative drift.

## Quantitative Metrics
- **Total Paired Questions Evaluated**: 16
- **Total Claims Evaluated**: 47 (Atomic claims parsed from the draft answers)
- **Baseline Contradicted Claims**: 30 (Claims labeled CONTRADICTED prior to repair)
- **Full-Pipeline Contradicted Claims**: 22 (Claims labeled CONTRADICTED post-repair)
- **Contradiction Reduction**: 26.67%
- **Baseline Unsupported Claims**: 13 (Claims labeled UNVERIFIABLE prior to repair)
- **Full-Pipeline Unsupported Claims**: 17 (Claims labeled UNVERIFIABLE post-repair)
- **Total Repair Opportunities**: 41 (Claims entering the repair/expansion loop)
- **Successful Repairs**: 2 (Claims automatically converted to SUPPORTED)
- **Repair Success Rate**: 4.88%
- **Collateral Damage Observations**: 0 (Automated pipeline observation: originally SUPPORTED claims that were degraded)
- **Average Baseline Latency**: 14.3 seconds
- **Average Full-Pipeline Latency**: 65.77 seconds
- **Added Latency Overhead**: 51.48 seconds

## Analysis & Limitations
- **Contradiction Reduction (RQ1)**: The full pipeline achieved a ~26.7% reduction in explicitly contradicted claims. Note: The baseline rate is based on the pre-repair state of the full-pipeline draft answer.
- **Unsupported Claims**: The unsupported (unverifiable) claim count slightly increased from 13 to 17. This indicates that while the system reduces explicit contradictions, the local 4B model struggles to properly ground its repaired claims in the immediate chunk text, often generating plausible but strictly unverifiable statements that trigger an `UNVERIFIABLE` flag upon re-verification.
- **Repair Faithfulness (RQ2)**: The repair success rate was lower than expected (4.88%). The pipeline correctly identified 41 repair opportunities, but only successfully produced 2 fully `SUPPORTED` repairs. Automated observation shows 0 collateral damage, but this finding (along with actual repair faithfulness) must be verified manually using the `human_evaluation.csv`. 
- **Computational Overhead (RQ4)**: The full pipeline introduced an additional ~51.5 seconds of latency on average compared to the baseline. This overhead is heavily driven by the sequential NLI verification (DeBERTa-v3) and the iterative LLM generation required during repair.

## Artifacts Generated
- `metrics.json`: Machine-readable results summary with explicit definitions.
- `summary.csv`: Aggregated latency and answer outcomes for the 16 paired runs.
- `human_evaluation.csv`: A granular, claim-level breakdown detailing the original generation, verification status, and post-repair states (currently pending manual labeling).

*Report generated automatically from the M9B pilot execution logs.*
