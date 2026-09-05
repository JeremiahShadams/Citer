import httpx
import pytest

from app.security import github_oauth


def test_authorize_url_contains_client_id_and_redirect(monkeypatch):
    monkeypatch.setattr(github_oauth.settings, "github_client_id", "client-123")
    monkeypatch.setattr(github_oauth.settings, "github_redirect_uri", "http://localhost:8000/api/auth/github/callback")

    url = github_oauth.authorize_url("state-abc")
    assert url.startswith("https://github.com/login/oauth/authorize")
    assert "client_id=client-123" in url
    assert "state=state-abc" in url


def test_exchange_code_returns_token(monkeypatch):
    class FakeResponse:
        def raise_for_status(self):
            pass

        def json(self):
            return {"access_token": "gh-token"}

    monkeypatch.setattr(github_oauth.httpx, "post", lambda *a, **k: FakeResponse())
    assert github_oauth.exchange_code("code") == "gh-token"


def test_exchange_code_raises_on_missing_token(monkeypatch):
    class FakeResponse:
        def raise_for_status(self):
            pass

        def json(self):
            return {"error_description": "bad_verification_code"}

    monkeypatch.setattr(github_oauth.httpx, "post", lambda *a, **k: FakeResponse())
    with pytest.raises(RuntimeError, match="failed"):
        github_oauth.exchange_code("code")


def test_fetch_user_returns_profile(monkeypatch):
    class FakeResponse:
        def raise_for_status(self):
            pass

        def json(self):
            return {"id": 1, "login": "octocat", "name": "Octo Cat", "avatar_url": "http://x"}

    monkeypatch.setattr(github_oauth.httpx, "get", lambda *a, **k: FakeResponse())
    profile = github_oauth.fetch_user("token")
    assert profile["login"] == "octocat"
    assert profile["id"] == 1


def test_fetch_user_raises_on_error(monkeypatch):
    class FakeResponse:
        def raise_for_status(self):
            raise httpx.HTTPStatusError("bad", request=None, response=None)

    monkeypatch.setattr(github_oauth.httpx, "get", lambda *a, **k: FakeResponse())
    with pytest.raises(httpx.HTTPStatusError):
        github_oauth.fetch_user("token")