from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class Message(BaseModel):
    """A single chat message persisted with a conversation."""

    role: str
    content: str


class Conversation(BaseModel):
    """Serialized conversation document shape exposed by the API."""

    title: str
    description: str
    messages: List[Message]
    conversation_id: Optional[str] = None
    created_at: datetime


class ConversationCreate(BaseModel):
    """Request body used when creating or updating a conversation."""

    title: Optional[str] = None
    description: Optional[str] = None
    messages: List[dict]
    conversation_id: Optional[str] = None
    created_at: str


class ConversationTitleUpdate(BaseModel):
    """Request body for renaming an existing conversation."""

    title: str
