from fastapi import APIRouter

from src.core.settings import get_settings

from .single_player import router as single_player_router

settings = get_settings()

api_router = APIRouter(prefix=settings.api_v1_prefix)
api_router.include_router(single_player_router)
