# Primetrade - Scalable REST API with Auth & RBAC

A full-stack application featuring a secure FastAPI backend and a Next.js frontend, demonstrating JWT authentication, Role-Based Access Control (RBAC), and CRUD operations.

## Features

- **Backend**: FastAPI, SQLAlchemy (SQLite/Postgres), JWT, Passlib (Bcrypt).
- **Frontend**: Next.js 14, Tailwind CSS, Lucide React, Axios.
- **Security**: Password hashing, JWT token handling, RBAC (Admin/User).
- **Documentation**: Interactive Swagger UI at `/docs`.

## Project Structure

```
Primetrade/
├── backend/
│   ├── app/
│   │   ├── main.py          # Entry point
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── auth.py          # Auth logic
│   │   ├── database.py      # DB connection
│   │   └── routers/         # API routes
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── context/         # Auth context
│   │   └── lib/             # API client
│   └── package.json
└── SCALABILITY.md           # Scalability strategies
```

## Getting Started

### Backend Setup

1. Navigate to `backend/`
2. Create virtual environment: `python -m venv venv`
3. Activate venv: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `uvicorn app.main:app --reload`

### Frontend Setup

1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

## API Documentation

Once the backend is running, visit:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Scalability

See [SCALABILITY.md](./SCALABILITY.md) for detailed notes on scaling this architecture.
