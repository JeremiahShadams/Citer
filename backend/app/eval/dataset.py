GOLDEN_DATASET = [
    # 1-5: Authentication, Sessions & Security
    {
        "question": "Where is user authentication and session token verification handled?",
        "expected_answer": "Authentication is handled in src/auth/login.py and enforced at the request level via AuthMiddleware in src/auth/middleware.py.",
        "expected_files": ["auth/login", "auth/middleware"],
        "difficulty": "easy",
    },
    {
        "question": "How are JWT tokens issued, decoded, and validated for expiration?",
        "expected_answer": "Tokens are issued and verified in app/services/auth.py and app/core/tokens.py using PyJWT with expiration and signature validation.",
        "expected_files": ["services/auth", "core/tokens", "auth"],
        "difficulty": "medium",
    },
    {
        "question": "What happens when a user logs out or revokes an active session?",
        "expected_answer": "The session record in the database is deleted or marked revoked in app/services/auth.py, preventing further bearer token verification.",
        "expected_files": ["services/auth", "routes/auth"],
        "difficulty": "easy",
    },
    {
        "question": "How is GitHub OAuth callback processed and exchanged for an access token?",
        "expected_answer": "The GitHub OAuth flow exchanges the temporary authorization code for an access token via GitHub API in app/api/routes/auth.py.",
        "expected_files": ["routes/auth", "services/auth"],
        "difficulty": "medium",
    },
    {
        "question": "Where is tenant isolation enforced between different repositories?",
        "expected_answer": "Queries filter strictly by repo_id in database models and SQL queries in app/db/queries.py.",
        "expected_files": ["db/queries", "db/models"],
        "difficulty": "medium",
    },

    # 6-10: Ingestion, AST Parsing & Chunking
    {
        "question": "Where are source files filtered and non-code/vendor directories excluded?",
        "expected_answer": "File discovery and filtering occurs in app/ingestion/parser.py using EXCLUDED_DIRS and SOURCE_EXTS.",
        "expected_files": ["ingestion/parser"],
        "difficulty": "easy",
    },
    {
        "question": "How does Tree-sitter parse AST symbols and extract functions and classes?",
        "expected_answer": "Tree-sitter languages extract function_definition, class_definition, and method nodes with line spans in app/ingestion/chunker.py.",
        "expected_files": ["ingestion/chunker"],
        "difficulty": "hard",
    },
    {
        "question": "How are code chunks enriched with metadata before embedding?",
        "expected_answer": "Chunk.enriched_content() prepends file path, symbol name, symbol type, and line ranges in app/ingestion/chunker.py.",
        "expected_files": ["ingestion/chunker"],
        "difficulty": "easy",
    },
    {
        "question": "Where does Git repository cloning occur?",
        "expected_answer": "Repositories are shallow-cloned using GitPython in app/ingestion/cloner.py.",
        "expected_files": ["ingestion/cloner"],
        "difficulty": "easy",
    },
    {
        "question": "How does the ingestion pipeline orchestrate clone, parse, embed, and database storage?",
        "expected_answer": "The full pipeline runs in app/ingestion/pipeline.py by chaining clone_repo, list_source_files, chunk_file, embed_texts, and bulk DB commit.",
        "expected_files": ["ingestion/pipeline"],
        "difficulty": "medium",
    },

    # 11-15: Database & Hybrid Retrieval (Vector + FTS + Symbol + RRF)
    {
        "question": "Where is the PostgreSQL database schema and pgvector HNSW index defined?",
        "expected_answer": "The SQL migration is defined in backend/migrations/001_init.sql with vector(3072) and HNSW cosine distance indexing.",
        "expected_files": ["migrations/001_init", "db/models"],
        "difficulty": "easy",
    },
    {
        "question": "How does dense vector similarity search query pgvector?",
        "expected_answer": "vector_search in app/db/queries.py uses cosine distance operator <=> ordered by distance limit top_k.",
        "expected_files": ["db/queries", "retrieval/vector"],
        "difficulty": "medium",
    },
    {
        "question": "How is full-text keyword search implemented in PostgreSQL?",
        "expected_answer": "keyword_search in app/db/queries.py uses to_tsvector on content and file_path with plainto_tsquery and ts_rank.",
        "expected_files": ["db/queries", "retrieval/keyword"],
        "difficulty": "medium",
    },
    {
        "question": "How are symbol candidates extracted from queries and matched?",
        "expected_answer": "extract_symbols in app/retrieval/symbol.py extracts identifiers and queries CodeChunk.symbol_name in app/db/queries.py.",
        "expected_files": ["retrieval/symbol", "db/queries"],
        "difficulty": "medium",
    },
    {
        "question": "How does Reciprocal Rank Fusion (RRF) merge multiple search rankings?",
        "expected_answer": "rrf_merge in app/retrieval/rrf.py accumulates 1.0 / (k + rank + 1) across ranking lists and returns top final_k items.",
        "expected_files": ["retrieval/rrf", "retrieval/hybrid"],
        "difficulty": "medium",
    },

    # 16-20: LangGraph Agent & Tools
    {
        "question": "Where is the LangGraph agent state graph compiled and configured?",
        "expected_answer": "build_graph in app/agent/graph.py compiles StateGraph with planner, retrieve, router, and synthesize nodes.",
        "expected_files": ["agent/graph", "agent/state"],
        "difficulty": "medium",
    },
    {
        "question": "What information does the planner node generate?",
        "expected_answer": "plan_node in app/agent/nodes/planner.py analyzes the question and emits tool calls for retrieval or symbol lookup.",
        "expected_files": ["agent/nodes/planner"],
        "difficulty": "easy",
    },
    {
        "question": "How does the router node decide whether to continue retrieving or synthesize?",
        "expected_answer": "should_continue in app/agent/nodes/router.py evaluates whether gathered context is sufficient or max iterations reached.",
        "expected_files": ["agent/nodes/router"],
        "difficulty": "medium",
    },
    {
        "question": "How does the synthesizer node format answers with citations?",
        "expected_answer": "synthesize_node in app/agent/nodes/synthesizer.py constructs prompt with retrieved chunks and enforces exact file:line citations.",
        "expected_files": ["agent/nodes/synthesizer", "agent/prompts"],
        "difficulty": "medium",
    },
    {
        "question": "Where is the raw file reader tool defined for expanding line ranges?",
        "expected_answer": "file_reader in app/agent/tools/file_reader.py reads raw content and specific line spans for grounded verification.",
        "expected_files": ["agent/tools/file_reader"],
        "difficulty": "easy",
    },

    # 21-25: API, Streaming, Caching & Evaluation
    {
        "question": "Where is Server-Sent Events (SSE) token streaming implemented for /api/ask?",
        "expected_answer": "The /api/ask endpoint in app/api/routes/ask.py streams node, token, citations, and done events via a background thread mailbox.",
        "expected_files": ["api/routes/ask"],
        "difficulty": "medium",
    },
    {
        "question": "How does the semantic cache check query similarity in Redis?",
        "expected_answer": "get_cached_answer in app/cache/semantic_cache.py embeds the question and scans cached embeddings with cosine similarity > 0.95.",
        "expected_files": ["cache/semantic_cache"],
        "difficulty": "hard",
    },
    {
        "question": "Where are multi-turn conversation sessions and messages persisted?",
        "expected_answer": "Sessions and message histories are managed in app/agent/memory.py and stored in the sessions and messages DB tables.",
        "expected_files": ["agent/memory", "db/models"],
        "difficulty": "easy",
    },
    {
        "question": "How is evaluation pass rate and hallucination rate calculated?",
        "expected_answer": "evaluate_answer in app/eval/metrics.py checks whether expected_files are cited and flags ungrounded claims as hallucinated.",
        "expected_files": ["eval/metrics"],
        "difficulty": "easy",
    },
    {
        "question": "Where does the evaluation test runner execute datasets against the API?",
        "expected_answer": "run_dataset in app/eval/runner.py makes asynchronous HTTP requests to /api/ask and measures latency and accuracy metrics.",
        "expected_files": ["eval/runner", "eval/reports"],
        "difficulty": "medium",
    },
]

DATASETS = {"golden": GOLDEN_DATASET}