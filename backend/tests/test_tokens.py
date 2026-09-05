from datetime import datetime, timedelta, timezone

import jwt as pyjwt
import pytest

from app.security import tokens


def test_issue_and_decode_roundtrip(monkeypatch):
    monkeypatch.setattr(tokens.settings, "jwt_secret", "test-secret")
    expires = datetime.now(timezone.utc) + timedelta(hours=1)
    token = tokens.issue_token(42, "session-abc", expires)
    payload = tokens.decode_token(token)
    assert payload["sub"] == "42"
    assert payload["jti"] == "session-abc"


def test_decode_rejects_tampered_token(monkeypatch):
    monkeypatch.setattr(tokens.settings, "jwt_secret", "test-secret")
    expires = datetime.now(timezone.utc) + timedelta(hours=1)
    token = tokens.issue_token(1, "s", expires)
    with pytest.raises(pyjwt.InvalidSignatureError):
        tokens.decode_token(token[:-1] + ("A" if token[-1] != "A" else "B"))


def test_decode_rejects_expired_token(monkeypatch):
    monkeypatch.setattr(tokens.settings, "jwt_secret", "test-secret")
    expires = datetime.now(timezone.utc) - timedelta(hours=1)
    token = tokens.issue_token(1, "s", expires)
    with pytest.raises(pyjwt.ExpiredSignatureError):
        tokens.decode_token(token)


def test_decode_rejects_wrong_secret(monkeypatch):
    monkeypatch.setattr(tokens.settings, "jwt_secret", "secret-a")
    token = tokens.issue_token(1, "s", datetime.now(timezone.utc) + timedelta(hours=1))
    monkeypatch.setattr(tokens.settings, "jwt_secret", "secret-b")
    with pytest.raises(pyjwt.InvalidSignatureError):
        tokens.decode_token(token)


def test_new_session_id_is_unique():
    assert tokens.new_session_id() != tokens.new_session_id()


def test_expiry_is_in_future():
    assert tokens.expiry() > datetime.now(timezone.utc)