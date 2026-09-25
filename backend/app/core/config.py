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
    llm_model_name: str = "qwen3-4b-instruct"

    ollama_base_url: str = "http://localhost:11434"

    embedding_model_name: str = "all-MiniLM-L6-v2"

    # Document upload settings
    upload_dir: str = "data/documents"
    max_upload_size_bytes: int = 50 * 1024 * 1024  # 50 MB

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
