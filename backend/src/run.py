from core.settings import settings

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        **settings.uvicorn_kwargs,
    )
