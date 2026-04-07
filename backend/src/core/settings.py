from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # backend app settings
    frontend_url: str = "http://localhost:3000"
    api_v1_prefix: str = "/api/v1"
    app_env: Literal["dev", "prod"] = "dev"

    firebase_private_key: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()  # pyright: ignore[reportCallIssue]
