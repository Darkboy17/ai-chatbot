from fastapi import APIRouter


router = APIRouter()


@router.get("/")
def welcome():
    """Return a lightweight API welcome response."""
    return {"message": "Welcome to the AI Chatbot API!"}
