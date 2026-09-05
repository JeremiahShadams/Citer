from app.db.models import AuthAccount, AuthSession, User
from app.services import auth_service


def _cleanup(db):
    for model in (AuthAccount, AuthSession, User):
        db.query(model).delete()
    db.commit()


def test_upsert_user_creates_new_user(db_session):
    _cleanup(db_session)
    profile = {"id": 1001, "login": "octocat", "name": "Octo Cat", "email": "octo@example.com", "avatar_url": "http://a"}
    user = auth_service.upsert_user_from_github(db_session, profile)
    assert user.id is not None
    assert user.email == "octo@example.com"
    account = db_session.query(AuthAccount).filter(AuthAccount.provider == "github").one()
    assert account.provider_account_id == "1001"
    assert account.user_id == user.id


def test_upsert_user_is_idempotent(db_session):
    _cleanup(db_session)
    profile = {"id": 2002, "login": "jane", "name": "Jane", "email": "jane@example.com"}
    first = auth_service.upsert_user_from_github(db_session, profile)
    second = auth_service.upsert_user_from_github(db_session, profile)
    assert first.id == second.id
    assert db_session.query(AuthAccount).count() == 1


def test_create_dev_user_is_idempotent(db_session):
    _cleanup(db_session)
    u1 = auth_service.create_dev_user(db_session)
    u2 = auth_service.create_dev_user(db_session)
    assert u1.id == u2.id
    assert u1.email == "dev@local.codebase-intelligence"


def test_create_and_revoke_session(db_session):
    _cleanup(db_session)
    user = auth_service.create_dev_user(db_session)
    session_id, token = auth_service.create_session(db_session, user)
    assert token
    assert db_session.get(AuthSession, session_id) is not None

    auth_service.revoke_session(db_session, session_id)
    assert db_session.get(AuthSession, session_id) is None