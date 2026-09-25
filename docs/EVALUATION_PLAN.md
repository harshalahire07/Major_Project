# Evaluation Plan

## 1. Overview

This document defines how the system is evaluated. Evaluation is organized into six categories: retrieval, generation, verification, repair, citation/evidence, and performance. Each category defines specific metrics, measurement methods, and how results map to research questions.

All evaluation compares the **proposed system** (RAG + verification + repair + re-verification) against the **baseline** (standard RAG without verification or repair), using the same retrieval and generation components.

> **Note:** No evaluation results exist yet. This document defines the planned methodology. Results will be reported in Milestone 9.

## 2. Research Question → Metric Mapping

| Research Question | Primary Metrics | Category |
|-------------------|----------------|----------|
| RQ1: Does verification reduce unsupported/contradicted claims? | Hallucination rate, supported claim rate, verification precision/recall/F1 | Verification, Generation |
| RQ2: Can targeted repair improve faithfulness? | Repair success rate (automatic + human), collateral modification rate, supported-claim preservation | Repair |
| RQ3: Does re-verification improve reliability? | Post-repair contradicted/unverifiable rate, re-verification catch rate | Repair, Verification |
| RQ4: What is the computational overhead? | Per-stage latency, total latency, latency ratio | Performance |

## 3. Retrieval Evaluation

Measures the quality of vector retrieval independently from generation.

| Metric | Definition | Method |
|--------|-----------|--------|
| **Recall@K** | Fraction of relevant passages in the top-K results. | Compare retrieved chunks against human-annotated relevant passages for each test question. |
| **Precision@K** | Fraction of top-K results that are relevant. | Same annotation set. |
| **MRR** (Mean Reciprocal Rank) | Average of 1/rank of the first relevant result. | Same annotation set. |

**Variables to explore:**
- K values: 3, 5, 10.
- Chunk size and overlap parameters.
- Embedding model (BGE-small as initial; alternatives if time permits).

**Owner:** Member 1.

## 4. Generation Evaluation

Measures the quality of generated answers before and after verification/repair.

| Metric | Definition | Method |
|--------|-----------|--------|
| **Hallucination rate** | Proportion of claims in the answer that are contradicted or unverifiable by retrieved evidence. | Human annotation of claims + NLI classification. |
| **Supported claim rate** | Proportion of claims classified as supported. | NLI classification + human validation on a sample. |

**Comparison:** Baseline (standard RAG answer) vs. proposed system (final answer after verification and repair).

**Owner:** Member 1 (baseline), Member 2 (verification-aware generation evaluation).

## 5. Verification Evaluation

Measures the accuracy of the NLI-based claim verification.

| Metric | Definition | Method |
|--------|-----------|--------|
| **Verification precision** | Of claims the NLI model labels as contradicted, what fraction are actually contradicted (per human judgment). | Human annotation of a sample of NLI-classified claims. |
| **Verification recall** | Of claims that are actually contradicted (per human judgment), what fraction does the NLI model correctly identify. | Same annotation set. |
| **Verification F1** | Harmonic mean of verification precision and recall. | Computed from precision and recall. |
| **Classification accuracy** | Overall accuracy of supported/contradicted/unverifiable classification. | Human-annotated three-way labels compared to NLI output. |

**Ground truth:** Human-annotated claim–evidence pairs with labels (supported, contradicted, unverifiable).

**Owner:** Member 2.

## 6. Repair Evaluation

Measures the effectiveness of targeted hallucination repair.

