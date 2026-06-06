from fastapi import FastAPI

from core.config import get_settings
from core.cors import configure_cors
from routes import auth, chat, conversations, health


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()
    app = FastAPI(title=settings.app_name)
    configure_cors(app, settings)
    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(chat.router)
    app.include_router(conversations.router)
    return app


app = create_app()
