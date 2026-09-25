# ADR 001: LLM Selection

## Status

**Accepted**

## Date

2026-09-23

## Context

The project requires a local language model for three tasks:

1. **RAG generation** — Generating answers from retrieved document chunks.
2. **Claim decomposition** — Extracting atomic claims from generated text.
3. **Evidence-constrained repair** — Rewriting contradicted claims using source evidence.

The model must run locally on the development hardware (NVIDIA RTX 2050, 4 GB VRAM, 16 GB RAM, Windows) without cloud API dependencies. The model must follow structured instructions reliably, as all three tasks depend on prompt-based control.

## Decision

Use **Qwen3-4B-Instruct-2507** as the initial generation model, served via **Ollama**.

## Rationale

1. **Hardware fit:** Qwen3-4B is expected to fit within the RTX 2050’s 4 GB VRAM when aggressively quantized (Q4_K_M or lower). Partial CPU offloading via Ollama may be required. This must be validated experimentally.
2. **Instruction following:** The Instruct variant is fine-tuned for instruction-following, which is critical for structured prompt tasks (claim decomposition, evidence-constrained repair).
3. **Ollama compatibility:** Available as an Ollama model with minimal setup.
4. **Open weights:** Free to use; no API cost during development or evaluation.
5. **Recency:** The 2507 release incorporates recent training improvements.

## Alternatives Considered

| Model | Decision | Reason |
|-------|----------|--------|
| Qwen3-8B-Instruct | Deferred | Likely better quality but will not fit in 4 GB VRAM; requires significant CPU offloading. May be benchmarked if feasible. |
| Llama 3.1 8B Instruct | Deferred | Well-established alternative. Useful as a comparison point during evaluation. |
| Mistral 7B Instruct | Deferred | Strong instruction-following. May be benchmarked. |
| GPT-4 / Claude (cloud APIs) | Rejected | Violates the local-execution requirement. Introduces API cost and latency dependency. |
| No fixed model (benchmark only) | Rejected | A default model is needed for development and integration testing. |

## Risks

- Qwen3-4B may produce lower-quality claim decompositions or repairs compared to larger models. This is accepted for the MVP; the model abstraction allows swapping to larger models.
- Published benchmark scores from the Qwen3 model card are not treated as our experimental results. All performance claims will be based on our own evaluation.

## Consequences

- All generation tasks (RAG, decomposition, repair) initially use the same model via Ollama.
- The `LLMProvider` interface abstracts the model, so swapping requires only a new implementation and configuration change.
- Evaluation must test whether 4B parameters are sufficient for reliable claim decomposition and repair.

## Cross-References

- Model selection rationale: [../MODEL_SELECTION.md](../MODEL_SELECTION.md)
- LLM provider interface: [`../../backend/app/services/llm/base.py`](../../backend/app/services/llm/base.py)
- Architecture — model abstraction: [../ARCHITECTURE.md](../ARCHITECTURE.md#5-model-abstraction-strategy)
