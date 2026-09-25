# ADR 003: Verification Strategy

## Status

**Accepted**

## Date

2026-09-23

## Context

After the LLM generates an answer and claims are decomposed, each claim must be verified against source evidence. The verification step must classify each claim as **supported**, **contradicted**, or **unverifiable**.

Two approaches were considered:

1. **LLM-based verification:** Use the generation LLM (Qwen3-4B) to judge whether each claim is supported by evidence.
2. **Dedicated NLI model:** Use a separate model fine-tuned for natural language inference (entailment / contradiction / neutral classification).

## Decision

Use a **dedicated NLI model** (separate from the generation LLM) for claim–evidence verification.

## Rationale

### 1. Independence

The generator should not verify its own output. If the same model generates a claim and then judges whether the claim is supported, it is biased toward confirming its own generation. A separate model provides an independent check.

### 2. Task Specialization

NLI models (e.g., DeBERTa-v3 fine-tuned on MNLI/FEVER/ANLI) are specifically trained for entailment classification. Based on the project’s design rationale, this task specialization is expected to provide more reliable structured three-way classification than general-purpose LLMs for this specific task. This is a design hypothesis that will be validated during evaluation, not an established benchmark claim.

### 3. Efficiency

NLI models are encoder-based (typically 180–350M parameters). Inference is expected to be significantly faster than running a second LLM generation pass per claim. For a 10-claim answer, this means 10 encoder forward passes instead of 10 autoregressive LLM calls. On the development hardware (RTX 2050, 4 GB VRAM), the NLI model may run on CPU to avoid VRAM contention with the LLM.

### 4. Determinism

NLI model classification is deterministic for a given input pair (at inference temperature 0). LLM-based verification is sensitive to prompt phrasing, temperature, and sampling parameters, reducing reproducibility.

### 5. Three-Way Classification

NLI models natively produce entailment / contradiction / neutral scores, which map directly to supported / contradicted / unverifiable. LLMs require prompt engineering to produce consistent three-way classifications.

## Alternatives Considered

| Alternative | Decision | Reason |
|-------------|----------|--------|
| LLM-based verification (Qwen3-4B) | Rejected | Same-model bias, slower, less reliable on structured NLI. |
| LLM-based verification (separate larger LLM) | Rejected | Two LLMs doubles resource requirements. NLI models are more efficient and better suited. |
| Ensemble (LLM + NLI) | Deferred | Could improve accuracy but adds complexity. May be explored in evaluation. |
| No verification (trust RAG output) | Rejected | Defeats the project's core purpose. |

## Risks

- NLI models can misclassify claims, particularly when evidence is ambiguous or requires multi-hop reasoning.
- The "neutral" NLI label maps to "unverifiable," but some neutral cases may actually be supported with more context.
- NLI model selection has not been finalized. Candidate models (DeBERTa-v3-base variants) will be compared during Milestone 6.

## Consequences

- The `VerificationProvider` interface abstracts the NLI model. The specific model can be swapped without modifying verification logic.
- Verification accuracy is bounded by the NLI model's capability. This limitation must be acknowledged in evaluation.
- Unverifiable claims (NLI neutral) are explicitly not treated as false. The system presents them as "unverifiable" to the user.

## Cross-References

- NLI model candidates: [../MODEL_SELECTION.md](../MODEL_SELECTION.md#2-nli-verification-model-dedicated-nli-model)
- Verification evaluation metrics: [../EVALUATION_PLAN.md](../EVALUATION_PLAN.md#5-verification-evaluation)
- Pipeline architecture: [../ARCHITECTURE.md](../ARCHITECTURE.md#4-ai-pipeline-data-flow)
