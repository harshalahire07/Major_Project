from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "docverify"
    app_version: str = "0.1.0"
    app_env: str = "development"
    app_debug: bool = True

    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    database_host: str = "localhost"
    database_port: int = 5432
    database_name: str = "docverify"
    database_user: str = "docverify"
    database_password: str = "changeme"

    llm_provider: str = "local"
    llm_model_name: str = "qwen3:4b-instruct"
    llm_temperature: float = 0.1
    llm_max_tokens: int = 1024
    llm_timeout: float = 30.0
    context_max_tokens: int = 3000

    ollama_base_url: str = "http://localhost:11434"

    # Verification settings
    verification_model_name: str = "cross-encoder/nli-deberta-v3-small"
    verification_device: str | None = None
    verification_entailment_threshold: float = 0.7
    verification_contradiction_threshold: float = 0.7
    verification_top_k: int = 5

    # Repair settings
    repair_max_iterations: int = 2
    repair_temperature: float = 0.1
    repair_additional_retrieval_top_k: int = 5

    embedding_model_name: str = "BAAI/bge-small-en-v1.5"
    embedding_device: str | None = None  # None allows auto-detection or fallback

    # Document upload settings
    upload_dir: str = "data/documents"
    max_upload_size_bytes: int = 50 * 1024 * 1024  # 50 MB

    # Chunking settings
    chunk_size_tokens: int = 400
    chunk_overlap_tokens: int = 60

    # FAISS and Retrieval settings
    faiss_index_path: str = "data/faiss/index.faiss"
    faiss_mapping_path: str = "data/faiss/mapping.json"
    retrieval_top_k: int = 5

    cors_origins: list[str] = ["http://localhost:5173"]

    model_config = {"env_file": ".env", "extra": "ignore"}

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.database_user}:{self.database_password}"
            f"@{self.database_host}:{self.database_port}/{self.database_name}"
        )

    @property
    def resolved_upload_dir(self) -> Path:
        path = Path(self.upload_dir)
        if not path.is_absolute():
            path = Path.cwd() / path
        return path


settings = Settings()
