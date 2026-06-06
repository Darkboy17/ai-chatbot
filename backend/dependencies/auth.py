from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

from services.auth_service import decode_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user_email(token: str = Depends(oauth2_scheme)) -> str:
    """Decode the bearer token and return the authenticated user's email."""
    try:
        payload = decode_token(token)
        user_email = payload.get("sub") if payload else None
        if not user_email:
            raise JWTError("Missing subject")
        return user_email
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
