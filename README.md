# Classic word game

Classic word game is cloud-based web game.

## Local setup

### Prerequisites

Required dependencies for each package before initial setup:

- Frontend: bun (package manager)
- Backend: uv (package manager)
- Firebase: docker + docker compose

### Frontend

Firstly, copy environment variables from `.env.dev` or `.env.prod` to `.env` file for development or production respectively. You must manually fill out variables with empty value.

Then run these commands:

```bash
bun i --frozen-lockfile
bun dev
```

### Backend

Firstly, copy environment variables from `.env.dev` or `.env.prod` to `.env` file for development or production respectively. You must manually fill out variables with empty value.

Then run these commands:

```bash
uv sync --frozen
uv run uvicorn src.main:app --reload
```