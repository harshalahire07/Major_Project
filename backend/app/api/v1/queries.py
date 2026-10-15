from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
import logging
import uuid

from app.core.database import get_db_session
from app.core.config import settings
from app.api.schemas.retrieval import RetrievalQueryRequest, RetrievalQueryResponse, RetrievalResultItem
from app.api.schemas.query import QueryRequest, QueryResponse
from app.services.retrieval.service import RetrievalService
from app.services.pipeline.rag_service import RAGService
from app.services.llm.ollama_provider import OllamaQwenProvider

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/retrieve", response_model=RetrievalQueryResponse, status_code=status.HTTP_200_OK)
async def retrieve_chunks(
    request: RetrievalQueryRequest,
    db: AsyncSession = Depends(get_db_session),
):
    """
    Retrieve relevant chunks for a given query.
    """
    if not request.query.strip():
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": {"code": "INVALID_QUERY", "message": "Query cannot be empty or whitespace only."}},
        )

    top_k = request.top_k if request.top_k is not None else settings.retrieval_top_k

    if top_k <= 0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": {"code": "INVALID_TOP_K", "message": "top_k must be greater than 0."}},
        )

    try:
        retrieval_service = RetrievalService(session=db)
        results = await retrieval_service.search(
            query=request.query.strip(),
            top_k=top_k,
            document_id=request.document_id,
        )

        items = [
            RetrievalResultItem(
                chunk_id=res.chunk_id,
                document_id=res.document_id,
                page_number=res.page_number,
                text=res.text,
                score=res.score,
            )
            for res in results
        ]

        return RetrievalQueryResponse(results=items)

    except Exception as e:
        logger.error("Retrieval failed: %s", e)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": {"code": "RETRIEVAL_FAILED", "message": "An error occurred during retrieval."}},
        )


@router.post("", response_model=QueryResponse, status_code=status.HTTP_200_OK)
async def submit_query(
    request: QueryRequest,
    db: AsyncSession = Depends(get_db_session),
):
    """
    Submit a question against one or more uploaded documents.
    Executes the M8 Pipeline (baseline or full mode).
    """
    if not request.question.strip():
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": {"code": "INVALID_QUERY", "message": "Question cannot be empty or whitespace only."}},
        )

    if not request.document_ids:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": {"code": "INVALID_QUERY", "message": "At least one document_id is required."}},
        )

    try:
        from app.services.pipeline.rag_service import RAGService
        from app.services.pipeline.claim_decomposition_service import ClaimDecompositionService
        from app.services.pipeline.claim_decomposer import LLMClaimDecomposer
        from app.services.pipeline.claim_verification_service import ClaimVerificationService
        from app.services.pipeline.verification_provider import NLIVerificationProvider
        from app.services.pipeline.claim_repair_service import ClaimRepairService
        from app.services.pipeline.repair_provider import LLMRepairProvider
        from app.services.pipeline.pipeline_orchestrator import PipelineOrchestrator

        retrieval_service = RetrievalService(session=db)
        llm_provider = OllamaQwenProvider()

        # Check LLM availability before proceeding
        if not await llm_provider.is_available():
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"error": {"code": "LLM_UNAVAILABLE", "message": "The generation model is currently unavailable."}},
            )

        rag_service = RAGService(retrieval_service=retrieval_service, llm_provider=llm_provider)
        
        decomposition_service = None
        verification_service = None
        repair_service = None
        
        if request.mode == "full":
            # M5: Decomposition
            decomposer = LLMClaimDecomposer(llm_provider=llm_provider)
            decomposition_service = ClaimDecompositionService(decomposer=decomposer)
            
            # M6: Verification
            verification_provider = NLIVerificationProvider(model_name="cross-encoder/nli-deberta-v3-small")
            verification_service = ClaimVerificationService(
                retrieval_service=retrieval_service, 
                provider=verification_provider
            )
            
            # M7: Repair
            repair_provider = LLMRepairProvider(llm_provider=llm_provider)
            repair_service = ClaimRepairService(
                repair_provider=repair_provider,
                verification_service=verification_service,
                retrieval_service=retrieval_service
            )

        orchestrator = PipelineOrchestrator(
            rag_service=rag_service,
            decomposition_service=decomposition_service,
            verification_service=verification_service,
            repair_service=repair_service
        )

        # Let the orchestrator handle baseline vs full mode based on request.mode
        return await orchestrator.execute_query(request)

    except Exception as e:
        logger.exception("Query pipeline failed: %s", e)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": {"code": "GENERATION_FAILED", "message": "An error occurred during query processing."}},
        )
