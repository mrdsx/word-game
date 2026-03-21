from fastapi import FastAPI, status

from api.v1 import api_router
from core.settings import settings


def create_app() -> FastAPI:
    _app = FastAPI(**settings.fastapi_kwargs)
    _app.add_middleware(**settings.fastapi_middleware_kwargs)

    _app.include_router(api_router, prefix=settings.api_v1_prefix)

    @_app.get("/", status_code=status.HTTP_200_OK)
    async def root():
        return {
            "status": "ok",
        }

    return _app


app = create_app()
