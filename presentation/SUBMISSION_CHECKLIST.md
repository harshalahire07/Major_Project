# Final Major Project Submission Checklist
**Project**: An Evidence-Grounded AI System for Document Question Answering, Hallucination Detection, and Claim-Level Repair  
**Department**: Computer Science and Engineering, Pimpri Chinchwad University, Pune  
**Academic Year**: 2026–27 | B.Tech Major Project Final Defense

---

## 1. Codebase & Service Deliverables

- [x] **Backend REST API Implementation** (`backend/app/`):
  - [x] FastAPI application structure with clean layered architecture (`api/`, `services/`, `repositories/`, `models/`, `core/`).
  - [x] SQLAlchemy ORM models with PostgreSQL persistence and Alembic migrations.
  - [x] Service abstractions: `LLMProvider`, `EmbeddingProvider`, `RetrievalProvider`, `ClaimDecomposer`, `VerificationProvider`, `ClaimRepairService`, `PipelineOrchestrator`.
  - [x] Dual-mode query execution: `mode="baseline"` and `mode="full"`.
  - [x] Lazy initialization for NLI and LLM to conserve GPU memory on 4GB VRAM.
  - [x] Bounded repair loop ($MAX\_ITER = 2$) and automated exception degradation.
  - [x] 116+ passing backend unit and integration tests (`pytest`).
- [x] **Data Ingestion & Indexing Pipeline**:
  - [x] PyMuPDF page-tracking text extraction (`pymupdf_processor.py`).
  - [x] Page-preserving chunking strategy (500 chars, 100-char overlap).
  - [x] BAAI/bge-small-en-v1.5 384-dimensional dense vector embeddings.
  - [x] FAISS `IndexFlatIP` vector store with scoped document filtering.
- [x] **Frontend Client Scaffold** (`frontend/`):
  - [x] React + TypeScript + Vite project configured and building cleanly.
  - [x] Cross-origin resource sharing (CORS) configured with backend.

---

## 2. Research Paper & Documentation Deliverables

- [x] **Academic Research Paper**:
  - [x] `Major_Project_Research_Paper_Draft.docx` regenerated with Times New Roman academic styling, 6 formatted tables, 4 uncropped figures, and zero placeholders.
  - [x] Corrected technical description: PostgreSQL for relational persistence, FAISS for vector search, BGE-small for embeddings.
  - [x] Audited metric reporting: 16 paired questions, 47 claims, 30 -> 22 contradicted (-26.67%), 13 -> 17 unverifiable (+30.77%), 2/41 repairs (4.88%), 0 collateral damage observations, 51.48s latency overhead.
  - [x] Academic caution enforced: Honest limitations disclosed, proxy baseline noted, no claims of general hallucination elimination.
- [x] **System Architecture Documentation**:
  - [x] `docs/ARCHITECTURE.md`: Complete modular monolith architecture, service contracts, and Mermaid dataflows.
  - [x] `docs/PRD.md`: Functional requirements (FR1–FR20) and non-goals.
  - [x] `docs/HARSHAL_CONTRIBUTION.md`: Individual backend and repair architecture ownership audit.
  - [x] `docs/TEAM_RESPONSIBILITIES.md`: Cross-member interface contracts and milestone mapping.

---

## 3. Evaluation Artifacts & Datasets

- [x] **Audited Pilot Artifacts** (`evaluation/results/`):
  - [x] `metrics.json`: Machine-readable results with explicit definitions and audited values.
  - [x] `M9B_REPORT.md`: Detailed engineering report on the 16 paired runs, hardware constraints, and failure modes.
  - [x] `summary.csv`: Aggregated latency and response outcomes across all 16 paired runs.
  - [x] `baseline.jsonl` & `full.jsonl`: Preserved raw execution logs.
- [x] **Human Evaluation Dataset**:
  - [x] `human_evaluation.csv`: 47 claims with 11 required columns (`question_id`, `category`, `baseline_answer`, `full_answer`, `original_claim`, `verification_status`, `repaired_claim`, `evidence_text`, `source_document`, `page_number`, `human_label`).
  - [x] `human_evaluation.xlsx`: Styled spreadsheet with frozen headers, word wrap, and highlighted blank `human_label` column.
  - [x] `README_HUMAN_EVALUATION.md`: Annotation guide explaining `CORRECT`, `INCORRECT`, `UNSUPPORTED`, `INCORRECT_REPAIR`, `UNCLEAR`, and why `UNVERIFIABLE != false`.

---

## 4. Final Presentation & Demonstration Deliverables

- [x] **PowerPoint Presentation** (`presentation/Major_Project_Final_Presentation.pptx`):
  - [x] 15 professional academic widescreen (16:9) slides.
  - [x] Embedded architecture diagrams: Figure 1 (Architecture), Figure 2 (Verification), Figure 3 (Repair Loop), Figure 4 (Comparison).
  - [x] Formatted comparison matrix (Table 1), tech stack (Table 2), and audited results (Table 5).
- [x] **Demonstration Runbook** (`presentation/DEMO_RUNBOOK.md`):
  - [x] Environment startup sequence for PostgreSQL, Ollama, FastAPI, and Vite.
  - [x] Live Swagger UI step-by-step demonstration procedure (`/api/v1/queries` in baseline vs. full modes).
  - [x] Failure mitigations and live speaking pitch.
- [x] **Slide-by-Slide Speaker Notes** (`presentation/SPEAKER_NOTES.md`):
  - [x] Timing allocation (15–20 minutes).
  - [x] Key talking points and slide transitions.
  - [x] Anticipated committee defense questions and evidence-backed answers.

---

## 5. Defense Day Practical Checklist

1. [ ] Laptop connected to power adapter (GPU performance drops on battery).
2. [ ] PostgreSQL service verified running (`localhost:5432`).
3. [ ] Ollama service active with `qwen3:4b-instruct` verified (`curl http://localhost:11434/api/tags`).
4. [ ] Backend started on port 8000 (`uvicorn app.main:app --reload --port 8000`).
5. [ ] Interactive Swagger docs opened in browser tab: `http://localhost:8000/docs`.
6. [ ] PowerPoint presentation (`Major_Project_Final_Presentation.pptx`) tested in presenter view.
7. [ ] Printed or PDF copy of `Major_Project_Research_Paper_Draft.docx` ready for evaluation committee.
