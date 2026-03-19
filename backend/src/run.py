import os

if __name__ == "__main__":
    import uvicorn

    env = os.getenv("ENVIRONMENT", "dev")
    uvicorn.run(
        app="main:app",
        host="0.0.0.0" if env == "PROD" else "127.0.0.1",
        port=8000,
        reload=env == "dev",
    )
