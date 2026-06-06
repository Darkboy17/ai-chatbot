from typing import List, Optional

from pydantic import BaseModel


class ChatRequest(BaseModel):
    """Request body for standard and streaming chat completions."""

    user_input: str
    conversation_id: Optional[str] = None
    messages: Optional[List[dict]] = None


class ChatResponse(BaseModel):
    """Response body for non-streaming chat completions."""

    assistant_response: str
