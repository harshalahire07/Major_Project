# API Specification

> **Status:** Planned. None of these endpoints are implemented unless explicitly noted. The only implemented endpoint is `GET /api/health`.

## Conventions

- Base path: `/api/v1`
- Content type: `application/json` (except file uploads which use `multipart/form-data`)
- All timestamps are ISO 8601 in UTC.
- All IDs are UUIDs.
- Pagination uses `offset` and `limit` query parameters.
- Errors follow a consistent envelope (see [Error Responses](#error-responses)).

---

## 1. Health (Implemented)

### `GET /api/health`

Returns application health status.

**Response** `200 OK`:
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "environment": "development"
}
```

---

## 2. Documents

### `POST /api/v1/documents`

Upload a PDF document for processing.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | file | Yes | PDF file (max 50 MB). |
| `title` | string | No | Human-readable title. Defaults to filename. |

**Response** `201 Created`:
```json
{
  "id": "uuid",
  "title": "document.pdf",
  "filename": "document.pdf",
  "page_count": 42,
  "chunk_count": 156,
  "status": "processed",
  "created_at": "2026-01-01T00:00:00Z"
}
```

**Response** `400 Bad Request`:
```json
{
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only PDF files are supported."
  }
}
```

**Response** `413 Content Too Large`:
```json
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File exceeds the 50 MB limit."
  }
}
```

**Business Logic Owner:** `DocumentService` → `DocumentProcessor` → `ChunkingStrategy` → `EmbeddingProvider` → `RetrievalProvider`.

---

### `GET /api/v1/documents`

List uploaded documents.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `offset` | int | 0 | Pagination offset. |
| `limit` | int | 20 | Page size (max 100). |

**Response** `200 OK`:
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "document.pdf",
      "filename": "document.pdf",
      "page_count": 42,
      "chunk_count": 156,
      "status": "processed",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "offset": 0,
  "limit": 20
}
```

**Business Logic Owner:** `DocumentRepository`.

---

### `GET /api/v1/documents/{document_id}`

Get document details including pages.

**Response** `200 OK`:
```json
{
  "id": "uuid",
  "title": "document.pdf",
  "filename": "document.pdf",
  "page_count": 42,
  "chunk_count": 156,
  "status": "processed",
  "created_at": "2026-01-01T00:00:00Z",
  "pages": [
    {
      "page_number": 1,
      "text_length": 2048
    }
  ]
}
```

**Response** `404 Not Found`:
```json
{
  "error": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "Document with ID {document_id} not found."
  }
}
```

**Business Logic Owner:** `DocumentRepository`.

---

### `DELETE /api/v1/documents/{document_id}`

Delete a document and its associated chunks, embeddings, and index entries.

**Response** `204 No Content`

**Response** `404 Not Found`

**Business Logic Owner:** `DocumentService` → `RetrievalProvider` (remove from index) → `DocumentRepository`.

---

## 3. Queries

### `POST /api/v1/queries/retrieve`

Retrieve the top `K` most relevant document chunks for a given query, bypassing generation.

**Request Body (`application/json`)**
```json
{
  "query": "What are the performance limits of the system?",
  "top_k": 5,
  "document_id": "123e4567-e89b-12d3-a456-426614174000" // Optional filter
}
```

- `query` (string, required): The search text (cannot be empty/whitespace).
- `top_k` (integer, optional): The maximum number of chunks to return (default: 5, >0).
- `document_id` (uuid, optional): If provided, strictly scopes search results to chunks belonging to this document. Note: For the MVP, document filtering uses a 10x over-fetch strategy from FAISS before filtering at the database level. If a document has very few chunks in the global index, it is possible fewer than `top_k` results are returned.

**Success Response (`200 OK`)**
```json
{
  "results": [
    {
      "chunk_id": "987e6543-e21b-34c1-b789-526614174999",
      "document_id": "123e4567-e89b-12d3-a456-426614174000",
      "page_number": 12,
      "text": "The performance limit of the system is heavily constrained by the 4GB VRAM...",
      "score": 0.892
    }
  ]
}
```

**Error Responses**

