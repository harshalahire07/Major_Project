from dataclasses import dataclass
from typing import List
import uuid

from app.services.retrieval.service import RetrievalService
from app.services.retrieval.base import RetrievalResult
from app.services.llm.base import LLMProvider
from app.services.llm.context_builder import ContextBuilder
from app.services.llm.prompt_builder import build_rag_prompt

@dataclass
class RAGResponse:
    draft_answer: str
    used_evidence: List[RetrievalResult]
    model_name: str
    token_count: int | None = None

class RAGService:
    def __init__(self, retrieval_service: RetrievalService, llm_provider: LLMProvider):
        self.retrieval_service = retrieval_service
        self.llm_provider = llm_provider
        self.context_builder = ContextBuilder()

    async def generate_answer(self, query: str, document_ids: List[uuid.UUID] | None = None, top_k: int = 5) -> RAGResponse:
        """
        Orchestrates the Retrieval-Augmented Generation pipeline.
        """
        # 1. Retrieve chunks. (For MVP, we support scoping to a single document_id via the API)
        # If document_ids has exactly one, pass it. Otherwise, pass None.
        doc_id = document_ids[0] if document_ids and len(document_ids) == 1 else None
        
        retrieved_chunks = await self.retrieval_service.search(
            query=query,
            top_k=top_k,
            document_id=doc_id
        )

        # 2. No-evidence behavior
        if not retrieved_chunks:
            return RAGResponse(
                draft_answer="There is insufficient evidence in the provided documents to answer the question.",
                used_evidence=[],
                model_name="deterministic"
            )

        # 3. Build context
        context_str, used_evidence = self.context_builder.build_context(retrieved_chunks)

        if not used_evidence:
             return RAGResponse(
                draft_answer="There is insufficient evidence in the provided documents to answer the question.",
                used_evidence=[],
                model_name="deterministic"
            )

        # 4. Construct prompt
        prompt = build_rag_prompt(question=query, context=context_str)

        # 5. Call LLM
        llm_response = await self.llm_provider.generate(prompt=prompt)

        return RAGResponse(
            draft_answer=llm_response.text,
            used_evidence=used_evidence,
            model_name=llm_response.model,
            token_count=llm_response.token_count
        )
