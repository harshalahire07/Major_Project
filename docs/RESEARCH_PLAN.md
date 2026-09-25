# Research Plan

## 1. Research Context

Standard retrieval-augmented generation (RAG) pipelines retrieve relevant context and generate answers but do not verify whether the generated output faithfully reflects the retrieved evidence. This can produce answers containing unsupported, contradicted, or fabricated claims that are difficult for users to detect.

This project investigates whether adding claim-level verification and targeted repair after RAG generation reduces unsupported and contradicted claims while preserving answer quality.

**Position:** This project does not claim to eliminate hallucinations. It aims to detect, attribute, reduce, and repair unsupported or contradicted claims against available document evidence. Unverifiable claims are not automatically treated as false.

## 2. Research Questions

### RQ1
**Does claim-level evidence verification reduce unsupported and contradicted claims compared with standard RAG?**

- *Independent variable:* Presence or absence of the verification pipeline.
- *Dependent variable:* Rate of unsupported and contradicted claims in the final answer.
- *Hypothesis:* The proposed system will produce fewer unsupported and contradicted claims than the standard RAG baseline, as measured by human annotation and NLI-based classification.

### RQ2
**Can targeted evidence-based repair improve claim faithfulness without unnecessarily modifying already-supported claims?**

- *Independent variable:* Repair strategy (targeted repair vs. no repair).
- *Dependent variable:* Claim faithfulness rate; number of supported claims that were unnecessarily modified.
- *Hypothesis:* Targeted repair will increase the proportion of supported claims without modifying claims already classified as supported.

### RQ3
**Does re-verification improve the reliability of repaired claims?**

- *Independent variable:* Presence or absence of re-verification after repair.
- *Dependent variable:* Rate of contradicted and unverifiable claims in the final answer after repair.
- *Hypothesis:* Re-verification will catch cases where repair introduces new contradicted or unverifiable content, improving final answer reliability.

### RQ4
**What computational overhead is introduced by claim-level verification and repair?**

- *Independent variable:* Pipeline configuration (baseline vs. full pipeline).
- *Dependent variable:* End-to-end latency; per-stage latency; computational resource usage.
- *Hypothesis:* The full pipeline will have measurably higher latency than the baseline, but the overhead will be quantifiable and attributable to specific stages.

## 3. Baseline

**Standard RAG pipeline:**

```
User question → Vector retrieval → LLM generation → Answer
```

The baseline uses the same retrieval and generation components as the proposed system but omits claim decomposition, verification, repair, and re-verification. This isolates the effect of the post-generation verification layer.

## 4. Proposed System

**Verification-enhanced RAG pipeline:**

```
User question → Vector retrieval → LLM generation → Draft answer
→ Claim decomposition → Evidence retrieval per claim
→ NLI verification → Classification (supported / contradicted / unverifiable)
→ Contradicted: targeted evidence-grounded repair
→ Unverifiable: additional evidence retrieval; flag if still unverifiable (no fabrication)
→ Re-verification → Final answer with source/page citations
```

## 5. Experimental Design

### Experiment 1: Retrieval Quality

| Aspect | Detail |
|--------|--------|
| **Goal** | Measure retrieval effectiveness before downstream tasks. |
| **Metrics** | Recall@K, Precision@K, MRR. |
| **Method** | Create test questions with known relevant passages. Vary K (3, 5, 10). |
| **Variables** | Embedding model, chunk size, chunk overlap, K. |

### Experiment 2: Baseline vs. Proposed System

| Aspect | Detail |
|--------|--------|
| **Goal** | Compare answer quality between standard RAG and the proposed system. |
| **Metrics** | Hallucination rate (contradicted + unverifiable), supported claim rate, claim verification precision/recall/F1. |
| **Method** | Run both pipelines on the same question set. Human-annotate a sample of claims. |
| **Variables** | Pipeline configuration (baseline vs. full). |

### Experiment 3: Repair Effectiveness

| Aspect | Detail |
|--------|--------|
| **Goal** | Evaluate whether targeted repair improves claim quality. |
| **Metrics** | Repair success rate (automatic + human), collateral modification rate, supported-claim preservation rate. |
| **Method** | Compare claims before and after repair. Verify that supported claims are unchanged. |
| **Variables** | Repair strategy, number of repair iterations. |

### Experiment 4: Re-Verification Impact

| Aspect | Detail |
|--------|--------|
| **Goal** | Determine whether re-verification catches repair-introduced errors. |
| **Metrics** | Rate of repaired claims that fail re-verification; final answer quality with and without re-verification. |
| **Method** | Run pipeline with and without re-verification. Compare final outputs. |
| **Variables** | Presence/absence of re-verification step. |

### Experiment 5: Latency and Overhead

| Aspect | Detail |
|--------|--------|
| **Goal** | Quantify computational cost of the verification and repair stages. |
| **Metrics** | Per-stage latency, total pipeline latency, latency ratio (full / baseline). |
| **Method** | Time each stage across multiple queries. Report mean, median, and variance. |
| **Variables** | Pipeline configuration, document size, number of claims. |

## 6. Datasets

| Dataset | Source | Purpose |
|---------|--------|---------|
| Self-curated document set | Publicly available academic papers or reports | Primary evaluation set. |
| Manually annotated QA pairs | Team-created | Ground truth for retrieval and claim verification evaluation. |

> **Note:** Dataset selection is pending. The team will finalize the document set before Milestone 9. Proprietary or restricted-access data will not be used.

## 7. Limitations

- **Scale:** Evaluation is conducted on a small document collection. Results may not generalize to large-scale retrieval scenarios.
- **Model constraints:** Initial models (Qwen3-4B, BGE-small) are chosen for feasibility on available hardware (RTX 2050, 4 GB VRAM). Results reflect these specific models and hardware.
- **NLI limitations:** NLI models can misclassify claims, particularly for nuanced or implicit reasoning. Verification accuracy is bounded by NLI model capability.
- **Hardware constraints:** With 4 GB VRAM, models may require sequential loading or CPU/GPU separation. Latency measurements reflect this constraint.
- **Human annotation:** Annotation is performed by team members, not domain experts. Inter-annotator agreement should be reported where feasible.
- **Repair scope:** Repair is prompt-based and constrained by the LLM's ability to synthesize evidence-grounded alternatives. Complex factual errors may not be fully repairable.
- **Single-domain evaluation:** Results are evaluated on a limited set of document types. Domain-specific performance is not assessed.

## 8. Ethical Considerations

- The system does not claim to produce verified-true answers. It classifies claims relative to available document evidence.
- Unverifiable claims are explicitly not treated as false. Users are informed when evidence is insufficient.
- No fabricated results will be reported. All experimental results will be obtained from actual system runs.

## 9. Cross-References

- Evaluation methodology: [EVALUATION_PLAN.md](EVALUATION_PLAN.md)
- Model selection rationale: [MODEL_SELECTION.md](MODEL_SELECTION.md)
- System architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
