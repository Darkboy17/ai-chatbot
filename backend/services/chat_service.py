from typing import List, Optional

from database.mongodb import chats_collection
from models.chat import ChatRequest
from services.groq_service import get_groq_client


MODEL_NAME = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = {
    "content": r"""
You are a helpful AI assistant that writes clear, accurate, well-structured responses in Markdown.

Your output must be valid Markdown and must render correctly in Markdown viewers that support:
- GitHub-style Markdown
- LaTeX math using `$...$` and `$$...$$`

Use normal Markdown, valid LaTeX math, closed code fences, and readable prose. Never output malformed math notation or duplicate formulas in broken alternate formats.
"""
}


def load_chat_history(conversation_id: Optional[str], user_email: str) -> List[dict]:
    """Load persisted messages for a user's existing conversation."""
    if not conversation_id:
        return []

    conversation = chats_collection.find_one(
        {
            "conversation_id": conversation_id,
            "user_email": user_email,
        }
    )
    return conversation.get("messages", []) if conversation else []


def get_chat_history_for_request(request: ChatRequest, user_email: str) -> List[dict]:
    """Build the model-ready chat history from request messages or storage."""
    if request.messages:
        chat_history = [
            {
                "role": message.get("role"),
                "content": message.get("content"),
            }
            for message in request.messages
            if message.get("role") in {"user", "assistant"} and message.get("content")
        ]
    else:
        chat_history = load_chat_history(request.conversation_id, user_email)

    if (
        not chat_history
        or chat_history[-1].get("role") != "user"
        or chat_history[-1].get("content") != request.user_input
    ):
        chat_history.append({"role": "user", "content": request.user_input})

    return chat_history


def create_chat_completion(messages: List[dict]):
    """Request a non-streaming completion from the configured Groq model."""
    return get_groq_client().chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        temperature=1.2,
    )


def create_streaming_chat_completion(messages: List[dict]):
    """Request a streaming completion from the configured Groq model."""
    return get_groq_client().chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        temperature=1.2,
        stream=True,
    )
