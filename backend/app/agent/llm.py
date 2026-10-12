from langchain_core.messages import BaseMessage
from langchain_groq import ChatGroq

from app.core.config import settings


def get_chat_model(temperature: float = 0.0) -> ChatGroq:
    """Return the chat model used by the agent. Requires GROQ_API_KEY."""
    if not settings.groq_api_key:
        raise RuntimeError("GROQ_API_KEY is not set; add it to .env before running the agent")
    return ChatGroq(model=settings.groq_model, temperature=temperature, api_key=settings.groq_api_key)


def format_history(messages: list[dict]) -> str:
    """Render prior turns (list of {role, content}) as readable text for prompts."""
    lines = []
    for msg in messages[-6:]:
        role = "User" if msg.get("role") == "user" else "Assistant"
        lines.append(f"{role}: {msg.get('content', '')}")
    return "\n".join(lines)


def messages_from_text(system: str, human: str) -> list[BaseMessage]:
    from langchain_core.messages import HumanMessage, SystemMessage

    return [SystemMessage(content=system), HumanMessage(content=human)]