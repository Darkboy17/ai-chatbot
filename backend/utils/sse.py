import json
from typing import Optional


def format_sse(data: dict, event: Optional[str] = None) -> str:
    """Serialize a payload into a Server-Sent Events message block."""
    message = ""
    if event:
        message += f"event: {event}\n"
    message += f"data: {json.dumps(data)}\n\n"
    return message
