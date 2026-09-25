# Product Requirements Document

## 1. Problem Statement

Large language models generate fluent text that frequently contains unsupported, contradicted, or fabricated claims. Standard retrieval-augmented generation (RAG) pipelines retrieve relevant context but do not verify whether the generated output actually reflects that context. Users have no systematic way to know which parts of an LLM-generated answer are supported by the source documents and which are not.

This project adds a post-generation verification and repair layer that decomposes generated answers into atomic claims, retrieves evidence for each claim, classifies claims against source evidence, performs targeted repair of problematic claims, and re-verifies repaired output before returning the final answer with source and page citations.

**This system does not claim to eliminate hallucinations.** It aims to detect, attribute, reduce, and repair unsupported or contradicted claims against available document evidence.

## 2. Target Users

- Researchers who need verified answers grounded in specific documents.
- Students cross-referencing LLM-generated summaries against source material.
- Professionals requiring evidence-attributed answers from uploaded reports or specifications.
- Evaluators benchmarking hallucination detection and repair approaches.

## 3. Goals

| ID | Goal |
|----|------|
| G1 | Generate answers from uploaded documents using retrieval-augmented generation. |
| G2 | Decompose generated answers into atomic, independently verifiable claims. |
| G3 | Verify each claim against source evidence and classify as supported, contradicted, or unverifiable. |
| G4 | Perform targeted, evidence-grounded repair of contradicted claims; attempt additional evidence retrieval for unverifiable claims before flagging. |
| G5 | Re-verify repaired claims before returning the final answer. |
| G6 | Provide source and page citations for every claim in the final answer. |
| G7 | Evaluate the system against a standard RAG baseline using defined metrics. |

## 4. Non-Goals

| ID | Non-Goal |
|----|----------|
| NG1 | User authentication and access control. |
| NG2 | Web search or external knowledge retrieval. |
| NG3 | Domain-specific tuning for medical or legal use cases. |
| NG4 | Autonomous multi-agent architectures. |
| NG5 | Fine-tuning large language models. |
| NG6 | Mobile application. |
| NG7 | OCR-based extraction (unless required by test documents). |
| NG8 | DOCX support (unless time permits). |
| NG9 | Knowledge graph construction (unless justified experimentally). |

## 5. Functional Requirements

### 5.1 Document Ingestion

| ID | Requirement |
|----|-------------|
| FR1 | Users can upload PDF documents via the web interface. |
| FR2 | The system extracts text from PDFs while preserving page-level metadata. |
| FR3 | Extracted text is chunked within page boundaries (chunks do not cross page breaks for MVP). |
| FR4 | Chunks are embedded and stored in a vector index. |
| FR5 | Document metadata (filename, page count, upload time) is persisted in PostgreSQL. |

### 5.2 Question Answering

| ID | Requirement |
|----|-------------|
| FR6 | Users can submit natural language questions against uploaded documents. |
| FR7 | The system retrieves relevant chunks via vector similarity search. |
| FR8 | Retrieved chunks are passed to the LLM to generate a draft answer. |

### 5.3 Claim Verification

| ID | Requirement |
|----|-------------|
| FR9 | The draft answer is decomposed into atomic claims. |
| FR10 | For each claim, relevant evidence passages are retrieved from the source documents. |
| FR11 | Each claim is classified as **supported**, **contradicted**, or **unverifiable** using a dedicated NLI model. |
| FR12 | Unverifiable claims are **not** automatically treated as false. |

### 5.4 Hallucination Repair

| ID | Requirement |
|----|-------------|
| FR13 | Contradicted claims are targeted for evidence-grounded repair using source evidence. |
| FR13a | Unverifiable claims trigger additional evidence retrieval; if evidence remains insufficient, the claim is flagged as unverifiable — the system does not fabricate information. |
| FR14 | Repair is targeted — already-supported claims are not modified. |
| FR15 | Repaired claims undergo re-verification before inclusion in the final answer. |

### 5.5 Response Presentation

| ID | Requirement |
|----|-------------|
| FR16 | The final answer includes source and page citations for each claim. |
| FR17 | The UI displays verification status per claim (supported / contradicted / unverifiable). |
| FR18 | The UI displays evidence passages used for verification. |

### 5.6 Pipeline Observability

| ID | Requirement |
|----|-------------|
| FR19 | Each pipeline run records intermediate results (claims, evidence, verification labels, repair actions). |
| FR20 | Pipeline run history is queryable via the API. |

## 6. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR1 | End-to-end pipeline latency for a single question. | Measure and report; no hard SLA for MVP. |
| NFR2 | PDF upload size limit. | ≤ 50 MB per file for MVP. |
| NFR3 | Concurrent users. | Single-user for MVP. |
| NFR4 | Model abstraction. | LLM, embedding model, and NLI model must be replaceable without modifying call sites. |
| NFR5 | Testability. | All service-layer logic must be unit-testable with mocked dependencies. |
| NFR6 | Reproducibility. | Pipeline runs must be reproducible given the same input, model, and configuration. |

## 7. MVP Scope

The MVP includes:

- PDF upload and text extraction with page preservation
- Page-aware chunking
- Embedding generation and vector indexing
- Vector retrieval for question answering
- RAG-based answer generation
- Claim decomposition
- Evidence matching per claim
- NLI-based verification (supported / contradicted / unverifiable)
- Targeted hallucination repair
- Re-verification of repaired claims
- Final answer with source and page citations
- Basic web interface for upload, query, and result display

## 8. Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC1 | A user can upload a PDF and receive a question answer with per-claim verification labels. |
| AC2 | Contradicted claims are repaired using source evidence, and re-verified before inclusion. |
| AC3 | The final answer includes page-level citations traceable to the source document. |
| AC4 | The system is evaluated against a standard RAG baseline on defined metrics. |
| AC5 | LLM, embedding model, and NLI model can each be replaced by changing configuration, not code. |
| AC6 | All research questions are addressed with experimental evidence. |

## 9. Constraints

| Constraint | Detail |
|------------|--------|
| Hardware | Development on NVIDIA RTX 2050 (4 GB VRAM), 16 GB system RAM, Windows. Models may require CPU/GPU separation or sequential loading because Qwen3-4B, NLI model, and embedding model cannot be assumed to fit simultaneously in 4 GB VRAM. |
| Timeline | Academic project with fixed submission deadline. |
| Team size | Four members with defined responsibility boundaries. |
| Models | Initial models chosen for local feasibility, not state-of-the-art performance. |
| Data | Evaluation uses publicly available or self-curated document sets; no proprietary data. |

## 10. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Claim decomposition produces overly granular or incoherent claims. | Medium | High | Iterative prompt engineering; manual evaluation of decomposition quality. |
| NLI model accuracy is insufficient for reliable verification. | Medium | High | Benchmark multiple NLI models; define acceptable precision/recall thresholds. |
| Repair introduces new unsupported claims. | Medium | High | Re-verification loop; measure collateral changes to originally-supported claims during final answer reconstruction. |
| Pipeline latency is unacceptable for interactive use. | High | Medium | Measure per-stage latency; accept batch mode for MVP if needed. |
| Qwen3-4B is too small for reliable generation or claim decomposition. | Medium | Medium | Model abstraction allows swapping to larger models; document trade-offs. |
| FAISS does not scale for large document collections. | Low | Low | MVP targets small collections; architecture supports replacing the vector store. |
| 4 GB VRAM insufficient for concurrent model loading. | High | Medium | Sequential model loading or CPU/GPU separation; validate quantization and offloading experimentally. |
