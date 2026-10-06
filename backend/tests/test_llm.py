"""Unit tests for LLM components: ContextBuilder, prompt_builder, OllamaQwenProvider contract, RAGService."""
import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock

from app.services.llm.context_builder import ContextBuilder
from app.services.llm.prompt_builder import build_rag_prompt
from app.services.llm.base import LLMProvider, LLMResponse
from app.services.retrieval.base import RetrievalResult


# ---------------------------------------------------------------------------
# ContextBuilder tests
# ---------------------------------------------------------------------------

class TestContextBuilder:
    def test_formatting_preserves_metadata(self):
        cid1 = uuid.uuid4()
        cid2 = uuid.uuid4()
        builder = ContextBuilder(max_tokens=500)
        results = [
            RetrievalResult(chunk_id=cid1, document_id=uuid.uuid4(), page_number=5, text="First evidence", score=0.9),
            RetrievalResult(chunk_id=cid2, document_id=uuid.uuid4(), page_number=6, text="Second evidence", score=0.8),
        ]
        context_str, used = builder.build_context(results)

        assert len(used) == 2
        assert f"[Source | Page 5 | ID {cid1}]" in context_str
        assert "First evidence" in context_str
        assert f"[Source | Page 6 | ID {cid2}]" in context_str
        assert "Second evidence" in context_str

    def test_ordering_preserves_retrieval_rank(self):
        builder = ContextBuilder(max_tokens=500)
        results = [
            RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=1, text="Best match", score=0.95),
            RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=2, text="Second match", score=0.85),
            RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=3, text="Third match", score=0.75),
        ]
        context_str, used = builder.build_context(results)

        assert len(used) == 3
        # Verify ordering: "Best match" appears before "Second match" before "Third match"
        pos1 = context_str.index("Best match")
        pos2 = context_str.index("Second match")
        pos3 = context_str.index("Third match")
        assert pos1 < pos2 < pos3

    def test_budget_truncation(self):
        builder = ContextBuilder(max_tokens=50)
        results = [
            RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=1,
                            text="This is some short text for block one.", score=0.9),
            RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=2,
                            text="This is some short text for block two.", score=0.8),
        ]
        context_str, used = builder.build_context(results)

        assert len(used) == 1
        assert "block one" in context_str
        assert "block two" not in context_str

    def test_empty_results(self):
        builder = ContextBuilder(max_tokens=500)
        context_str, used = builder.build_context([])

        assert context_str == ""
        assert used == []


# ---------------------------------------------------------------------------
# Prompt builder tests
# ---------------------------------------------------------------------------

class TestPromptBuilder:
    def test_prompt_contains_question_and_context(self):
        prompt = build_rag_prompt(question="What is the color of the sky?", context="[Source 1] The sky is blue.")
        assert "What is the color of the sky?" in prompt
        assert "The sky is blue" in prompt

    def test_prompt_contains_rules(self):
        prompt = build_rag_prompt(question="Q", context="C")
        assert "RULES" in prompt
        assert "DO NOT invent" in prompt
        assert "evidence" in prompt.lower()

    def test_prompt_preserves_multiline_context(self):
        context = "[Source | Page 1]\nLine one\n\n[Source | Page 2]\nLine two"
        prompt = build_rag_prompt(question="Q", context=context)
        assert "Line one" in prompt
        assert "Line two" in prompt


# ---------------------------------------------------------------------------
# LLMProvider contract tests
# ---------------------------------------------------------------------------

class TestLLMProviderContract:
    """Verify the abstract contract is well-defined and subclassable."""

    def test_cannot_instantiate_abstract(self):
        with pytest.raises(TypeError):
            LLMProvider()

    def test_concrete_subclass_must_implement(self):
        class IncompleteProvider(LLMProvider):
            pass
        with pytest.raises(TypeError):
            IncompleteProvider()

    def test_concrete_subclass_can_instantiate(self):
        class MockProvider(LLMProvider):
            async def generate(self, prompt: str, **kwargs: object) -> LLMResponse:
                return LLMResponse(text="ok", model="mock")
            async def is_available(self) -> bool:
                return True
        provider = MockProvider()
        assert provider is not None


# ---------------------------------------------------------------------------
# RAGService unit tests (isolated from API)
# ---------------------------------------------------------------------------

class TestRAGService:
    @pytest.mark.asyncio
    async def test_no_evidence_returns_deterministic_answer(self):
        from app.services.pipeline.rag_service import RAGService

        mock_retrieval = MagicMock()
        mock_retrieval.search = AsyncMock(return_value=[])
        mock_llm = AsyncMock(spec=LLMProvider)

        service = RAGService(retrieval_service=mock_retrieval, llm_provider=mock_llm)
        result = await service.generate_answer(query="anything", document_ids=[uuid.uuid4()])

        assert "insufficient evidence" in result.draft_answer
        assert result.model_name == "deterministic"
        assert result.used_evidence == []
        # LLM should NOT have been called
        mock_llm.generate.assert_not_called()

    @pytest.mark.asyncio
    async def test_successful_generation(self):
        from app.services.pipeline.rag_service import RAGService

        chunk_id = uuid.uuid4()
        doc_id = uuid.uuid4()
        evidence = [
            RetrievalResult(chunk_id=chunk_id, document_id=doc_id, page_number=3, text="Evidence text", score=0.9),
        ]

        mock_retrieval = MagicMock()
        mock_retrieval.search = AsyncMock(return_value=evidence)

        mock_llm = AsyncMock(spec=LLMProvider)
        mock_llm.generate = AsyncMock(return_value=LLMResponse(text="Generated answer", model="test-model", token_count=15))

        service = RAGService(retrieval_service=mock_retrieval, llm_provider=mock_llm)
        result = await service.generate_answer(query="What happened?", document_ids=[doc_id])

        assert result.draft_answer == "Generated answer"
        assert result.model_name == "test-model"
        assert result.token_count == 15
        assert len(result.used_evidence) == 1
        assert result.used_evidence[0].chunk_id == chunk_id
        mock_llm.generate.assert_called_once()

    @pytest.mark.asyncio
    async def test_llm_failure_propagates(self):
        from app.services.pipeline.rag_service import RAGService

        evidence = [
            RetrievalResult(chunk_id=uuid.uuid4(), document_id=uuid.uuid4(), page_number=1, text="text", score=0.8),
        ]

        mock_retrieval = MagicMock()
        mock_retrieval.search = AsyncMock(return_value=evidence)

        mock_llm = AsyncMock(spec=LLMProvider)
        mock_llm.generate = AsyncMock(side_effect=RuntimeError("LLM crashed"))

        service = RAGService(retrieval_service=mock_retrieval, llm_provider=mock_llm)

        with pytest.raises(RuntimeError, match="LLM crashed"):
            await service.generate_answer(query="Q", document_ids=[uuid.uuid4()])

    @pytest.mark.asyncio
    async def test_single_document_id_passed_to_retrieval(self):
        from app.services.pipeline.rag_service import RAGService

        doc_id = uuid.uuid4()
        mock_retrieval = MagicMock()
        mock_retrieval.search = AsyncMock(return_value=[])
        mock_llm = AsyncMock(spec=LLMProvider)

        service = RAGService(retrieval_service=mock_retrieval, llm_provider=mock_llm)
        await service.generate_answer(query="Q", document_ids=[doc_id])

        # Verify that search was called with the single document_id
        mock_retrieval.search.assert_called_once_with(query="Q", top_k=5, document_id=doc_id)
