from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, extra="ignore")

    database_url: str
    cors_origins: str = "http://localhost:3700"
    # 공개 서버(Tunnel 뒤 컨테이너)에서는 끈다 — /docs·/redoc·/openapi.json 비공개
    docs_enabled: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
