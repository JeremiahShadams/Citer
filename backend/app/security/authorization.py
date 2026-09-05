from datetime import datetime, timezone

import jwt
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.db.models import AuthSession, User
from app.db.session import get_db
from app.security.tokens import decode_token


def _bearer_token(request: Request) -> str | None:
    header = request.headers.get("Authorization", "")
    if header.lower().startswith("bearer "):
        return header[7:].strip()
    return None


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    token = _bearer_token(request)
    if token is None:
        raise HTTPException(status_code=401, detail="missing authorization token")

    try:
        payload = decode_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="invalid token")

    session_id = payload.get("jti")
    user_id = payload.get("sub")
    if not session_id or not user_id:
        raise HTTPException(status_code=401, detail="invalid token payload")

    session = db.get(AuthSession, session_id)
    if session is None:
        raise HTTPException(status_code=401, detail="session revoked")

    if session.expires_at.tzinfo is None:
        session.expires_at = session.expires_at.replace(tzinfo=timezone.utc)
    if session.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="session expired")

    user = db.get(User, int(user_id))
    if user is None:
        raise HTTPException(status_code=401, detail="user not found")
    return user