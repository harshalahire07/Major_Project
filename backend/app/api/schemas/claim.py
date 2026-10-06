from typing import List
from pydantic import BaseModel, Field
import uuid

class Claim(BaseModel):
    claim_id: uuid.UUID
    claim_order: int
    claim_text: str

class ClaimSet(BaseModel):
    claims: List[Claim]
