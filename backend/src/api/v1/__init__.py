from fastapi import APIRouter

from .single_player import router as single_player_router

api_router = APIRouter()
api_router.include_router(single_player_router, prefix="/single-player")
