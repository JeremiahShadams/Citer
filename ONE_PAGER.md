<div align="center">

# Citer — Ask any codebase a question. Get a cited answer.

**Give it a GitHub repo → ask in plain English → get the exact file & line that answers you.**

[![Live](https://img.shields.io/badge/Demo-Local%20Docker-blue)]() [![Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20Next.js%20%7C%20LangGraph%20%7C%20pgvector-black)]() [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

### The Problem
New developers lose days tracing auth, ingestion, or retrieval logic across an unfamiliar repo. Grep finds strings, not intent. LLMs hallucinate files that don't exist.

### The Solution
Citer clones **any GitHub repo**, parses it with **tree-sitter** into symbol-level chunks (function/class/method), embeds with **OpenAI text-embedding-3-large**, and answers via a **LangGraph agent** that *must* cite `file:start-end` or say "not in the codebase."

Built for **any developer, optimized for onboarding** — the fastest way to know *where to look when an issue arises*.

### How It Works (6-node LangGraph)

```
User asks at localhost:3000
  → POST /api/ask (SSE) → resolve repo + load last 6 turns
  → LangGraph: START → planner → retrieve → decide ↺ → synthesize → END
      planner:  LLM rewrites question → 1 focused search query (resolves "it")
      retrieve: hybrid_search() → vector + FTS + symbol → RRF(k=60) → top 20
      decide:   LLM JSON {synthesize | file_reader | symbol_searcher} (max 3 loops)
      file_reader / symbol_searcher: pull full file or all chunks for a symbol
      synthesize: streams GPT-4o tokens + enforces [n] citations, parses against retrieved chunks
  → event: token | citations | done → chat UI + save to sessions/messages
```

**State:** `sessions` + `messages` persist indefinitely in Postgres (`agent/memory.py`); `format_history()` injects last 6 turns. Redis semantic cache (cosine >0.95, 3600s TTL) — wired but not yet in the hot path.

**Where code lives:** Cloned to `tempfile.mkdtemp(prefix="codeqa-")` then persisted as `files` + `code_chunks(file_path, symbol_name, start_line, end_line, embedding Vector(1536) HNSW)` in Postgres. Disk clone is transient.

### Retrieval — Why It Doesn't Hallucinate

| Layer | Detail |
|-------|--------|
| **Chunking** | Tree-sitter AST per language (`py, js/ts, go, rust, java...`), per-function/class/method, `400 lines / 8000 chars` cap, oversized classes split into header+methods, fallback whole-file. Stored with `enriched_content()` header `File: / Symbol: / Lines:`. |
| **Embeddings** | `text-embedding-3-large` dims `1536` (truncated 3072), batch 128, retry + 24k char truncate. |
| **Vector DB** | Postgres + **pgvector** `vector(1536)` `HNSW vector_cosine_ops` + indexes on `repo_id/symbol_name/file_path`. |
| **Hybrid search** | `vector_search( <=> cosine )` + `keyword_search( to_tsvector || plainto_tsquery + ts_rank )` + `symbol_search( regex identifiers → symbol_name == )` → **RRF `1/(60+rank+1)`** → `final_k=8` from `top_k=20`. |
| **Large files** | Capped chunks, per-method split, `MAX_CHUNKS_PER_FILE=500`. |

**Citation enforcement:** System prompt *“Answer ONLY from provided context. Cite every claim [n]. Never invent paths.”* `format_context()` numbers blocks `[1] path:lines (type sym)`, `parse_citations()` drops any `[n]` out of range. `NO_CONTEXT` fallback if retrieval empty.

### Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React 18, TypeScript 5, Tailwind, react-markdown, SSE streaming |
| Backend | Python 3.12, FastAPI, SQLAlchemy, psycopg, LangGraph 1.x + LangChain-OpenAI |
| LLM | **OpenAI GPT-4o** (`temperature=0.0`, streaming) — chosen for citation instruction fidelity |
| Retrieval | pgvector HNSW + Postgres FTS + symbol exact match + RRF |
| Infra | Docker Compose (postgres pgvector:pg16 / redis:7-alpine / backend / frontend), LangSmith tracing |

### What I Learned / Tradeoffs

*   **Symbol chunking > naive splits** — retrieval hits the right function, not a 2000-line file midpoint.
*   **Hybrid > pure vector** — FTS catches `auth_middleware` when embedding misses, symbol search nails `find_chunks_by_symbol`.
*   **Regret:** storing `text-embedding-3-large` at `1536` wastes quality — should use `text-embedding-3-small` natively 1536 or store full `3072`.

### Real Outcomes

*   **Status:** Usable locally today (`docker compose up`, `POST /api/index` → `/api/ask` streaming). No hosted demo yet.
*   **Latency:** ~3–7s end-to-end (vector ~100ms + planner/decide 1s + GPT-4o streaming 2–5s). *Not yet benchmarked — TODO: log p50/p95.*
*   **Scale tested:** Citer itself (~50 files / ~10k LOC). Not stress-tested on >1k-file repos.
*   **What breaks:** Vague “explain everything”, repos with non-code exts (`.md` excluded), typo’d symbols, private repos without `GITHUB_TOKEN`, semantic cache `scan_iter` at scale.
*   **Accuracy:** 25-question golden dataset (`eval/dataset.py`) with `evaluate_answer()` (passed if `expected_files` in `cited_files`). `eval_runs` table ready; **pass rate not yet recorded — run `make eval` and publish.**

### Next 2 Weeks

1. Wire `semantic_cache.py` into `ask.py` hot path
2. Ship eval dashboard at `/eval` surfacing `pass_rate / hallucination_rate / avg_latency_ms`
3. Deploy to Fly/Render for a public demo link

### Links

*   Code: `backend/app/agent/graph.py`, `ingestion/chunker.py`, `retrieval/hybrid.py`, `db/queries.py`, `migrations/001_init.sql`
*   Try: `cp .env.example .env && docker compose up -d && make dev-backend dev-frontend` → `http://localhost:3000`

---
*Built by a senior engineer — agentic, grounded, evaluated.*
