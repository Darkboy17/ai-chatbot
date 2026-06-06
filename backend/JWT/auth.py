from core.config import get_settings
from services.auth_service import (
    authenticate_user,
    create_access_token,
    decode_token,
    get_password_hash,
    verify_password,
)


settings = get_settings()
SECRET_KEY = settings.jwt_secret_key
ALGORITHM = settings.jwt_algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

__all__ = [
    "ACCESS_TOKEN_EXPIRE_MINUTES",
    "ALGORITHM",
    "SECRET_KEY",
    "authenticate_user",
    "create_access_token",
    "decode_token",
    "get_password_hash",
    "verify_password",
]
