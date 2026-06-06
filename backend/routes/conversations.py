from fastapi import APIRouter, Depends, HTTPException, Query, status
from pymongo.errors import PyMongoError

from dependencies.auth import get_current_user_email
from models.conversation import ConversationCreate, ConversationTitleUpdate
from services.conversation_service import (
    delete_conversation_for_user,
    get_conversation_for_user,
    list_conversations_for_user,
    save_conversation_for_user,
    update_conversation_title_for_user,
)


router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post("")
async def save_conversation(
    conversation: ConversationCreate,
    user_email: str = Depends(get_current_user_email),
):
    """Persist a conversation for the authenticated user."""
    try:
        return save_conversation_for_user(conversation, user_email)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("")
async def get_conversations(
    user_email: str = Depends(get_current_user_email),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=25, ge=1, le=50),
):
    """Return a paginated list of conversations for the authenticated user."""
    try:
        return list_conversations_for_user(user_email, skip, limit)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    user_email: str = Depends(get_current_user_email),
):
    """Return one conversation owned by the authenticated user."""
    try:
        conversation = get_conversation_for_user(conversation_id, user_email)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return conversation
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.patch("/{conversation_id}/title")
async def update_conversation_title(
    conversation_id: str,
    request: ConversationTitleUpdate,
    user_email: str = Depends(get_current_user_email),
):
    """Rename a conversation owned by the authenticated user."""
    try:
        result = update_conversation_title_for_user(conversation_id, request.title, user_email)
        if result["matched_count"] == 0:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return {
            "conversation_id": result["conversation_id"],
            "title": result["title"],
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: str,
    user_email: str = Depends(get_current_user_email),
):
    """Delete a conversation owned by the authenticated user."""
    try:
        deleted_count = delete_conversation_for_user(conversation_id, user_email)
        if deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )
        return None
    except HTTPException:
        raise
    except PyMongoError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the conversation: {str(error)}",
        )