- `400 Bad Request`: When the query is whitespace-only, or `top_k` <= 0.
```json
{
  "error": {
    "code": "INVALID_QUERY",
    "message": "Query cannot be empty or whitespace only."
  }
}
```

- `500 Internal Server Error`: When retrieval infrastructure (e.g., FAISS or Postgres) fails.
```json
{
  "error": {
    "code": "RETRIEVAL_FAILED",
    "message": "An error occurred during retrieval."
  }
}
```

---

### `POST /api/v1/queries`

Submit a question against one or more uploaded documents. Executes the full pipeline.

```json
{
  "question": "What are the key findings?",
  "document_ids": ["uuid"],
  "top_k": 5,
  "mode": "full"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | string | Yes | Natural language question. |
| `document_ids` | list[uuid] | Yes | Target documents (at least one). |
| `top_k` | int | No | Number of chunks to retrieve (default: 5). |
| `mode` | string | No | `full` (default; verification + repair) or `baseline` (standard RAG only). |

**Response** `200 OK`:
```json
{
  "id": "uuid",
  "question": "What are the key findings?",
  "draft_answer": "The study found that...",
  "final_answer": "The study found that...",
  "claims": [
    {
      "id": "uuid",
      "text": "The study found a 15% improvement.",
      "status": "supported",
      "evidence": [
        {
          "chunk_id": "uuid",
          "text": "Results show a 15% improvement over baseline...",
          "page_number": 12,
          "similarity_score": 0.89,
          "document_id": "uuid"
        }
      ],
      "repair": null
    },
    {
      "id": "uuid",
      "text": "This was the first study of its kind.",
      "status": "contradicted",
      "evidence": [
        {
          "chunk_id": "uuid",
          "text": "Previous studies by Smith et al. (2020) examined...",
          "page_number": 3,
          "similarity_score": 0.82,
          "document_id": "uuid"
        }
      ],
      "repair": {
        "original_text": "This was the first study of its kind.",
        "repaired_text": "This study builds on previous work by Smith et al. (2020).",
        "re_verification_status": "supported"
      }
    }
  ],
  "citations": [
    {
      "document_id": "uuid",
      "document_title": "document.pdf",
      "page_number": 12
    },
    {
      "document_id": "uuid",
      "document_title": "document.pdf",
      "page_number": 3
    }
  ],
  "pipeline_metadata": {
    "total_claims": 2,
    "supported_claims": 1,
    "contradicted_claims": 1,
    "unverifiable_claims": 0,
    "repaired_claims": 1,
    "repair_success_count": 1,
    "latency_ms": 4500
  },
  "pipeline_config": {
    "mode": "full",
    "generation_model": "qwen3-4b-instruct-2507",
    "embedding_model": "BAAI/bge-small-en-v1.5",
    "verification_model": "cross-encoder/nli-deberta-v3-base",
    "chunk_size": 512,
    "chunk_overlap": 64,
    "top_k": 5,
    "repair_iteration_limit": 2
  },
  "created_at": "2026-01-01T00:00:00Z"
}
```

**Response** `400 Bad Request`:
```json
{
  "error": {
    "code": "NO_DOCUMENTS_INDEXED",
    "message": "None of the specified documents have been indexed."
  }
}
```

**Response** `422 Unprocessable Entity`:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "At least one document_id is required."
  }
}
```

**Business Logic Owner:** `PipelineOrchestrator` → all services.

---

### `GET /api/v1/queries`

List past queries.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `document_id` | uuid | — | Filter by document. |
| `offset` | int | 0 | Pagination offset. |
| `limit` | int | 20 | Page size (max 100). |

**Response** `200 OK`:
```json
{
  "items": [
    {
      "id": "uuid",
      "question": "What are the key findings?",
      "total_claims": 5,
      "supported_claims": 3,
      "contradicted_claims": 1,
      "unverifiable_claims": 1,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "offset": 0,
  "limit": 20
}
```

**Business Logic Owner:** `QueryRepository`.

---

### `GET /api/v1/queries/{query_id}`

Get full query result including all pipeline details.

**Response** `200 OK`: Same schema as `POST /api/v1/queries` response.

