from __future__ import annotations

import logging
import uuid

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db_session
from app.schemas.document import (
    DocumentDetail,
    DocumentListResponse,
    DocumentSummary,
    ErrorResponse,
    PageSummary,
)
from app.services.documents.service import DocumentService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post(
    "",
    response_model=DocumentSummary,
    status_code=201,
    responses={
        400: {"model": ErrorResponse},
        413: {"model": ErrorResponse},
    },
)
async def upload_document(
    file: UploadFile = File(...),
    title: str | None = Form(default=None),
    session: AsyncSession = Depends(get_db_session),
) -> DocumentSummary | JSONResponse:
    content = await file.read()

    # Size check before any processing
    if len(content) > settings.max_upload_size_bytes:
        max_mb = settings.max_upload_size_bytes // (1024 * 1024)
        return JSONResponse(
            status_code=413,
            content={
                "error": {
                    "code": "FILE_TOO_LARGE",
                    "message": f"File exceeds the {max_mb} MB limit.",
                }
            },
        )

    service = DocumentService(session)
    try:
        document = await service.upload(
            filename=file.filename or "upload.pdf",
            content=content,
            title=title,
        )
    except ValueError as exc:
        msg = str(exc)
        if ":" in msg:
            code, message = msg.split(":", 1)
        else:
            code, message = "INVALID_FILE_TYPE", msg

        status = 413 if code == "FILE_TOO_LARGE" else 400
        return JSONResponse(
            status_code=status,
            content={"error": {"code": code, "message": message}},
        )
    except Exception:
        logger.exception("Unexpected error processing upload")
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred.",
                }
            },
        )

    return DocumentSummary.model_validate(document)


@router.get("", response_model=DocumentListResponse)
async def list_documents(
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    session: AsyncSession = Depends(get_db_session),
) -> DocumentListResponse:
    service = DocumentService(session)
    items, total = await service.list_documents(offset=offset, limit=limit)
    return DocumentListResponse(
        items=[DocumentSummary.model_validate(d) for d in items],
        total=total,
        offset=offset,
        limit=limit,
    )


@router.get(
    "/{document_id}",
    response_model=DocumentDetail,
    responses={404: {"model": ErrorResponse}},
)
async def get_document(
    document_id: uuid.UUID,
    session: AsyncSession = Depends(get_db_session),
) -> DocumentDetail | JSONResponse:
    service = DocumentService(session)
    document = await service.get_document(document_id)
    if document is None:
        return JSONResponse(
            status_code=404,
            content={
                "error": {
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": f"Document with ID {document_id} not found.",
                }
            },
        )
    return DocumentDetail(
        id=document.id,
        title=document.title,
        filename=document.filename,
        page_count=document.page_count,
        status=document.status,
        created_at=document.created_at,
        pages=[
            PageSummary(page_number=p.page_number, text_length=p.text_length)
            for p in document.pages
        ],
    )


@router.delete(
    "/{document_id}",
    status_code=204,
    responses={404: {"model": ErrorResponse}},
)
async def delete_document(
    document_id: uuid.UUID,
    session: AsyncSession = Depends(get_db_session),
):
    service = DocumentService(session)
    success = await service.delete_document(document_id)
    if not success:
        return JSONResponse(
            status_code=404,
            content={
                "error": {
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": f"Document with ID {document_id} not found.",
                }
            },
        )
    return None
