from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import AuthAccount, AuthSession, User
from app.security.tokens import expiry, issue_token, new_session_id


def upsert_user_from_github(db: Session, profile: dict) -> User:
    """Find or create the user + GitHub account link from an OAuth profile."""
    provider_id = str(profile["id"])

    account = db.execute(
        select(AuthAccount).where(
            AuthAccount.provider == "github",
            AuthAccount.provider_account_id == provider_id,
        )
    ).scalar_one_or_none()

    if account:
        return db.get(User, account.user_id)

    email = profile.get("email")
    user = None
    if email:
        user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()

    if user is None:
        user = User(
            email=email,
            name=profile.get("name") or profile.get("login"),
            avatar_url=profile.get("avatar_url"),
        )
        db.add(user)
        db.flush()

    db.add(AuthAccount(user_id=user.id, provider="github", provider_account_id=provider_id))
    db.commit()
    db.refresh(user)
    return user


def create_dev_user(db: Session) -> User:
    """Create (or return) the local development user - no OAuth required."""
    email = "dev@local.codebase-intelligence"
    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if user is None:
        user = User(email=email, name="Local Developer")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def create_session(db: Session, user: User) -> tuple[str, str]:
    """Create an auth session row and return (session_id, jwt)."""
    session_id = new_session_id()
    expires = expiry()
    db.add(AuthSession(id=session_id, user_id=user.id, expires_at=expires))
    db.commit()
    token = issue_token(user.id, session_id, expires)
    return session_id, token


def revoke_session(db: Session, session_id: str) -> None:
    db.execute(
        AuthSession.__table__.delete().where(AuthSession.id == session_id)
    )
    db.commit()