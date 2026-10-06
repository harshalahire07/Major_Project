import tiktoken
import logging
from typing import List, Tuple
from app.services.retrieval.base import RetrievalResult
from app.core.config import settings

logger = logging.getLogger(__name__)

class ContextBuilder:
    def __init__(self, max_tokens: int = settings.context_max_tokens):
        self.max_tokens = max_tokens
        # Using cl100k_base for fast, consistent rough-token estimation
        self.tokenizer = tiktoken.get_encoding("cl100k_base")

    def build_context(self, results: List[RetrievalResult]) -> Tuple[str, List[RetrievalResult]]:
        """
        Build a formatted context string from retrieval results.
        Returns the formatted context string and the list of chunks that actually fit within the budget.
        """
        formatted_blocks = []
        used_results = []
        current_tokens = 0

        for result in results:
            block = f"[Source | Page {result.page_number} | ID {result.chunk_id}]\n{result.text.strip()}\n"
            block_tokens = len(self.tokenizer.encode(block))

            if current_tokens + block_tokens > self.max_tokens:
                logger.debug(f"Context budget reached. Stopping at {current_tokens} tokens.")
                break

            formatted_blocks.append(block)
            used_results.append(result)
            current_tokens += block_tokens

        return "\n".join(formatted_blocks).strip(), used_results
