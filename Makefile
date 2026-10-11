.PHONY: help up down logs dev-backend dev-frontend test eval clean setup

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-12s %s\n", $$1, $$2}'

setup: ## First-time setup: copy env + build containers
	cp -n .env.example .env 2>/dev/null || true
	docker compose up -d --build

up: ## Build + start all containers
	docker compose up -d --build

down: ## Stop all containers
	docker compose down

logs: ## Tail backend logs
	docker compose logs -f backend

dev-backend: ## Run backend with hot reload (host)
	cd backend && uvicorn app.main:app --reload

dev-frontend: ## Run frontend with hot reload (host)
	cd frontend && npm run dev

test: ## Run backend tests
	cd backend && pytest -q

eval: ## Run the 25-question golden eval
	cd backend && python -m scripts.eval

clean: ## Remove caches and ephemeral clones
	docker compose down -v || true
	rm -rf backend/.pytest_cache backend/__pycache__ frontend/.next
