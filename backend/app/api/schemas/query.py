from pydantic import BaseModel, Field
from typing import List, Optional, Literal
import uuid

from app.api.schemas.repair import FinalClaimState

class QueryRequest(BaseModel):
    question: str = Field(..., description="Natural language question.", min_length=1)
    document_ids: List[uuid.UUID] = Field(..., description="Target documents (at least one).", min_length=1)
    top_k: Optional[int] = Field(5, description="Number of chunks to retrieve.", gt=0)
    mode: Literal["baseline", "full"] = Field("baseline", description="Pipeline execution mode")

class QueryResponse(BaseModel):
    query_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    mode: str = "baseline"
    question: str
    draft_answer: str
    final_answer: Optional[str] = None
    claims: Optional[List[FinalClaimState]] = None
    
    # Metadata for transparency
    used_chunk_ids: List[uuid.UUID]
    model_name: str
