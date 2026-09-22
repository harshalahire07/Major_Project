from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class LLMResponse:
    text: str
    model: str
    token_count: int | None = None


class LLMProvider(ABC):
    """
    Swappable generation backend. Subclass this to add new providers
    (Ollama, llama.cpp, remote APIs, etc.) without touching call sites.
    """

    @abstractmethod
    async def generate(self, prompt: str, **kwargs: object) -> LLMResponse:
        ...

    @abstractmethod
    async def is_available(self) -> bool:
        ...
