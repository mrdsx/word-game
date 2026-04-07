from core.settings import get_settings

settings = get_settings()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        **settings.uvicorn_kwargs,
    )
