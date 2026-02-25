# demo-test01

## Overview
This repo contains:

- `backend/`: Node.js (TypeScript) API server
- `frontend/`: Angular source code
- `web/`: Built frontend assets + Nginx config

For Docker (single-container mode), the backend container builds the frontend and serves it as static files.

## Run with Docker (single container)

### Prerequisites

- Docker Desktop
- A reachable MongoDB instance (because backend connects on startup)

### Environment variables

Backend requires these environment variables:

- `MONGODB_URI` (required)
- `JWT_SECRET` (required)
- `JWT_EXPIRES_IN` (optional, default `7d`)
- `CORS_ORIGIN` (optional, default `http://localhost:4200`)
- `PORT` (optional, default `3001`)

You can copy from `backend/.env.example` and create `backend/.env`.

### Build image

Run from the repo root:

```bash
docker build -f backend/Dockerfile -t demo-app .
```

### Run container

Run from the repo root:

```bash
docker run --rm --name demo-app -p 3001:3001 --env-file backend/.env demo-app
```

If you want to expose it on a different port (example: host `8080` -> container `3001`):

```bash
docker run --rm --name demo-app -p 8080:3001 --env-file backend/.env demo-app
```

### URLs

- Web (Angular SPA): `http://localhost:3001/`
- Health check: `http://localhost:3001/health`
- API base paths:
  - `http://localhost:3001/api/auth/...`
  - `http://localhost:3001/api/profile/...`

### Troubleshooting

- If `docker build` fails with `docker daemon is not running` / `open //./pipe/docker_engine`:
  - Start Docker Desktop and wait until it shows "Docker Desktop is running"
  - Then re-run the `docker build ...` command

- If the container exits immediately with `Missing env: ...`:
  - Add the missing variable(s) to `backend/.env`

- If the container fails to start because it cannot connect to MongoDB:
  - Verify `MONGODB_URI` is correct and reachable from your machine
