from pydantic import BaseModel, Field
from typing import List, Optional
import uuid

class QueryRequest(BaseModel):
    question: str = Field(..., description="Natural language question.", min_length=1)
    document_ids: List[uuid.UUID] = Field(..., description="Target documents (at least one).", min_length=1)
    top_k: Optional[int] = Field(5, description="Number of chunks to retrieve.", gt=0)
    mode: Optional[str] = Field("baseline", description="Mode (e.g., 'baseline', 'full')")

class ClaimResponse(BaseModel):
    id: uuid.UUID
    text: str
    status: str

class QueryResponse(BaseModel):
    id: uuid.UUID
    question: str
    draft_answer: str
    final_answer: Optional[str] = None
    claims: Optional[List[ClaimResponse]] = None
    
    # Metadata for transparency
    used_chunk_ids: List[uuid.UUID]
    model_name: str
