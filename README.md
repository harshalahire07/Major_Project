# AI Document Verification & Hallucination Repair

## Overview

A system that processes uploaded documents through retrieval-augmented generation (RAG), then verifies the generated output against source evidence. Claims in generated text are decomposed, checked against retrieved passages, and classified as supported, contradicted, or unverifiable. Unsupported claims are targeted for repair with source-grounded alternatives.

This system does not claim to eliminate hallucinations. It provides structured verification and evidence-based repair for generated content.

## Problem Statement

Large language models generate fluent text that can contain unsupported or contradicted claims. Standard RAG pipelines retrieve relevant context but do not verify whether the generated output actually reflects that context. This project adds a post-generation verification layer that decomposes claims, retrieves evidence, and identifies where the generation diverges from available sources.

## Planned Architecture

```
User → Upload document → Document processing → Text extraction (with page metadata)
  → Chunking → Embeddings → Vector store

Query → Vector retrieval → RAG generation → Draft answer
  → Claim decomposition → Atomic claims
  → Evidence retrieval → Claim/evidence verification
  → Supported / Contradicted / Unverifiable
  → Targeted hallucination repair → Re-verification
  → Final answer with source/page citations
```

### Service Boundaries

| Service | Responsibility |
|---------|---------------|
| `documents` | PDF processing, text extraction, page metadata |
| `embeddings` | Text embedding via sentence transformers |
| `retrieval` | Vector search (FAISS initially) |
| `llm` | Abstracted generation (Qwen3-4B local, swappable) |
| `verification` | NLI-based claim verification, independent from generation |

### Key Architectural Principle

The LLM provider is abstracted behind an interface. The rest of the application depends on the interface, not on a specific model. The same principle applies to embeddings, retrieval, and verification where it provides a real benefit.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite |
| Backend | Python 3.12, FastAPI, Pydantic |
| Database | PostgreSQL, SQLAlchemy (async) |
| Document Processing | PyMuPDF (planned) |
| Embeddings | Sentence Transformers (planned) |
| Vector Retrieval | FAISS (planned) |
| Generation | Qwen3-4B-Instruct-2507 via local runtime (planned) |
| Verification | Dedicated NLI model (planned) |
| Infrastructure | Docker Compose |
| Testing | pytest, Vitest |

## Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── api/            # HTTP routes
│   │   ├── core/           # Config, database, logging
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── services/       # Business logic (llm/, documents/, etc.)
│   │   └── repositories/   # Data access layer
│   ├── tests/
│   ├── requirements.txt
│   └── pyproject.toml
│
├── frontend/               # React + Vite + TypeScript
│   ├── src/
│   └── package.json
│
├── data/documents/         # Uploaded documents (not committed)
├── docs/                   # Project documentation
├── scripts/                # Utility scripts
├── docker-compose.yml      # PostgreSQL service
├── .env.example            # Environment variable template
└── .gitignore
```

## Local Development

### Prerequisites

- Python 3.12.x
- Node.js 18+
- PostgreSQL (via Docker Compose or local installation)

### Backend

```bash
cd backend
py -3.12 -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Database

```bash
docker compose up -d db
```

## Environment Configuration

Copy `.env.example` to `.env` and fill in values appropriate for your environment. See the example file for all available configuration options.

Do not commit `.env` files containing real credentials.

## Current Development Status

| Component | Status |
|-----------|--------|
| Project structure | ✅ Established |
| Backend (FastAPI) | ✅ Health endpoint operational |
| Frontend (React/Vite) | ✅ Scaffold operational |
| Database config | ✅ SQLAlchemy setup ready (PostgreSQL deferred) |
| LLM abstraction | ✅ Provider interface defined |
| Document processing | ⬜ Not yet implemented |
| Embeddings pipeline | ⬜ Not yet implemented |
| Vector retrieval | ⬜ Not yet implemented |
| RAG generation | ⬜ Not yet implemented |
| Claim decomposition | ⬜ Not yet implemented |
| NLI verification | ⬜ Not yet implemented |
| Hallucination repair | ⬜ Not yet implemented |
| Authentication | ⬜ Not yet implemented |
