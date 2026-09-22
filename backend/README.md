# Backend — DocVerify API

FastAPI backend for the AI Document Verification & Hallucination Repair system.

## Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Test

```bash
python -m pytest tests/ -v
```

## Architecture

```
app/
├── api/          # HTTP routes
├── core/         # Config, database, logging
├── models/       # SQLAlchemy ORM models
├── schemas/      # Pydantic request/response schemas
├── services/     # Business logic
└── repositories/ # Data access layer
```
