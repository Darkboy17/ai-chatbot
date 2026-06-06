from fastapi import APIRouter, HTTPException, status
from pymongo.errors import PyMongoError

from database.mongodb import users_collection
from models.auth import AuthRequest, TokenResponse
from services.auth_service import create_access_token, get_password_hash, verify_password


router = APIRouter(tags=["auth"])


@router.post("/signup")
async def signup(request: AuthRequest):
    """Create a new user account with a hashed password."""
    if users_collection.find_one({"email": request.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    try:
        users_collection.insert_one(
            {
                "email": request.email,
                "hashed_password": get_password_hash(request.password),
            }
        )
        return {"message": "User created successfully"}
    except PyMongoError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error during signup",
        )


@router.post("/login", response_model=TokenResponse)
async def login(request: AuthRequest):
    """Validate user credentials and return a bearer token."""
    user = users_collection.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=400, detail="Email not registered yet")

    if not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": user["email"]})
    return TokenResponse(access_token=access_token)
