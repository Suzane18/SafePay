# SafePay

SafePay is a hackathon prototype for a payment safety companion. Before a simulated payment completes, it evaluates personalized transaction signals, provides a LOW, MEDIUM, or HIGH risk level, and explains unusual activity in simple language.

This project is a simulation only. It does not connect to bank accounts, UPI networks, payment gateways, real financial APIs, or process real money.

## Architecture

- `frontend/`: React, Vite, TypeScript, and Tailwind CSS application.
- `backend/`: FastAPI application with environment configuration, CORS, SQLAlchemy, and SQLite infrastructure.
- `data/`: Local development data location. The SQLite file is ignored and recreated by the seed command.
- `docs/`: Architecture notes and project decisions.

The backend exposes health, user, recipient, transaction, simulated payment, and deterministic risk evaluation endpoints. See [docs/architecture.md](docs/architecture.md) for the service boundaries.

## Technology Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Python 3.11+, FastAPI, Uvicorn
- Database: SQLite, SQLAlchemy

## Local Setup

Prerequisites: Node.js 20+, npm, Python 3.11+, and pip.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

The frontend reads `VITE_API_BASE_URL` from `frontend/.env`. For local development, copy `frontend/.env.example` to `frontend/.env` if you need to override the default `http://localhost:8000/api`.

### Backend and Database

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:PYTHONPATH = (Get-Location).Path
python -m app.database.init_db
python -m uvicorn app.main:app --reload --port 8000
```

The seed command creates the SQLite tables and synthetic demo data in `data/safepay.db`. The API is available at `http://localhost:8000`; health check: `http://localhost:8000/api/health`.

The backend reads `APP_NAME`, `APP_ENV`, `DATABASE_URL`, and `CORS_ORIGINS` from `backend/.env`. Copy `backend/.env.example` to `backend/.env` to customize them. No secrets are required for the local prototype.

Run the backend tests from `backend/`:

```powershell
pytest
```

### Docker Compose

Copy `backend/.env.example` to `backend/.env`, then run from the repository root:

```powershell
docker compose up --build
```

Compose is supplied as a development structure only.

## Current Phase 4 Scope

- SQLite and SQLAlchemy User, Recipient, and Transaction models.
- Deterministic synthetic seed data with repeated-recipient history and an unusual Rahul Sharma transaction.
- Service-owned user, recipient, transaction, and simulated-payment APIs.
- Typed frontend API services connected to the existing Phase 2 screens.
- Loading, error, empty, and simulated-payment success states.
- Phase 2 mobile payment UI and SafePay AI Check placeholder preserved.
- Deterministic, explainable risk evaluation before simulated payment creation.
- Risk signals for new recipients, amount anomalies, payment bursts, duplicates, and first-time large payments.
- Transparent weighted scoring with LOW, MEDIUM, and HIGH levels.

### Current risk engine

The risk engine is deterministic and explainable. It compares a proposed payment with successful historical payments for the recipient and user, and checks recipient novelty, payment bursts, recent duplicates, and first-time large payments. Scores are weighted, capped at 100, and mapped to `PROCEED`, `REVIEW`, or `VERIFY_RECIPIENT`. Risk evaluation is read-only; the simulated payment is created only after the user continues.

### Demo scenarios

- LOW: Rahul Sharma, ₹800, an established recipient and typical amount.
- MEDIUM: Demo Merchant, ₹500, a first-time recipient.
- HIGH: Rahul Sharma, ₹25,000, substantially above the usual amount.
- HIGH: Repeat the same recipient and amount within five minutes for a duplicate warning.
- HIGH: Demo Merchant, ₹25,000, a first-time large payment.

## Limitations and future phases

Current data and payments are synthetic. There is no authentication, real UPI, real payment processing, bank integration, external financial API, or production fraud blocking. A machine-learning model, dataset, Sarvam AI, and other AI-assisted explanation systems are not implemented and are reserved for future phases.

## Future Phases

1. Add AI-assisted explanation enhancement without replacing deterministic scoring.
2. Expand simulated payment and user decision analytics.
3. Add observability and deployment preparation.

Do not proceed beyond Phase 4 without an explicit project decision.
