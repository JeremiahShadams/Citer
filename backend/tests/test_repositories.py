from fastapi.testclient import TestClient

from app.api.routes import repositories
from app.db.models import CodeChunk, File, Message, Repo, Session as SessionModel, User
from app.main import app
from tests.conftest import fake_embed

REPO_URL = "https://github.com/test/demo"


def _token() -> str:
    return TestClient(app).post("/api/auth/dev-login").json()["token"]


def _cleanup(db):
    for model in (Message, SessionModel, CodeChunk, File, Repo, User):
        db.query(model).delete()
    db.commit()


def test_repositories_require_auth(db_session):
    r = TestClient(app).get("/api/repositories")
    assert r.status_code == 401


def test_build_tree_nests_paths():
    tree = repositories._build_tree(["src/auth/login.py", "src/auth/__init__.py", "README.md"])
    names = [n["name"] for n in tree]
    assert "README.md" in names
    src = next(n for n in tree if n["name"] == "src")
    assert src["type"] == "dir"
    auth = next(n for n in src["children"] if n["name"] == "auth")
    assert {f["name"] for f in auth["children"]} == {"login.py", "__init__.py"}


def test_create_and_list_repository(db_session, monkeypatch):
    _cleanup(db_session)
    monkeypatch.setattr(repositories, "create_task", lambda url: "test-task")
    monkeypatch.setattr(repositories, "index_repo_async", lambda db, task, url: None)

    client = TestClient(app)
    headers = {"Authorization": f"Bearer {_token()}"}

    r = client.post("/api/repositories", json={"repo_url": REPO_URL}, headers=headers)
    assert r.status_code == 200
    assert r.json()["repo"]["name"] == "demo"
    assert r.json()["task_id"] == "test-task"

    r2 = client.get("/api/repositories", headers=headers)
    assert r2.status_code == 200
    assert any(repo["url"] == REPO_URL for repo in r2.json())


def test_get_repository_with_stats(db_session, monkeypatch):
    _cleanup(db_session)
    repo = Repo(url=REPO_URL, name="demo", status="ready", owner="test")
    db_session.add(repo)
    db_session.flush()
    db_session.add(File(repo_id=repo.id, path="src/a.py", language="py", content="def a(): pass"))
    db_session.add(CodeChunk(repo_id=repo.id, file_path="src/a.py", symbol_name="a", start_line=1,
                             end_line=1, language="py", content="def a(): pass", embedding=fake_embed("x")))
    db_session.commit()

    r = TestClient(app).get(f"/api/repositories/{repo.id}", headers={"Authorization": f"Bearer {_token()}"})
    assert r.status_code == 200
    assert r.json()["stats"] == {"files": 1, "chunks": 1}


def test_list_files_and_content(db_session):
    _cleanup(db_session)
    repo = Repo(url=REPO_URL, name="demo", status="ready")
    db_session.add(repo)
    db_session.flush()
    db_session.add(File(repo_id=repo.id, path="src/auth/login.py", language="py", content="def login():\n    return 1"))
    db_session.commit()

    client = TestClient(app)
    headers = {"Authorization": f"Bearer {_token()}"}

    r = client.get(f"/api/repositories/{repo.id}/files", headers=headers)
    assert r.status_code == 200
    assert r.json()["tree"][0]["name"] == "src"

    c = client.get(f"/api/repositories/{repo.id}/files/content", params={"path": "src/auth/login.py"}, headers=headers)
    assert c.status_code == 200
    assert "def login():" in c.json()["content"]


def test_file_content_404_unknown_path(db_session):
    _cleanup(db_session)
    repo = Repo(url=REPO_URL, name="demo", status="ready")
    db_session.add(repo)
    db_session.commit()

    client = TestClient(app)
    headers = {"Authorization": f"Bearer {_token()}"}
    r = client.get(f"/api/repositories/{repo.id}/files/content", params={"path": "nope.py"}, headers=headers)
    assert r.status_code == 404