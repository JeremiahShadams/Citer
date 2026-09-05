from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import ask, auth, evaluation, index, repositories, sessions

app = FastAPI(title="Codebase Q&A Agent", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(index.router, prefix="/api")
app.include_router(ask.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")
app.include_router(evaluation.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(repositories.router, prefix="/api")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}