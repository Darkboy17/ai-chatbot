from functools import lru_cache

from groq import Groq

from core.config import get_settings


@lru_cache
def get_groq_client() -> Groq:
    """Return a shared Groq client configured from environment variables."""
    settings = get_settings()
    return Groq(api_key=settings.groq_api_key)
