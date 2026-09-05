from fastapi.testclient import TestClient

from app.db.models import AuthAccount, AuthSession, User
from app.main import app


def _token() -> str:
    client = TestClient(app)
    r = client.post("/api/auth/dev-login")
    assert r.status_code == 200
    return r.json()["token"]


def _cleanup(db_session):
    for model in (AuthAccount, AuthSession, User):
        db_session.query(model).delete()
    db_session.commit()


def test_dev_login_returns_token(db_session):
    _cleanup(db_session)
    r = TestClient(app).post("/api/auth/dev-login")
    assert r.status_code == 200
    body = r.json()
    assert body["token"]
    assert body["user"]["email"] == "dev@local.codebase-intelligence"


def test_me_returns_user_with_valid_token(db_session):
    _cleanup(db_session)
    token = _token()
    r = TestClient(app).get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["email"] == "dev@local.codebase-intelligence"


def test_me_rejects_missing_token(db_session):
    r = TestClient(app).get("/api/auth/me")
    assert r.status_code == 401


def test_me_rejects_invalid_token(db_session):
    r = TestClient(app).get("/api/auth/me", headers={"Authorization": "Bearer not-a-jwt"})
    assert r.status_code == 401


def test_logout_revokes_session(db_session):
    _cleanup(db_session)
    client = TestClient(app)
    token = _token()
    r = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200

    r2 = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r2.status_code == 401


def test_github_login_redirects_or_errors(db_session):
    client = TestClient(app)
    r = client.get("/api/auth/github/login", follow_redirects=False)
    # without client_id configured it returns 503; with it, 307 to github
    assert r.status_code in (307, 503)