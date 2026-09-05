import threading

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import CodeChunk, File, Repo, User
from app.db.session import SessionLocal, get_db
from app.ingestion.pipeline import create_task, index_repo_async
from app.security.authorization import get_current_user

router = APIRouter(tags=["repositories"])


def _repo_out(repo: Repo) -> dict:
    return {
        "id": repo.id,
        "name": repo.name,
        "owner": repo.owner,
        "description": repo.description,
        "url": repo.url,
        "visibility": repo.visibility,
        "status": repo.status,
        "default_branch": repo.default_branch,
        "created_at": repo.created_at.isoformat() if repo.created_at else None,
    }


def _validate_url(repo_url: str) -> str:
    repo_url = repo_url.strip().rstrip("/")
    if not repo_url.startswith(("https://github.com/", "http://github.com/")):
        raise HTTPException(status_code=400, detail="must be a public GitHub repository URL")
    return repo_url


@router.get("/repositories")
async def list_repositories(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[dict]:
    stmt = select(Repo).order_by(Repo.id.desc())
    return [_repo_out(r) for r in db.execute(stmt).scalars()]


@router.post("/repositories")
async def create_repository(
    body: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict:
    repo_url = _validate_url(body.get("repo_url", ""))

    existing = db.execute(select(Repo).where(Repo.url == repo_url)).scalar_one_or_none()
    if existing:
        return {"repo": _repo_out(existing), "task_id": None}

    repo = Repo(url=repo_url, name=repo_url.rsplit("/", 1)[-1], status="pending", user_id=user.id)
    db.add(repo)
    db.commit()
    db.refresh(repo)

    task_id = create_task(repo_url)

    def _run():
        sdb = SessionLocal()
        try:
            index_repo_async(sdb, task_id, repo_url)
        finally:
            sdb.close()

    threading.Thread(target=_run, daemon=True).start()
    return {"repo": _repo_out(repo), "task_id": task_id}


@router.get("/repositories/{repo_id}")
async def get_repository(
    repo_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict:
    repo = db.get(Repo, repo_id)
    if repo is None:
        raise HTTPException(status_code=404, detail="repository not found")

    chunk_count = db.query(CodeChunk).filter(CodeChunk.repo_id == repo_id).count()
    file_count = db.query(File).filter(File.repo_id == repo_id).count()

    out = _repo_out(repo)
    out["stats"] = {"files": file_count, "chunks": chunk_count}
    return out


@router.get("/repositories/{repo_id}/files")
async def list_files(
    repo_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict:
    repo = db.get(Repo, repo_id)
    if repo is None:
        raise HTTPException(status_code=404, detail="repository not found")

    files = db.execute(
        select(File).where(File.repo_id == repo_id).order_by(File.path)
    ).scalars().all()

    return {"repo_id": repo_id, "tree": _build_tree([f.path for f in files])}


@router.get("/repositories/{repo_id}/files/content")
async def get_file_content(
    repo_id: int,
    path: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict:
    repo = db.get(Repo, repo_id)
    if repo is None:
        raise HTTPException(status_code=404, detail="repository not found")

    file = db.execute(
        select(File).where(File.repo_id == repo_id).where(File.path == path)
    ).scalar_one_or_none()
    if file is None:
        raise HTTPException(status_code=404, detail="file not found")

    return {
        "repo_id": repo_id,
        "path": file.path,
        "language": file.language,
        "content": file.content,
    }


def _build_tree(paths: list[str]) -> list[dict]:
    """Build a nested tree structure from a flat list of file paths."""
    root: dict = {"name": "", "type": "dir", "children": {}}
    for path in paths:
        parts = [p for p in path.split("/") if p]
        node = root
        for part in parts:
            node = node["children"].setdefault(part, {"name": part, "children": {}})
        node["type"] = "file"
        node.pop("children", None)

    def finalize(node: dict) -> dict:
        if node.get("type") == "file":
            return {"name": node["name"], "type": "file"}
        children = [finalize(c) for c in node["children"].values()]
        children.sort(key=lambda c: (c["type"] != "dir", c["name"]))
        return {"name": node["name"], "type": "dir", "children": children}

    return [finalize(c) for c in root["children"].values()]