from types import SimpleNamespace

import pytest

from app.ingestion import embedder


class FakeModel:
    def __init__(self, dim: int):
        self.dim = dim
        self.calls: list[list[str]] = []

    def embed(self, texts):
        self.calls.append(list(texts))
        for _ in texts:
            vec = [0.1] * self.dim
            yield SimpleNamespace(tolist=lambda v=vec: v)


@pytest.fixture(autouse=True)
def fake_model(monkeypatch):
    model = FakeModel(dim=384)
    monkeypatch.setattr(embedder, "_model", model)
    monkeypatch.setattr(embedder, "_get_model", lambda: model)
    return model


def test_embed_text_returns_single_vector(fake_model):
    vec = embedder.embed_text("hello")
    assert len(vec) == 384
    assert fake_model.calls == [["hello"]]


def test_batch_splits_large_inputs(fake_model):
    texts = [f"text {i}" for i in range(embedder.BATCH_SIZE + 5)]
    vecs = embedder.embed_texts(texts)
    assert len(vecs) == len(texts)
    assert len(fake_model.calls) == 2


def test_long_text_is_truncated(fake_model):
    long_text = "x" * (embedder.MAX_CHARS_PER_TEXT + 100)
    embedder.embed_text(long_text)
    sent = fake_model.calls[0][0]
    assert len(sent) == embedder.MAX_CHARS_PER_TEXT
