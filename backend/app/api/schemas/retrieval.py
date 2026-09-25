from pydantic import BaseModel, Field
from typing import Optional
import uuid

class RetrievalQueryRequest(BaseModel):
    query: str = Field(..., description="The query string to search for.", min_length=1)
    top_k: Optional[int] = Field(None, description="Number of results to return.", gt=0, le=100)
    document_id: Optional[uuid.UUID] = Field(None, description="Optional document ID to scope the search.")

class RetrievalResultItem(BaseModel):
    chunk_id: uuid.UUID
    document_id: uuid.UUID
    page_number: int
    text: str
    score: float

class RetrievalQueryResponse(BaseModel):
    results: list[RetrievalResultItem]
