from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from src.api.v1 import api_router
from src.core.lifespan import lifespan
from src.core.settings import get_settings

settings = get_settings()


def create_app() -> FastAPI:
    _app = FastAPI(lifespan=lifespan)
    _app.add_middleware(
        middleware_class=CORSMiddleware,
        allow_origins=[settings.frontend_url],
        allow_credentials=True,
        allow_methods=["GET", "DELETE"],
        allow_headers=["Authorization", "Access-Control-Allow-Origin"],
    )

    _app.include_router(api_router)

    @_app.get("/", status_code=status.HTTP_200_OK)
    async def root():  # pyright: ignore[reportUnusedFunction]
        return {"status": "ok"}

    return _app


app = create_app()
