from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app.core.database import get_db_session
from app.api.schemas.retrieval import RetrievalQueryRequest, RetrievalQueryResponse, RetrievalResultItem
from app.services.retrieval.service import RetrievalService
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

from fastapi.responses import JSONResponse

@router.post("/retrieve", response_model=RetrievalQueryResponse, status_code=status.HTTP_200_OK)
async def retrieve_chunks(
    request: RetrievalQueryRequest,
    db: AsyncSession = Depends(get_db_session)
):
    """
    Retrieve relevant chunks for a given query.
    """
    if not request.query.strip():
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": {"code": "INVALID_QUERY", "message": "Query cannot be empty or whitespace only."}}
        )

    top_k = request.top_k if request.top_k is not None else settings.retrieval_top_k

    if top_k <= 0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": {"code": "INVALID_TOP_K", "message": "top_k must be greater than 0."}}
        )

    try:
        retrieval_service = RetrievalService(session=db)
        results = await retrieval_service.search(
            query=request.query.strip(),
            top_k=top_k,
            document_id=request.document_id
        )
        
        items = [
            RetrievalResultItem(
                chunk_id=res.chunk_id,
                document_id=res.document_id,
                page_number=res.page_number,
                text=res.text,
                score=res.score
            )
            for res in results
        ]
        
        return RetrievalQueryResponse(results=items)
        
    except Exception as e:
        logger.error("Retrieval failed: %s", e)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": {"code": "RETRIEVAL_FAILED", "message": "An error occurred during retrieval."}}
        )
