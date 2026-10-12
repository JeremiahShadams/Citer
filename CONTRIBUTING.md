# Contributing to Citer

Thanks for stopping by. Citer is a portfolio-grade project by Jeremiah Shadams, and thoughtful contributions are welcome.

## How I work

- `main` is always deployable. Branch off it: `feat/<short-name>`, `fix/<short-name>`, `docs/<short-name>`.
- Keep PRs small and focused. One idea per PR.
- Write a clear PR description: what changed, why, and how you tested it.

## Local setup (2 minutes)

```bash
cp .env.example .env   # add your GROQ_API_KEY and OPENAI_API_KEY (for embeddings)
docker compose up -d --build
```

Host dev (hot reload) instead of containers:

```bash
make dev-backend    # backend with uvicorn --reload
make dev-frontend   # frontend with next dev
```

## Checks before you push

```bash
make test   # backend pytest
cd frontend && npm run build && npm test -- --run 2>/dev/null || npx vitest run
```

- Backend: Python 3.12, FastAPI, `pytest -q` must pass.
- Frontend: Next.js 14, `npm run build` must pass, add a Vitest case for new UI behavior.
- Never commit `.env`, API keys, or cloned repos. `.env.example` is the contract.

## Reporting issues

Use the bug / feature templates in `.github/ISSUE_TEMPLATE/`. Include repro steps, expected vs. actual, and logs. No vague "it doesn't work" — help me help you.
