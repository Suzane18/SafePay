# SafePay Architecture

## Phase 1 boundaries

SafePay is split into an independently runnable React frontend and FastAPI backend. The backend exposes only a health endpoint in this phase. SQLite and SQLAlchemy are configured as infrastructure, but transaction models and persistence workflows are intentionally deferred.

## Request path

The frontend's typed API module targets `VITE_API_BASE_URL`. The FastAPI application mounts API routers under `/api`, configures development CORS, and reads settings from environment variables. The risk route calls `risk_service`, which loads synthetic successful transaction history and delegates deterministic scoring to `risk_engine.py`. Risk evaluation is read-only; only the later payment simulation route inserts a transaction.

## Planned expansion

Future phases may add AI-assisted explanations and more simulation analytics. No external AI or financial integration is part of the current prototype.
