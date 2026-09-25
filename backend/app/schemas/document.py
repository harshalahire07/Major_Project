from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorDetail


class PageSummary(BaseModel):
    page_number: int
    text_length: int

    model_config = ConfigDict(from_attributes=True)


class DocumentSummary(BaseModel):
    id: uuid.UUID
    title: str
    filename: str
    page_count: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DocumentDetail(DocumentSummary):
    pages: list[PageSummary]


class DocumentListResponse(BaseModel):
    items: list[DocumentSummary]
    total: int
    offset: int
    limit: int
