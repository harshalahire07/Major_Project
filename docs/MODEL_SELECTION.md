# Model Selection

> **Status:** Planned selections documented. No models have been integrated beyond the `LLMProvider` interface. No experimental benchmarks have been conducted.

## 1. Generation Model: Qwen3-4B-Instruct-2507

### Why This Model

| Factor | Rationale |
|--------|-----------|
| **Local execution** | The project requires running models locally on the development hardware (NVIDIA RTX 2050, 4 GB VRAM, 16 GB RAM, Windows) without relying on cloud APIs. Qwen3-4B is expected to fit in 4 GB VRAM when aggressively quantized (Q4_K_M or lower), but this must be validated experimentally. Partial CPU offloading via Ollama may be required. |
| **Instruction following** | Qwen3-Instruct variants are fine-tuned for instruction-following tasks, which is required for structured prompts (RAG generation, claim decomposition, repair). |
| **Runtime compatibility** | Qwen3-4B is available through Ollama, the project's initial local LLM runtime, with minimal setup. |
| **Recency** | The 2507 release is recent, incorporating improvements over earlier Qwen3 variants. |
| **Cost** | Free, open-weight model. No API costs during development or evaluation. |

### Known Limitations

- 4B parameters is small for complex reasoning tasks. Claim decomposition and evidence-constrained repair may suffer in quality.
- Context window may be insufficient for long retrieved passages.
- Performance has not been benchmarked by this project. Published benchmark numbers from the model card are not our experimental results.
- Whether the model fits entirely in 4 GB VRAM depends on quantization level. Partial CPU offloading may introduce latency. This must be validated experimentally during Milestone 4.

### Alternatives for Benchmarking

| Model | Parameters | Rationale for Consideration |
|-------|-----------|----------------------------|
| Qwen3-8B-Instruct | 8B | Larger variant; may improve generation quality. Requires more VRAM. |
| Llama 3.1 8B Instruct | 8B | Well-established alternative; different architecture for diversity. |
| Mistral 7B Instruct | 7B | Strong instruction-following baseline in the 7B class. |
| Phi-3-mini (3.8B) | 3.8B | Competitive small model from Microsoft; comparable size to Qwen3-4B. |

Whether these alternatives are benchmarked depends on available time and hardware.

## 2. NLI Verification Model: Dedicated NLI Model

### Why a Separate Verifier

| Factor | Rationale |
|--------|-----------|
| **Independence** | Using the same LLM for both generation and verification creates a conflict — the model may be biased toward confirming its own outputs. A separate NLI model provides independent verification. |
| **Task specialization** | NLI models are fine-tuned specifically for entailment/contradiction/neutral classification. Based on the project’s decision rationale, this specialization is expected to provide more reliable structured classification than general-purpose LLMs for this specific task, though this is a design hypothesis to be validated during evaluation. |
| **Efficiency** | NLI models (typically encoder-based, ~300M params) are expected to be faster per inference call than generating verification judgments through an autoregressive LLM, though actual performance depends on hardware and batch sizes. |
| **Reproducibility** | NLI model classification is deterministic for a given input pair, unlike LLM-based verification which varies with sampling parameters. |

### Candidate NLI Models

| Model | Architecture | Notes |
|-------|-------------|-------|
| `cross-encoder/nli-deberta-v3-base` | DeBERTa-v3 (184M) | Strong NLI performance; manageable size. |
| `microsoft/deberta-v3-base-mnli-fever-anli` | DeBERTa-v3 (184M) | Trained on multiple NLI datasets; may generalize better. |
| `roberta-large-mnli` | RoBERTa-large (355M) | Well-known NLI baseline; larger. |

> **Note:** The specific NLI model has not been selected yet. Selection will occur during Milestone 6, based on preliminary experiments. The `VerificationProvider` interface allows swapping models without code changes.

### Why Not LLM-Based Verification

Using Qwen3-4B (or any generation LLM) for verification was considered and rejected because:

1. The generator should not verify its own output.
2. LLM-based NLI requires prompt engineering and is expected to be less reliable for structured three-way classification than fine-tuned NLI models (this is a project design hypothesis, not an established benchmark claim).
3. Running a second LLM inference per claim is expected to be slower than running a lightweight encoder model on the available hardware.

See [ADR 003: Verification Strategy](adr/003-verification-strategy.md) for the full decision record.

## 3. Embedding Model: BAAI/bge-small-en-v1.5

### Why This Model

| Factor | Rationale |
|--------|-----------|
| **Size** | 33M parameters; loads quickly; minimal memory footprint. |
| **Dimensionality** | 384-dimensional embeddings; efficient for FAISS indexing. |
| **Performance** | Strong results on MTEB benchmarks for its size class. |
| **Framework** | Natively supported by Sentence Transformers, which is already in the project stack. |
| **Language** | English-only, which matches the initial project scope. |

