import re


def strip_markdown_fences(text: str) -> str:
    """Remove optional Markdown code fences from a model JSON response."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    return cleaned.strip()


def clean_metadata_text(value: str, fallback: str, max_length: int) -> str:
    """Normalize generated metadata to a safe display string."""
    cleaned = re.sub(r"\s+", " ", (value or "")).strip().strip('"').strip("'")
    cleaned = cleaned.rstrip(".")
    if not cleaned:
        cleaned = fallback
    if len(cleaned) > max_length:
        cleaned = cleaned[:max_length].rsplit(" ", 1)[0].rstrip(" ,:-")
    return cleaned or fallback
