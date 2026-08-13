import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from seed import seed_database
from routers import meetings, transcripts, action_items
import models

# Create database tables on startup
Base.metadata.create_all(bind=engine)

# Auto-seed database if empty
db = SessionLocal()
try:
    if not db.query(models.Meeting).first():
        seed_database()
finally:
    db.close()

app = FastAPI(
    title="Fireflies.ai Clone API",
    description="Backend service for Fireflies clone",
    version="1.0.0"
)

# CORS middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(meetings.router)
app.include_router(transcripts.router)
app.include_router(action_items.router)

@app.get("/")
def root():
    return {"status": "running", "service": "Fireflies.ai Clone API"}
