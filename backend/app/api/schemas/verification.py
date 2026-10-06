from pydantic import BaseModel, Field
from typing import List, Optional, Literal
import uuid

from app.api.schemas.retrieval import RetrievalResultItem

VerificationStatus = Literal["SUPPORTED", "CONTRADICTED", "UNVERIFIABLE"]

class VerificationResult(BaseModel):
    claim_id: uuid.UUID
    claim_text: str
    status: VerificationStatus
    entailment_score: Optional[float] = None
    contradiction_score: Optional[float] = None
    neutral_score: Optional[float] = None
    evidence: List[RetrievalResultItem] = Field(default_factory=list)
    model_name: str

class VerificationResultSet(BaseModel):
    results: List[VerificationResult]
