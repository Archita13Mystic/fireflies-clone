import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base
from app.seed import seed_database
from app.routers import meetings, transcripts, action_items, chat, exports

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed database with sample data
try:
    seed_database()
except Exception as e:
    print(f"Database seed notice: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Fireflies.ai Clone Backend API with SQLite persistence, interactive transcripts, and AI assistant.",
    version="1.0.0"
)

# CORS configuration for local development and Render deployment
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(meetings.router)
app.include_router(transcripts.router)
app.include_router(action_items.router)
app.include_router(chat.router)
app.include_router(exports.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "docs": "/docs",
        "endpoints": [
            "/api/meetings",
            "/api/meetings/stats",
            "/api/transcripts/search",
            "/api/transcripts/upload"
        ]
    }
