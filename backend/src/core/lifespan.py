from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI

from src.core.firebase.client import initialize_firebase
from src.core.settings import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator[None, Any]:
    if settings.app_env == "dev":
        load_dotenv()

    initialize_firebase()
    # Code before app initialization
    yield
    # Code before app shutdown
