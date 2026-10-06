import httpx
import logging
from app.services.llm.base import LLMProvider, LLMResponse
from app.core.config import settings

logger = logging.getLogger(__name__)

class OllamaQwenProvider(LLMProvider):
    def __init__(self):
        self.base_url = settings.ollama_base_url.rstrip("/")
        self.model_name = settings.llm_model_name
        self.timeout = settings.llm_timeout

    async def generate(self, prompt: str, **kwargs: object) -> LLMResponse:
        temperature = kwargs.get("temperature", settings.llm_temperature)
        max_tokens = kwargs.get("max_tokens", settings.llm_max_tokens)

        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(f"{self.base_url}/api/generate", json=payload)
                response.raise_for_status()
                data = response.json()
                
                return LLMResponse(
                    text=data.get("response", "").strip(),
                    model=self.model_name,
                    token_count=data.get("eval_count")
                )
        except httpx.HTTPError as e:
            logger.error("Failed to generate from Ollama: %s", e)
            raise RuntimeError(f"LLM Generation failed: {e}") from e

    async def is_available(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                response.raise_for_status()
                data = response.json()
                
                # Optionally check if the required model is actually installed
                models = [model.get("name") for model in data.get("models", [])]
                if not any(self.model_name in m for m in models):
                    logger.warning(f"Ollama is reachable, but model '{self.model_name}' is not downloaded.")
                    return False
                    
                return True
        except Exception as e:
            logger.warning("Ollama is unavailable: %s", e)
            return False
