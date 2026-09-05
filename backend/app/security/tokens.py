import uuid
from datetime import datetime, timedelta, timezone

import jwt

from app.core.config import settings


def _secret() -> str:
    return settings.jwt_secret or "dev-secret-change-me"


def issue_token(user_id: int, session_id: str, expires_at: datetime) -> str:
    return jwt.encode(
        {
            "sub": str(user_id),
            "jti": session_id,
            "exp": expires_at,
        },
        _secret(),
        algorithm="HS256",
    )


def decode_token(token: str) -> dict:
    """Decode and validate a JWT. Raises jwt.PyJWTError on invalid/expired tokens."""
    return jwt.decode(token, _secret(), algorithms=["HS256"])


def new_session_id() -> str:
    return uuid.uuid4().hex


def expiry() -> datetime:
    return datetime.now(timezone.utc) + timedelta(hours=settings.jwt_expiry_hours)