# ADR 002: Vector Store

## Status

**Accepted**

## Date

2026-09-23

## Context

The system requires a vector store for two retrieval tasks:

1. **Query retrieval** — Find relevant document chunks for a user question.
2. **Evidence retrieval** — Find evidence passages for individual claims during verification.

The vector store must support fast approximate nearest-neighbor search over dense embeddings (384 dimensions for BGE-small, up to 1024 for larger models).

## Decision

Use **FAISS** (Facebook AI Similarity Search) as the initial vector store, running in-process.

## Rationale

1. **Performance:** FAISS is highly optimized for dense vector search. For the MVP's scale (hundreds to low thousands of chunks), it provides sub-millisecond search.
2. **No external service:** Runs in-process as a Python library. No additional infrastructure to deploy or manage.
3. **Maturity:** Well-established, extensively tested, widely used in research and production.
4. **Index persistence:** Supports serializing indexes to disk, allowing restart without re-embedding.
5. **Flexibility:** Supports multiple index types (flat, IVF, HNSW) for different scale/accuracy trade-offs.

## Alternatives Considered

| Alternative | Decision | Reason |
|-------------|----------|--------|
| pgvector (PostgreSQL extension) | Deferred | Would simplify infrastructure (single data store) but adds database load. May be evaluated later. |
| Chroma | Deferred | Convenient API but adds a dependency for minimal benefit over FAISS at MVP scale. |
| Pinecone / Weaviate (managed) | Rejected | Cloud services; violates local-execution preference and adds cost. |
| Direct NumPy / brute-force search | Rejected | Acceptable for tiny collections but does not scale. FAISS is nearly as simple to use. |

## Risks

- **Scalability:** In-process FAISS does not scale to very large collections (millions of vectors). This is acceptable for the MVP, which targets small document collections.
- **No built-in metadata filtering:** FAISS does not natively support filtering by document ID during search. This must be handled in the application layer (pre-filter or post-filter).
- **Index consistency:** The FAISS index is separate from PostgreSQL. Application logic must keep them in sync (e.g., when a document is deleted).

## Consequences

- The `RetrievalProvider` interface abstracts FAISS, so the vector store can be replaced (e.g., with pgvector) without modifying pipeline logic.
- Document deletion must explicitly remove entries from both PostgreSQL and FAISS.
- The FAISS index file is stored on the local filesystem alongside `data/documents/`.
- Embedding vectors are not stored in PostgreSQL. The `chunks.faiss_index_id` column stores the integer index position within the FAISS index. A persisted index metadata file maintains the bidirectional mapping between FAISS integer positions and PostgreSQL chunk UUIDs, ensuring deterministic reconstruction after application restart.

## Cross-References

- Retrieval architecture: [../ARCHITECTURE.md](../ARCHITECTURE.md#4-ai-pipeline-data-flow)
- Database design: [../DATABASE_DESIGN.md](../DATABASE_DESIGN.md)
- Model selection (embedding model): [../MODEL_SELECTION.md](../MODEL_SELECTION.md#3-embedding-model-baaibge-small-en-v15)
