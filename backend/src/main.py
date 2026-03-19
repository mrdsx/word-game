import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.v1 import api_router
from core.lifespan import lifespan

allowed_origins = ["http://localhost:3000", os.getenv("FRONTEND_URL")]


def create_app() -> FastAPI:
    _app = FastAPI(lifespan=lifespan)
    _app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["DELETE"],
        allow_headers=["Authorization", "Access-Control-Allow-Origin"],
    )

    _app.include_router(api_router, prefix="/api/v1")

    return _app


app = create_app()
