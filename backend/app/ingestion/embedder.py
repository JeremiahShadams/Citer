from fastembed import TextEmbedding

from app.core.config import settings

BATCH_SIZE = 128
MAX_CHARS_PER_TEXT = 24000

_model: TextEmbedding | None = None


def _get_model() -> TextEmbedding:
    global _model
    if _model is None:
        _model = TextEmbedding(settings.embedding_model)
    return _model


def embed_texts(texts: list[str]) -> list[list[float]]:
    results: list[list[float]] = []
    for i in range(0, len(texts), BATCH_SIZE):
        batch = [_truncate(t) for t in texts[i : i + BATCH_SIZE]]
        results.extend([v.tolist() for v in _get_model().embed(batch)])
    return results


def embed_text(text: str) -> list[float]:
    return embed_texts([text])[0]


def _truncate(text: str) -> str:
    if len(text) <= MAX_CHARS_PER_TEXT:
        return text
    return text[:MAX_CHARS_PER_TEXT]
