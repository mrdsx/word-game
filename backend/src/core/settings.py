from typing import Any, Literal

from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings, SettingsConfigDict

from core.lifespan import lifespan

EnvType = Literal["DEV", "PROD"]


class Settings(BaseSettings):
    # backend app settings
    frontend_url: str = "http://localhost:3000"
    api_v1_prefix: str = "/api/v1"
    environment: EnvType = "DEV"

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
            "host": "0.0.0.0" if self.environment == "PROD" else "127.0.0.1",
            "port": 8000,
            "reload": self.environment == "DEV",
        }

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()  # type: ignore
