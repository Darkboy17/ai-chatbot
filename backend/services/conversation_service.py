import json
from datetime import datetime
from typing import List

from bson import ObjectId

from database.mongodb import chats_collection
from models.conversation import ConversationCreate
from services.chat_service import MODEL_NAME
from services.groq_service import get_groq_client
from utils.text import clean_metadata_text, strip_markdown_fences


def get_meaningful_messages(messages: List[dict]) -> List[dict]:
    """Return only user and assistant messages with non-empty content."""
    return [
        message
        for message in messages
        if message.get("role") in {"user", "assistant"} and message.get("content")
    ]


def build_fallback_metadata(messages: List[dict]) -> dict:
    """Create deterministic conversation metadata when model generation fails."""
    meaningful_messages = get_meaningful_messages(messages)
    user_messages = [
        message.get("content", "").strip()
        for message in meaningful_messages
        if message.get("role") == "user"
    ]
    assistant_messages = [
        message.get("content", "").strip()
        for message in meaningful_messages
        if message.get("role") == "assistant"
    ]
    title_source = next((content for content in user_messages if len(content) > 8), "")
    description_source = " ".join(user_messages[:2]) or next(
        (content for content in assistant_messages if len(content) > 8),
        "",
    )
    return {
        "title": clean_metadata_text(title_source, "New Conversation", 70),
        "description": clean_metadata_text(description_source, "Saved chat conversation", 120),
    }


def generate_conversation_metadata(messages: List[dict]) -> dict:
    """Ask the model for concise sidebar metadata with a deterministic fallback."""
    fallback = build_fallback_metadata(messages)
    meaningful_messages = get_meaningful_messages(messages)
    if not meaningful_messages:
        return fallback

    context = "\n".join(
        f"{message.get('role', 'message').title()}: {message.get('content', '')[:900]}"
        for message in meaningful_messages[-10:]
    )

    try:
        response = get_groq_client().chat.completions.create(
            model=MODEL_NAME,
            temperature=0.2,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Create concise metadata for a chat history sidebar. "
                        "Use the whole conversation context, not just the first line. "
                        "Return JSON only with keys title and description. "
                        "The title must be 3 to 7 words, specific, and subject-like. "
                        "The description must be one short sentence under 18 words. "
                        "Avoid generic titles like 'New Conversation', 'Chat Summary', or 'AI Conversation'."
                    ),
                },
                {"role": "user", "content": f"Conversation:\n{context}"},
            ],
        )
        metadata = json.loads(strip_markdown_fences(response.choices[0].message.content))
        return {
            "title": clean_metadata_text(metadata.get("title"), fallback["title"], 70),
            "description": clean_metadata_text(
                metadata.get("description"),
                fallback["description"],
                120,
            ),
        }
    except Exception:
        return fallback


def get_conversation_matchers(conversation_id: str) -> List[dict]:
    """Build lookup clauses for custom conversation IDs and legacy ObjectIds."""
    conversation_matchers = [{"conversation_id": conversation_id}]
    if ObjectId.is_valid(conversation_id):
        conversation_matchers.append({"_id": ObjectId(conversation_id)})
    return conversation_matchers


def save_conversation_for_user(conversation: ConversationCreate, user_email: str) -> dict:
    """Create or update a user's conversation and return display metadata."""
    existing_conversation = chats_collection.find_one(
        {
            "conversation_id": conversation.conversation_id,
            "user_email": user_email,
        }
    )
    metadata = generate_conversation_metadata(conversation.messages)
    title = metadata["title"]

    if existing_conversation and existing_conversation.get("is_title_custom"):
        title = existing_conversation.get("title") or title

    conversation_doc = {
        "user_email": user_email,
        "title": title,
        "description": metadata["description"],
        "messages": conversation.messages,
        "created_at": datetime.fromisoformat(conversation.created_at.replace("Z", "+00:00")),
        "conversation_id": conversation.conversation_id,
        "is_title_custom": bool(existing_conversation and existing_conversation.get("is_title_custom")),
    }
    chats_collection.update_one(
        {
            "conversation_id": conversation.conversation_id,
            "user_email": user_email,
        },
        {"$set": conversation_doc},
        upsert=True,
    )
    return {
        "message": "Conversation saved successfully",
        "conversation_id": conversation.conversation_id,
        "title": title,
        "description": metadata["description"],
    }


def list_conversations_for_user(user_email: str, skip: int, limit: int) -> dict:
    """Return a paginated, newest-first list of a user's saved conversations."""
    query = {"user_email": user_email}
    conversations = list(
        chats_collection.find(
            query,
            {
                "title": 1,
                "description": 1,
                "created_at": 1,
                "conversation_id": 1,
                "_id": 1,
                "messages": 1,
            },
        )
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )

    for conversation in conversations:
        conversation["_id"] = str(conversation["_id"])
        if not conversation.get("conversation_id"):
            conversation["conversation_id"] = conversation["_id"]

    total = chats_collection.count_documents(query)
    return {
        "items": conversations,
        "next_skip": skip + len(conversations),
        "has_more": skip + len(conversations) < total,
        "total": total,
    }


def get_conversation_for_user(conversation_id: str, user_email: str) -> dict:
    """Fetch one conversation owned by a user or return None."""
    conversation = chats_collection.find_one(
        {
            "$or": get_conversation_matchers(conversation_id),
            "user_email": user_email,
        }
    )
    if conversation:
        conversation["_id"] = str(conversation["_id"])
    return conversation


def update_conversation_title_for_user(conversation_id: str, title: str, user_email: str) -> dict:
    """Rename a user's conversation and mark the title as custom."""
    cleaned_title = clean_metadata_text(title, "Untitled Chat", 70)
    result = chats_collection.update_one(
        {
            "$or": get_conversation_matchers(conversation_id),
            "user_email": user_email,
        },
        {
            "$set": {
                "title": cleaned_title,
                "is_title_custom": True,
            }
        },
    )
    return {
        "matched_count": result.matched_count,
        "conversation_id": conversation_id,
        "title": cleaned_title,
    }


def delete_conversation_for_user(conversation_id: str, user_email: str) -> int:
    """Delete a user's conversation and return the deleted document count."""
    result = chats_collection.delete_one(
        {
            "$or": get_conversation_matchers(conversation_id),
            "user_email": user_email,
        }
    )
    return result.deleted_count
