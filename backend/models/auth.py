from pydantic import BaseModel


class AuthRequest(BaseModel):
    """Request body for signup and login endpoints."""

    email: str
    password: str


class TokenResponse(BaseModel):
    """Response body returned after successful authentication."""

    access_token: str
    token_type: str = "bearer"
