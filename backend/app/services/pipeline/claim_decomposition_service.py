from typing import List
from app.api.schemas.claim import Claim, ClaimSet
from app.services.pipeline.claim_decomposer import ClaimDecomposer

class ClaimDecompositionService:
    """Orchestrates the claim decomposition process."""
    
    def __init__(self, decomposer: ClaimDecomposer):
        self.decomposer = decomposer
        
    async def decompose_answer(self, draft_answer: str) -> ClaimSet:
        """
        Takes a draft answer and decomposes it into an ordered set of claims.
        """
        claims = await self.decomposer.decompose(draft_answer)
        return ClaimSet(claims=claims)