**Response** `404 Not Found`

**Business Logic Owner:** `QueryRepository`.

---

### `GET /api/v1/queries/{query_id}/pipeline`

Get detailed pipeline execution trace for a query.

**Response** `200 OK`:
```json
{
  "query_id": "uuid",
  "stages": [
    {
      "name": "retrieval",
      "status": "completed",
      "duration_ms": 120,
      "output_summary": "Retrieved 5 chunks"
    },
    {
      "name": "generation",
      "status": "completed",
      "duration_ms": 2100,
      "output_summary": "Generated 3-sentence answer"
    },
    {
      "name": "claim_decomposition",
      "status": "completed",
      "duration_ms": 800,
      "output_summary": "Extracted 4 claims"
    },
    {
      "name": "verification",
      "status": "completed",
      "duration_ms": 600,
      "output_summary": "3 supported, 1 contradicted, 0 unverifiable"
    },
    {
      "name": "repair",
      "status": "completed",
      "duration_ms": 900,
      "output_summary": "Repaired 1 claim"
    },
    {
      "name": "re_verification",
      "status": "completed",
      "duration_ms": 200,
      "output_summary": "1 repaired claim verified as supported"
    }
  ],
  "total_duration_ms": 4720
}
```

**Business Logic Owner:** `PipelineOrchestrator`, `QueryRepository`.

---

## 4. Baseline Comparison

> **Decision:** Baseline and full pipeline queries are unified under `POST /api/v1/queries` using the `mode` field (`"baseline"` or `"full"`). A separate `/api/v1/queries/baseline` endpoint was considered but rejected because: (1) baseline and full-pipeline queries share the same request schema, (2) the `mode` field is already stored in the database for comparison, and (3) a single endpoint simplifies API surface and frontend integration. This decision is recorded here and in [ARCHITECTURE.md](ARCHITECTURE.md).

Baseline queries use `mode: "baseline"` on `POST /api/v1/queries`.

**Response** `200 OK` (baseline mode):
```json
{
  "id": "uuid",
  "question": "What are the key findings?",
  "draft_answer": "The study found that...",
  "final_answer": "The study found that...",
  "claims": [],
  "citations": [],
  "retrieved_chunks": [
    {
      "chunk_id": "uuid",
      "text": "...",
      "page_number": 12,
      "similarity_score": 0.89,
      "document_id": "uuid"
    }
  ],
  "pipeline_metadata": {
    "total_claims": 0,
    "latency_ms": 2300
  },
  "pipeline_config": {
    "mode": "baseline",
    "generation_model": "qwen3-4b-instruct-2507",
    "embedding_model": "BAAI/bge-small-en-v1.5",
    "top_k": 5
  },
  "created_at": "2026-01-01T00:00:00Z"
}
```

**Business Logic Owner:** `PipelineOrchestrator` (baseline mode).

---

## Error Responses

All error responses follow this envelope:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description."
  }
}
```

### Standard Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | `INVALID_FILE_TYPE` | Uploaded file is not a supported format. |
| 400 | `NO_DOCUMENTS_INDEXED` | Specified documents have no indexed embeddings. |
| 404 | `DOCUMENT_NOT_FOUND` | Document ID does not exist. |
| 404 | `QUERY_NOT_FOUND` | Query ID does not exist. |
| 413 | `FILE_TOO_LARGE` | Uploaded file exceeds size limit. |
| 422 | `VALIDATION_ERROR` | Request body fails schema validation. |
| 500 | `INTERNAL_ERROR` | Unexpected server error. |
| 503 | `LLM_UNAVAILABLE` | LLM runtime is not reachable. |
| 503 | `NLI_UNAVAILABLE` | NLI model is not reachable. |

---

## Cross-References

- Architecture and service boundaries: [ARCHITECTURE.md](ARCHITECTURE.md)
- Database entities: [DATABASE_DESIGN.md](DATABASE_DESIGN.md)
- Pipeline stages: [ARCHITECTURE.md — AI Pipeline Data Flow](ARCHITECTURE.md#4-ai-pipeline-data-flow)