### Known Limitations

- Small embedding models may underperform on nuanced semantic similarity, particularly for evidence retrieval where subtle distinctions matter.
- English-only; multilingual documents are not supported.

### Alternatives for Benchmarking

| Model | Dimensions | Parameters | Rationale |
|-------|-----------|-----------|-----------|
| `BAAI/bge-base-en-v1.5` | 768 | 110M | Larger variant; likely better retrieval quality. |
| `all-MiniLM-L6-v2` | 384 | 22M | Popular lightweight alternative; useful comparison point. |
| `BAAI/bge-large-en-v1.5` | 1024 | 335M | High-quality retrieval; expensive. |
| `nomic-embed-text-v1.5` | 768 | 137M | Open-source alternative with flexible dimensionality. |

## 4. LLM Runtime: Ollama

### Why Ollama

| Factor | Rationale |
|--------|-----------|
| **Simplicity** | Single binary; no complex setup. Serves models via HTTP API. |
| **Model support** | Supports Qwen3, Llama, Mistral, and most popular open models. |
| **Local execution** | Runs entirely on the development machine; no cloud dependency. |
| **API compatibility** | Simple REST API; easy to integrate via the `LLMProvider` interface. |

### Alternatives

| Runtime | Consideration |
|---------|--------------|
| llama.cpp server | More control over quantization and inference parameters. |
| vLLM | Better throughput for batch inference; requires more setup. |
| Text Generation Inference (TGI) | Production-grade serving; overkill for MVP. |

The `LLMProvider` abstraction (see [ARCHITECTURE.md](ARCHITECTURE.md#5-model-abstraction-strategy)) allows runtime swapping without modifying application code.

## 5. Hardware Constraints

| Resource | Constraint |
|----------|-----------|
| GPU | NVIDIA RTX 2050 with 4 GB VRAM. Qwen3-4B may require aggressive quantization (Q4_K_M or lower) to fit; partial CPU offloading via Ollama may be needed. Larger alternative models (7B+) will likely require significant CPU offloading or may not be feasible. |
| RAM | 16 GB system RAM. Must accommodate OS, application, and any CPU-offloaded model layers. |
| Disk | Models stored locally (Ollama default cache + Sentence Transformers cache). |
| CPU | Fallback for NLI and embedding models if GPU VRAM is occupied by the LLM. CPU-based LLM generation is feasible but slow. |
| OS | Windows (development environment). |

### Memory Management Strategy

With 4 GB VRAM, the LLM (~2.5–4 GB quantized), NLI model (~0.4–0.7 GB), and embedding model (~0.07–0.13 GB) **cannot be assumed to fit simultaneously in GPU memory**. The planned approach:

1. **Sequential loading:** Load models on-demand per pipeline stage and unload between stages if VRAM is insufficient.
2. **CPU/GPU separation:** Run the embedding model and/or NLI model on CPU while the LLM uses the GPU, or vice versa.
3. **Quantization validation:** Experimentally determine which quantization levels allow the LLM to fit within 4 GB VRAM while maintaining acceptable output quality.
4. **Configuration-driven:** The model loading strategy should be configurable so that different hardware profiles can use different approaches.

These strategies will be validated experimentally during Milestones 4 and 6. Latency measurements will reflect the actual memory management approach used.

## 6. Model Abstraction Strategy

All models are accessed through abstract interfaces defined in the service layer:

| Concern | Interface | Initial Implementation |
|---------|-----------|----------------------|
| Text generation | `LLMProvider` | Ollama (Qwen3-4B) |
| Text embedding | `EmbeddingProvider` | Sentence Transformers (BGE-small) |
| NLI verification | `VerificationProvider` | Dedicated NLI model (TBD) |
| Vector retrieval | `RetrievalProvider` | FAISS |

Swapping any model requires:
1. Implementing the corresponding interface.
2. Updating configuration (`.env` or `config.py`).
3. No changes to call sites or pipeline orchestration.

The `LLMProvider` interface is already implemented in [`app/services/llm/base.py`](../backend/app/services/llm/base.py). Other interfaces will be created as their milestones are reached.

## 7. Cross-References

- Model abstraction architecture: [ARCHITECTURE.md — Model Abstraction Strategy](ARCHITECTURE.md#5-model-abstraction-strategy)
- LLM selection decision: [adr/001-llm-selection.md](adr/001-llm-selection.md)
- Verification strategy decision: [adr/003-verification-strategy.md](adr/003-verification-strategy.md)
- Vector store decision: [adr/002-vector-store.md](adr/002-vector-store.md)
