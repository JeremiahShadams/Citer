import secrets

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models import User
from app.db.session import get_db
from app.security.authorization import _bearer_token, get_current_user
from app.security.github_oauth import authorize_url, exchange_code, fetch_user
from app.security.tokens import decode_token
from app.services.auth_service import (
    create_dev_user,
    create_session,
    revoke_session,
    upsert_user_from_github,
)

router = APIRouter(tags=["auth"])


def _frontend_callback_url(token: str) -> str:
    return f"{settings.frontend_url}/callback?token={token}"


@router.get("/auth/github/login")
async def github_login() -> RedirectResponse:
    if not settings.github_client_id:
        raise HTTPException(status_code=503, detail="GitHub OAuth not configured")
    state = secrets.token_urlsafe(16)
    return RedirectResponse(url=authorize_url(state))


@router.get("/auth/github/callback")
async def github_callback(code: str, db: Session = Depends(get_db)) -> RedirectResponse:
    if not code:
        raise HTTPException(status_code=400, detail="missing code")
    try:
        access_token = exchange_code(code)
        profile = fetch_user(access_token)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"github oauth failed: {exc}")

    user = upsert_user_from_github(db, profile)
    _, token = create_session(db, user)
    return RedirectResponse(url=_frontend_callback_url(token))


@router.post("/auth/dev-login")
async def dev_login(db: Session = Depends(get_db)) -> dict:
    """Local-only login for development (no OAuth credentials required)."""
    user = create_dev_user(db)
    _, token = create_session(db, user)
    return {"token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}


@router.get("/auth/me")
async def me(user: User = Depends(get_current_user)) -> dict:
    return {"id": user.id, "name": user.name, "email": user.email, "avatar_url": user.avatar_url}


@router.post("/auth/logout")
async def logout(
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict:
    token = _bearer_token(request)
    if token:
        payload = decode_token(token)
        session_id = payload.get("jti")
        if session_id:
            revoke_session(db, session_id)
    return {"status": "logged_out"}