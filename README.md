<div align="center">

# Citer

**Ask any codebase a question — get an answer grounded in the exact file and line that proves it.**

*Onboard to a new repo on day one. Trace auth, debug faster, and know where to look next — without hallucinations.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](backend/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688.svg)](backend/app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](frontend/)
[![LangGraph](https://img.shields.io/badge/LangGraph-1.x-1C3C3C.svg)](backend/app/agent)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-336791.svg)](backend/migrations)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF.svg)](.github/workflows/ci.yml)

[Quick Start](#quick-start) · [Architecture](#architecture) · [How It Works](#how-it-works) · [One-Pager](ONE_PAGER.md)

</div>

---

## Table of Contents

- [Why Citer](#why-citer)
- [Features](#features)
- [Demo](#demo)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Retrieval & Citations](#retrieval--citations)
- [Stack](#stack)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Evaluation](#evaluation)
- [Roadmap & Limitations](#roadmap--limitations)
- [License](#license)

---

## Why Citer

New engineers lose days grepping an unfamiliar repo. Keyword search finds strings, not intent. General LLMs hallucinate files that don't exist.

Citer solves this by **cloning any GitHub repository**, parsing it into **symbol-level chunks** with tree-sitter, embedding it with **OpenAI text-embedding-3-large**, and answering through a **LangGraph agent that must cite `file:start-end` or explicitly say "not in the codebase."**

> **One-line pitch:** Give Citer a company repo and it tells you where every part lives — and where to go when an issue arises.

Built for **any developer**, optimized for **onboarding and maintenance**.

---

## Features

- **Natural-language Q&A over any repo** — *"Where is JWT verification handled?"* → `app/security/tokens.py:42` + snippet
- **Grounded citations, not hallucinations** — every claim is tied to `[n] file:lines`; out-of-range markers are dropped
- **Symbol-aware retrieval** — functions, classes, and methods are first-class chunks, not arbitrary line windows
- **Hybrid search with RRF** — vector (pgvector HNSW) + Postgres full-text search + exact symbol match, fused via Reciprocal Rank Fusion
- **Agentic loop** — planner → retrieve → decide → (file_reader / symbol_searcher) → synthesize, with streaming
- **Multi-turn memory** — sessions persist in Postgres; last 6 turns injected to resolve pronouns like "it" / "that file"
- **Streaming UX** — Server-Sent Events (`token`, `citations`, `done`) rendered as markdown with citations in Next.js
- **Evaluated** — 25-question golden dataset + `pass_rate` / `hallucination_rate` harness

---

## Demo

**Local-first today.** No hosted demo yet — run in Docker in under 2 minutes.

```
http://localhost:3000  →  Index a repo  →  Ask "Where is auth handled?"  →  Stream cited answer
```

> Placeholder for GIF/screenshot: `frontend/app/chat` streaming tokens + citation chips.

See [ONE_PAGER.md](ONE_PAGER.md) for a one-page case study.

---

## Architecture

### System Overview

```mermaid
graph TD
  User[User @ localhost:3000] -->|POST /api/ask SSE| API[FastAPI /api/ask]
  API --> MEM[(Postgres: sessions/messages)]
  API -->|spawn thread + queue| Graph[LangGraph Agent]
  Graph --> Planner[planner: LLM → search query]
  Planner --> Retrieve[retrieve: hybrid_search]
  Retrieve --> Decide{decide: LLM JSON}
  Decide -->|file_reader| FR[file_reader: find_chunks_by_file]
  Decide -->|symbol_searcher| SS[symbol_searcher: find_chunks_by_symbol]
  FR --> Decide
  SS --> Decide
  Decide -->|synthesize| Synth[synthesize: GPT-4o streaming]
  Synth -->|token / citations / done| API
  Synth --> MEM
```

### Indexing vs. Querying

| Phase | Path | Key Code |
|-------|------|----------|
| **Index** | `POST /api/index` → `clone_repo(depth=1)` → `list_source_files` → `chunk_file` → `embed_texts(batch 128)` → `code_chunks + files` | `backend/app/ingestion/pipeline.py`, `parser.py`, `chunker.py`, `embedder.py` |
| **Query** | `POST /api/ask` → `load_history(limit=20)` → `format_history(last 6)` → `StateGraph(6 nodes)` → SSE `node/token/citations/done` → `save_message` | `backend/app/api/routes/ask.py`, `agent/graph.py`, `agent/memory.py`, `agent/llm.py` |

**Where code lives:** Cloned to an ephemeral `tempfile.mkdtemp(prefix="codeqa-")` (`app/ingestion/cloner.py:17`), then persisted as `files` and `code_chunks(file_path, symbol_name, start_line, end_line, embedding Vector(1536) HNSW)` in Postgres. The temp directory is not retained; Postgres is the source of truth.

---

## How It Works

### 1. Indexing Pipeline

1. **Clone** — shallow `git clone --depth 1` via GitPython
2. **Discover** — walk `SOURCE_EXTS={.py,.js,.ts,.tsx,.go,.rs,.java...}` excluding `EXCLUDED_DIRS={.git, node_modules, venv, __pycache__, .next}` (`app/ingestion/parser.py:4`)
3. **Chunk** — tree-sitter AST extraction (`app/ingestion/chunker.py:133`): each `function_definition`, `class_definition`, `method_declaration` becomes a chunk with `symbol_name`, `symbol_type`, `start_line`, `end_line`. Oversized classes (>400 lines / 8000 chars) split into header + per-method chunks. Remainder becomes a `module` chunk. Unknown languages fall back to whole-file.
4. **Enrich & Embed** — `Chunk.enriched_content()` prepends `File: / Symbol: / Lines:` header, then `embed_texts` batches 128 with retry and 24k-char truncation (`app/ingestion/embedder.py:10`)
5. **Store** — bulk insert into `code_chunks` + `files`; repo marked `ready` (`app/ingestion/pipeline.py:117`)

### 2. Query Pipeline (6-node LangGraph)

Defined in `backend/app/agent/graph.py:12` with state `AgentState` (`app/agent/state.py:4`):

```
START → planner → retrieve → decide ↺ → synthesize → END
                         ↘ file_reader → decide
                         ↘ symbol_searcher → decide
```

- **planner** (`agent/nodes/planner.py:10`) — LLM rewrites the user question into one focused search query, using last-6-turn history to resolve pronouns
- **retrieve** (`agent/nodes/retriever.py:8`) — `hybrid_search(repo_id, query, top_k=20)` (`app/retrieval/hybrid.py:11`)
- **decide** (`agent/nodes/router.py:52`) — LLM returns `{"action":"synthesize" | "file_reader" | "symbol_searcher", ...}` (JSON, capped `max_agent_iterations=3`)
- **file_reader / symbol_searcher** (`agent/tools/file_reader.py:19`, `agent/tools/symbol_searcher.py`) — expand context with full file or all chunks for a symbol, then loop back to `decide`
- **synthesize** (`agent/nodes/synthesizer.py:19`) — streams `GPT-4o` tokens via `token_queue` to SSE, injects numbered context (`format_context()` → `[1] path:lines (type sym)`) and history, enforces citations, falls back to `NO_CONTEXT` if retrieval empty

Tokens stream as `event: token`, citations as `event: citations`, completion as `event: done` (`app/api/routes/ask.py:92`), persisted via `save_message` to `sessions/messages`.

---

## Retrieval & Citations

### Chunking

Not file or line-window splitting. **Tree-sitter symbol chunking** (`TREE_SITTER_LANGUAGES` + `DEFINITION_NODE_TYPES` per language, `app/ingestion/chunker.py:5`), preserving function/class boundaries and line numbers. Cap `MAX_CHUNKS_PER_FILE=500`.

### Hybrid Search

One call fans out to three signals and fuses them:

| Signal | Implementation | Code |
|--------|---------------|------|
| **Vector** | `embedding <=> CAST(:emb AS vector)` cosine, `ORDER BY distance` | `app/db/queries.py:49`, `pgvector HNSW` `migrations/001_init.sql:31` |
| **Keyword** | `to_tsvector('english', content \|\| file_path) @@ plainto_tsquery(:q)` + `ts_rank` | `app/db/queries.py:68` |
| **Symbol** | Regex `extract_symbols()` → exact `symbol_name == symbol` | `app/retrieval/symbol.py:7`, `app/db/queries.py:7` |

Fused via **Reciprocal Rank Fusion** `score = Σ 1/(k + rank + 1)`, `k=60`, `final_k=8` from `top_k=20` (`app/retrieval/rrf.py:20`). This rewards chunks that appear across multiple rankings.

### Citation Enforcement

- Prompt: *"Answer ONLY from provided context. Cite every claim `[n]`. Never invent paths. If not in context, say so."* (`SYNTHESIZER_SYSTEM` `app/agent/nodes/synthesizer.py:6` + `app/agent/prompts.py:1`)
- Formatting: `format_context()` numbers chunks `[1]`, `parse_citations()` (`app/agent/format.py:45`) maps `[n]` → `{file_path, start_line, end_line, snippet}` and drops any `n` out of `[1, len(chunks)]`
- Fallback: `NO_CONTEXT = "No relevant code was retrieved..."` forces an explicit abstention instead of hallucination

---

## Stack

| Layer | Technology | Detail |
|-------|-----------|--------|
| Frontend | Next.js 14, React 18, TypeScript 5, Tailwind, `react-markdown`, SSE | `frontend/app/chat`, `components/`, `lib/` |
| Backend | Python 3.12, FastAPI, SQLAlchemy, `psycopg[binary]`, `pgvector` | `backend/app/api/routes/*` |
| Agent | LangGraph 1.x + `langchain-openai` | `graph.py` 6 nodes, `state.py`, `llm.py: get_chat_model(temperature=0.0)` |
| LLM | OpenAI **GPT-4o** | Streaming via `model.stream()`, LangSmith tracing |
| Embeddings | OpenAI **text-embedding-3-large** `dims=1536` (truncated 3072) | Batch 128, `MAX_RETRIES=3`, `MAX_CHARS_PER_TEXT=24000` |
| Database | PostgreSQL + pgvector `vector(1536)` HNSW `vector_cosine_ops` | `migrations/001_init.sql`, `models.py: CodeChunk/File/Repo/Session/Message` |
| Cache | Redis 7 (semantic cache `0.95` cosine, `3600s` TTL) | `app/cache/semantic_cache.py` — ready, not yet in hot path |
| Deploy | Docker Compose: `pgvector:pg16` + `redis:7-alpine` + `backend` + `frontend` | `docker-compose.yml`, `backend/Dockerfile` (python:3.12-slim), `frontend/Dockerfile` (node:20-alpine) |

**Key settings** (`backend/app/core/config.py:33`): `top_k_retrieval=20`, `final_k=8`, `max_agent_iterations=3`, `openai_model=gpt-4o`.

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node 20+ and Python 3.12+ (for host dev)
- `OPENAI_API_KEY` + optional `LANGCHAIN_API_KEY` for tracing

### Run in Docker (recommended)

```bash
cp .env.example .env   # fill OPENAI_API_KEY and LANGCHAIN_API_KEY
docker compose up -d --build
# Postgres :5432  Redis :6379  Backend :8000  Frontend :3000
```

### Run for Development (hot reload)

```bash
make up              # build + start all containers
# — or —
make dev-backend     # cd backend && uvicorn app.main:app --reload  (host)
make dev-frontend    # cd frontend && npm run dev                  (host)
```

### Index & Ask

```bash
# Index a repository (shallow clone + parse + embed)
curl -X POST http://localhost:8000/api/index \
  -H "Content-Type: application/json" \
  -d '{"repo_url":"https://github.com/user/repo"}'

# Ask (streaming)
curl -N -X POST http://localhost:8000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"Where is authentication handled?","repo_url":"https://github.com/user/repo"}'

# Or open the UI
open http://localhost:3000
```

Health check: `GET http://localhost:8000/health` → `{"status":"ok"}`

---

## Configuration

All settings via `.env` → `backend/app/core/config.py:4` (`pydantic-settings`):

| Variable | Default | Purpose |
|----------|---------|---------|
| `OPENAI_API_KEY` | — | Required for chat + embeddings |
| `OPENAI_MODEL` | `gpt-4o` | Chat model (`llm.py:get_chat_model`) |
| `OPENAI_EMBEDDING_MODEL` | `text-embedding-3-large` | Embedding model |
| `DATABASE_URL` | `postgresql+psycopg://codeqa:codeqa@localhost:5432/codeqa` | Host: `localhost`; inside compose: `postgres:5432` |
| `REDIS_URL` | `redis://localhost:6379/0` | Host: `localhost`; inside compose: `redis:6379` |
| `LANGCHAIN_TRACING_V2` / `LANGCHAIN_API_KEY` | `true` / — | LangSmith tracing |
| `GITHUB_TOKEN` | — | Higher rate limit for private repo clones |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Frontend → backend |

See `.env.example` for a template.

---

## Project Structure

```
├── ONE_PAGER.md                     # One-page case study (recruiter-ready)
├── docker-compose.yml               # postgres + redis + backend + frontend
├── Makefile                         # up / down / dev-backend / dev-frontend / test / eval
├── backend/
│   ├── app/
│   │   ├── api/routes/              # index.py, ask.py (SSE), sessions.py, evaluation.py, auth.py, repositories.py
│   │   ├── core/                    # config.py, logger.py
│   │   ├── db/                      # models.py (Repo, CodeChunk Vector(1536), File, Session, Message), queries.py, session.py
│   │   ├── ingestion/               # cloner.py, parser.py, chunker.py (tree-sitter), embedder.py, pipeline.py
│   │   ├── retrieval/               # hybrid.py, vector.py, keyword.py, symbol.py, rrf.py
│   │   ├── agent/                   # state.py, graph.py, llm.py, format.py, memory.py, prompts.py
│   │   │   ├── nodes/               # planner.py, retriever.py, router.py, synthesizer.py
│   │   │   └── tools/               # file_reader.py, symbol_searcher.py
│   │   ├── cache/                   # semantic_cache.py
│   │   ├── eval/                    # dataset.py (25 Qs), runner.py, metrics.py, reports.py
│   │   └── schemas/                 # Pydantic request/response
│   ├── migrations/                  # 001_init.sql (vector + HNSW) · 002_auth.sql
│   ├── scripts/                     # CLI: index a repo, run eval
│   └── tests/                       # ingestion, retrieval, agent
├── frontend/
│   ├── app/
│   │   ├── chat/                    # Streaming chat + citation chips
│   │   └── eval/                    # Evaluation dashboard
│   ├── components/                  # markdown, SSE reader
│   └── lib/                         # API client
└── data/                            # Ephemeral clone cache (temp dirs)
```

---

## Evaluation

Golden dataset: **25 questions** across auth/sessions, ingestion/AST, DB/hybrid retrieval, LangGraph/tools, and API/streaming (`backend/app/eval/dataset.py:1`).

Metric: `evaluate_answer()` (`backend/app/eval/metrics.py:1`) — `passed` if any `expected_files` substring appears in `cited_files`; `hallucinated` if citations are missing. Results stored in `eval_runs(pass_rate, hallucination_rate, avg_latency_ms)` (`migrations/001_init.sql:50`).

```bash
make test   # backend pytest (ingestion, retrieval, agent)
make eval   # backend -m scripts.eval → runs dataset against /api/ask
```

> Current status: harness is wired; **pass rate and latency not yet published**. Run `make eval` and record results in `ONE_PAGER.md` before sharing for interviews.

---

## Roadmap & Limitations

**Works today:** Local Docker indexing + streaming Q&A with citations, multi-turn sessions, 25-Q eval harness.

**Limitations:**
- No hosted demo (local only); no auth gating on `/ask`
- Vague “explain everything” queries under-retrieve (`top_k=20`)
- Non-code extensions (`.md`) excluded by `SOURCE_EXTS`
- Symbol search requires exact identifier match (typos miss)
- Semantic cache `scan_iter` is O(n) — needs vector index at scale
- Truncating `text-embedding-3-large` 3072 → 1536 wastes quality — should use `text-embedding-3-small` natively or store full 3072

**Next (2 weeks):**
1. Wire `semantic_cache.py` into `ask.py` hot path
2. Polish `/eval` dashboard to surface `pass_rate / hallucination_rate / p95 latency`
3. Scope repos via `security/github_oauth.py` + `visibility` column
4. Deploy to Fly/Render for a public demo link

**If starting over:** store full `3072` dims or switch to local embeddings (BGE/E5) to eliminate OpenAI cost and latency.

---

## License

[MIT](LICENSE) — built as a portfolio project. PRs and issues welcome.

