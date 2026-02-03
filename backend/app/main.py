from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth_router, task_router

# Create Tables (In production use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Primetrade API",
    description="Scalable REST API with Auth & RBAC",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API v1 Versioning
api_v1_prefix = "/api/v1"

app.include_router(auth_router.router, prefix=api_v1_prefix)
app.include_router(task_router.router, prefix=api_v1_prefix)

@app.get("/")
async def root():
    return {"message": "Welcome to Primetrade API. Visit /docs for Swagger UI."}
