from functools import lru_cache
from typing import Any, Literal

from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings, SettingsConfigDict

from core.lifespan import lifespan





class Settings(BaseSettings):
    # backend app settings
    frontend_url: str = "http://localhost:3000"
    api_v1_prefix: str = "/api/v1"
    app_env: Literal["dev", "prod"] = "dev"

    firebase_private_key: str

    @property
    def fastapi_kwargs(self) -> dict[str, Any]:
        return {
            "lifespan": lifespan,
        }

    @property
    def fastapi_middleware_kwargs(self) -> dict[str, Any]:
        return {
            "middleware_class": CORSMiddleware,
            "allow_origins": [self.frontend_url],
            "allow_credentials": True,
            "allow_methods": ["GET", "DELETE"],
            "allow_headers": ["Authorization", "Access-Control-Allow-Origin"],
        }

    @property
    def uvicorn_kwargs(self) -> dict[str, Any]:
        return {
            "app": "main:app",
            "host": "0.0.0.0" if self.app_env == "prod" else "127.0.0.1",
            "port": 8000,
            "reload": self.app_env == "dev",
        }

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings() # pyright: ignore[reportCallIssue]
