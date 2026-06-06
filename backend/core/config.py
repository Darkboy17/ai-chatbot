import os
from functools import lru_cache
from pathlib import Path
from typing import List

from dotenv import load_dotenv


ENV_FILE = Path(__file__).resolve().parents[1] / ".env"

load_dotenv(dotenv_path=ENV_FILE, encoding="utf-8-sig")


class Settings:
    """Stores environment-backed application settings in one place."""

    def __init__(self) -> None:
        """Load required and optional settings from environment variables."""
        self.app_name = os.getenv("APP_NAME", "AI Chatbot API")
        self.groq_api_key = self._required("GROQ_API_KEY")
        self.jwt_secret_key = self._required("SECRET_KEY")
        self.jwt_algorithm = os.getenv("JWT_ALGORITHM", "HS256")
        self.access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "300"))
        self.mongodb_uri = self._required("MONGODB_URI")
        self.mongodb_database = os.getenv("MONGODB_DATABASE", "chatbot_db")
        self.allowed_origins = self._csv(
            "ALLOWED_ORIGINS",
            [
                "https://ai-chatbot-ikdbthdr5-darkboy17s-projects.vercel.app",
                "https://ai-chatbot-git-master-darkboy17s-projects.vercel.app",
                "https://ai-chatbot-eosin-three-35.vercel.app",
                "http://localhost:3000",
                "http://localhost:3001",
            ],
        )

    def _required(self, key: str) -> str:
        """Return a required environment value or fail during app startup."""
        value = os.getenv(key)
        if not value:
            raise ValueError(f"{key} is not set in the environment variables.")
        return value

    def _csv(self, key: str, default: List[str]) -> List[str]:
        """Parse a comma-separated setting with a typed default fallback."""
        value = os.getenv(key)
        if not value:
            return default
        return [item.strip() for item in value.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return cached settings so modules share one immutable configuration source."""
    return Settings()
