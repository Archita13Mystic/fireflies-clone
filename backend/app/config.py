import os

class Settings:
    PROJECT_NAME: str = "Fireflies.ai Clone API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./fireflies.db")
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.onrender.com",
        "*"
    ]

settings = Settings()
