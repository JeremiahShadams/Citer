import asyncio
import json
import time

import httpx

from app.eval.dataset import DATASETS
from app.eval.metrics import evaluate_answer


def parse_sse_events(lines) -> tuple[str, list[dict]]:
    """Consume an /api/ask SSE stream into (answer, citations)."""
    answer_parts: list[str] = []
    citations: list[dict] = []
    event: str | None = None
    for line in lines:
        if line.startswith("event: "):
            event = line.removeprefix("event: ").strip()
            continue
        if event is None or not line.startswith("data: "):
            continue
        try:
            payload = json.loads(line.removeprefix("data: "))
        except json.JSONDecodeError:
            event = None
            continue
        if event == "token":
            answer_parts.append(payload.get("text", ""))
        elif event == "citations":
            citations = payload if isinstance(payload, list) else []
        elif event in {"done", "error"}:
            break
        event = None
    return "".join(answer_parts), citations


async def run_dataset(name: str, repo_url: str, base_url: str = "http://localhost:8000") -> dict:
    results = []
    async with httpx.AsyncClient(base_url=base_url, timeout=120) as client:
        for item in DATASETS[name]:
            start = time.perf_counter()
            try:
                with client.stream(
                    "POST",
                    "/api/ask",
                    json={"question": item["question"], "repo_url": repo_url},
                ) as response:
                    answer, citations = parse_sse_events(response.iter_lines())
            except httpx.HTTPError as exc:
                answer, citations = "", []
                print(f"request failed for '{item['question'][:60]}...': {exc}")
            latency_ms = (time.perf_counter() - start) * 1000
            metrics = evaluate_answer(
                answer=answer,
                citations=citations,
                expected_files=item["expected_files"],
            )
            results.append({"question": item["question"], "latency_ms": latency_ms, **metrics})

    return {
        "dataset": name,
        "pass_rate": sum(r["passed"] for r in results) / len(results),
        "hallucination_rate": sum(r["hallucinated"] for r in results) / len(results),
        "avg_latency_ms": sum(r["latency_ms"] for r in results) / len(results),
        "results": results,
    }


def run_eval(name: str, repo_url: str) -> dict:
    return asyncio.run(run_dataset(name, repo_url))