| Metric | Definition | Method |
|--------|-----------|--------|
| **Repair success rate (automatic)** | Of repaired claims, what fraction are classified as supported by NLI after repair. | Re-verification result for each repaired claim. |
| **Repair success rate (human)** | Of a sample of repaired claims, what fraction are judged correctly repaired by human annotators. | Human annotation using the repair label set (see below). |
| **Collateral modification rate** | Proportion of originally-supported claims whose text is altered during final answer reconstruction (detecting unintended changes during assembly, not during the repair service itself — supported claims are never intentionally sent to repair). | Diff original claim texts against final answer claim texts for claims that were classified as supported. |
| **Supported-claim preservation** | Proportion of originally-supported claims that remain textually identical in the final answer. | Complement of collateral modification rate. |
| **Re-verification catch rate** | Of repaired claims, what fraction fail re-verification (indicating repair introduced new problems). | Count re-verification failures. |

### Human Repair Labels

Human annotators evaluate a sample of repaired claims using the following labels:

| Label | Definition |
|-------|------------|
| **Correctly repaired** | The repaired claim is faithful to the source evidence and the original claim’s intent. |
| **Still incorrect** | The repaired claim still contains information contradicted by or not grounded in the evidence. |
| **Introduced unsupported information** | The repair introduced new factual assertions not present in the available evidence. |
| **Unclear** | The annotator cannot determine whether the repair is correct given the available evidence. |

**Owner:** Member 3 (Harshal).

## 7. Citation and Evidence Evaluation

Measures whether the final answer correctly attributes claims to source evidence.

| Metric | Definition | Method |
|--------|-----------|--------|
| **Citation coverage** | Proportion of claims in the final answer that have at least one source citation. | Count claims with non-empty citation lists. |
| **Citation precision** | Of cited source passages, what fraction actually support the associated claim. | Human review of claim–citation pairs on a sample. |
| **Page-level accuracy** | Of page citations, what fraction point to the correct page in the source document. | Manual verification against source PDFs. |

**Owner:** Member 4 (frontend display), Member 3 (Harshal) (backend citation generation).

## 8. Performance Evaluation

Measures computational overhead introduced by verification and repair.

| Metric | Definition | Method |
|--------|-----------|--------|
| **Per-stage latency** | Time in milliseconds for each pipeline stage. | Instrumented timing per stage, recorded in `pipeline_stages`. |
| **Total pipeline latency** | End-to-end time from query submission to final answer. | Recorded in `pipeline_runs.total_duration_ms`. |
| **Latency ratio** | Total pipeline latency / baseline latency. | Run both modes on the same queries. |
| **Per-claim overhead** | Additional time per claim for verification and repair. | Total verification+repair time / number of claims. |

**Reporting:** Mean, median, standard deviation, and percentiles (P95) across all test queries.

**Owner:** Member 3 (Harshal).

## 9. Annotation Protocol

For metrics requiring human judgment:

1. **Annotators:** Team members (not external domain experts).
2. **Sample size:** Annotate a representative sample per evaluation metric. Exact sample sizes will be determined based on total output volume.
3. **Labels:** Three-class for verification (supported, contradicted, unverifiable). Four-class for repair evaluation (correctly repaired, still incorrect, introduced unsupported information, unclear).
4. **Inter-annotator agreement:** Where feasible, measure agreement (e.g., Cohen's kappa) on a subset annotated by two members independently.
5. **Conflicts:** Disagreements resolved by discussion and consensus.

## 10. Reporting

- All results will distinguish between NLI-based automatic evaluation and human-annotated evaluation.
- Metrics will be reported as exact values, not rounded to appear more favorable.
- Confidence intervals or variance measures will be included where sample sizes are sufficient.
- No fabricated or cherry-picked results.
- Limitations of the evaluation methodology will be explicitly stated.

## 11. Cross-References

- Research questions and hypotheses: [RESEARCH_PLAN.md](RESEARCH_PLAN.md)
- Pipeline stages being evaluated: [ARCHITECTURE.md — AI Pipeline Data Flow](ARCHITECTURE.md#4-ai-pipeline-data-flow)
- Database tables storing evaluation data: [DATABASE_DESIGN.md](DATABASE_DESIGN.md)
- Team ownership: [TEAM_RESPONSIBILITIES.md](TEAM_RESPONSIBILITIES.md)
