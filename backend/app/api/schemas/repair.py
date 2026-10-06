from pydantic import BaseModel, Field
from typing import List, Optional, Literal
import uuid

from app.api.schemas.verification import VerificationResult

RepairStatus = Literal["NOT_REQUIRED", "REPAIRED", "FAILED", "FLAGGED"]

class RepairAttempt(BaseModel):
    iteration: int
    original_claim_text: str
    repaired_claim_text: str
    verification_after_repair: VerificationResult

class FinalClaimState(BaseModel):
    claim_id: uuid.UUID
    claim_order: int
    original_claim_text: str
    current_claim_text: str
    
    # Auditing
    original_verification_result: VerificationResult
    repair_history: List[RepairAttempt] = Field(default_factory=list)
    
    # End state
    final_verification_result: VerificationResult
    repair_status: RepairStatus

class ClaimRepairResultSet(BaseModel):
    final_states: List[FinalClaimState]
