from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from dependencies.auth import get_current_user_email
from models.chat import ChatRequest, ChatResponse
from services.chat_service import (
    create_chat_completion,
    create_streaming_chat_completion,
    get_chat_history_for_request,
)
from utils.sse import format_sse


router = APIRouter(tags=["chat"])


@router.post("/ask", response_model=ChatResponse)
async def ask(request: ChatRequest, user_email: str = Depends(get_current_user_email)):
    """Return a complete assistant response for a chat request."""
    try:
        chat_history = get_chat_history_for_request(request, user_email)
        response = create_chat_completion(chat_history)
        assistant_message = {
            "role": "assistant",
            "content": response.choices[0].message.content,
        }
        return ChatResponse(assistant_response=assistant_message["content"])
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/ask/stream")
async def ask_stream(request: ChatRequest, user_email: str = Depends(get_current_user_email)):
    """Stream assistant response chunks as Server-Sent Events."""
    try:
        chat_history = get_chat_history_for_request(request, user_email)

        def stream_response():
            """Yield SSE chunks until the model response completes or errors."""
            assistant_response = ""
            try:
                response_stream = create_streaming_chat_completion(chat_history)
                for chunk in response_stream:
                    if not chunk.choices:
                        continue

                    content = getattr(chunk.choices[0].delta, "content", None)
                    if not content:
                        continue

                    assistant_response += content
                    yield format_sse({"content": content})

                yield format_sse({"assistant_response": assistant_response}, event="done")
            except Exception as error:
                yield format_sse({"detail": str(error)}, event="error")

        return StreamingResponse(
            stream_response(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
