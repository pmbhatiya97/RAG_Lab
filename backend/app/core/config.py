from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "RAG Lab API"
    app_mode: str = "local"
    ollama_base_url: str = "http://localhost:11434"
    huggingface_token: str | None = None
    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    max_upload_mb: int = 50

    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

    @property
    def origins(self) -> list[str]:
        return [value.strip() for value in self.allowed_origins.split(",") if value.strip()]


settings = Settings()
