import { SiteHeader } from '@/components/site-header'
import Link from 'next/link'
import { Terminal, FileText, Github, ArrowRight } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-obsidian text-porcelain">
      <SiteHeader />
      <main className="pt-16 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Documentation
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn how to deploy, configure, and extend Citer.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
                <p className="mb-4">Get Citer running locally in under 2 minutes.</p>
                
                <h3 className="text-xl font-semibold mb-2">Prerequisites</h3>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li>Docker & Docker Compose</li>
                  <li>Node 20+ and Python 3.12+ (for host development)</li>
                  <li><code>GROQ_API_KEY</code> + <code>OPENAI_API_KEY</code> (for embeddings)</li>
                  <li>Optional: <code>LANGCHAIN_API_KEY</code> for tracing</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2">Run in Docker</h3>
                <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto"><code>{`cp .env.example .env   # fill GROQ_API_KEY, OPENAI_API_KEY
docker compose up -d --build
# Postgres :5432  Redis :6379  Backend :8000`}</code></pre>

                <h3 className="text-xl font-semibold mb-2 mt-6">Run for Development</h3>
                <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto"><code>{`make up              # build + start all containers
make dev-backend     # cd backend && uvicorn app.main:app --reload`}</code></pre>

                <h3 className="text-xl font-semibold mb-2 mt-6">Index & Ask</h3>
                <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto"><code>{`# Index a repository
curl -X POST http://localhost:8000/api/index \
  -H "Content-Type: application/json" \
  -d '{"repo_url":"https://github.com/user/repo"}'

# Ask (streaming)
curl -N -X POST http://localhost:8000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"Where is auth handled?","repo_url":"https://github.com/user/repo"}'`}</code></pre>

                <h2 className="text-2xl font-bold mb-4 mt-8">Architecture</h2>
                <p className="mb-4">Citer uses a 6-node LangGraph pipeline:</p>
                <ol className="list-decimal list-inside space-y-3 mb-6">
                  <li><strong>Planner</strong> — LLM rewrites question into focused search query (uses last 6 turns for context)</li>
                  <li><strong>Retrieve</strong> — Hybrid search: vector (pgvector HNSW) + Postgres FTS + exact symbol match → RRF(k=60) → top 20</li>
                  <li><strong>Decide</strong> — LLM returns JSON action: synthesize | file_reader | symbol_searcher (max 3 iterations)</li>
                  <li><strong>File Reader / Symbol Searcher</strong> — Expand context with full file or all chunks for a symbol</li>
                  <li><strong>Synthesize</strong> — Streams GPT-4o tokens via SSE, enforces [n] citations, parses against retrieved chunks</li>
                  <li><strong>Persist</strong> — Sessions/messages saved to Postgres</li>
                </ol>

                <h2 className="text-2xl font-bold mb-4 mt-8">API Reference</h2>
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">POST /api/index</h4>
                    <p className="text-sm text-muted-foreground mb-2">Index a GitHub repository (shallow clone + parse + embed)</p>
                    <pre className="bg-muted/50 border border-border rounded p-2 text-sm overflow-x-auto"><code>{`{
  "repo_url": "https://github.com/user/repo"
}`}</code></pre>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">POST /api/ask</h4>
                    <p className="text-sm text-muted-foreground mb-2">Ask a question (streaming SSE)</p>
                    <pre className="bg-muted/50 border border-border rounded p-2 text-sm overflow-x-auto"><code>{`{
  "question": "Where is authentication handled?",
  "repo_url": "https://github.com/user/repo"
}`}</code></pre>
                    <p className="text-sm text-muted-foreground mt-2">SSE events: <code>token</code>, <code>citations</code>, <code>done</code></p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">GET /health</h4>
                    <p className="text-sm text-muted-foreground">Health check endpoint</p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-4 mt-8">Configuration</h2>
                <p className="mb-4">All settings via <code>.env</code> → <code>backend/app/core/config.py</code> (pydantic-settings):</p>
                <table className="w-full border border-border rounded-lg overflow-hidden text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="p-3 text-left font-semibold">Variable</th>
                      <th className="p-3 text-left font-semibold">Default</th>
                      <th className="p-3 text-left font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="p-3 font-mono">GROQ_API_KEY</td><td className="p-3">—</td><td className="p-3">Required for chat</td></tr>
                    <tr><td className="p-3 font-mono">GROQ_MODEL</td><td className="p-3">llama-3.1-70b-versatile</td><td className="p-3">Chat model</td></tr>
                    <tr><td className="p-3 font-mono">OPENAI_API_KEY</td><td className="p-3">—</td><td className="p-3">Required for embeddings</td></tr>
                    <tr><td className="p-3 font-mono">OPENAI_EMBEDDING_MODEL</td><td className="p-3">text-embedding-3-large</td><td className="p-3">Embedding model</td></tr>
                    <tr><td className="p-3 font-mono">DATABASE_URL</td><td className="p-3">postgresql+psycopg://codeqa:codeqa@localhost:5432/codeqa</td><td className="p-3">PostgreSQL connection</td></tr>
                    <tr><td className="p-3 font-mono">REDIS_URL</td><td className="p-3">redis://localhost:6379/0</td><td className="p-3">Redis connection</td></tr>
                    <tr><td className="p-3 font-mono">NEXT_PUBLIC_API_URL</td><td className="p-3">http://localhost:8000</td><td className="p-3">Frontend → backend</td></tr>
                  </tbody>
                </table>
              </section>
            </div>

            <aside className="lg:col-span-1">
              <nav className="sticky top-24 space-y-1 bg-muted/30 rounded-xl p-4">
                <h3 className="font-semibold mb-3">Contents</h3>
                <ul className="space-y-1 text-sm">
                  <li><a href="#quick-start" className="text-muted-foreground hover:text-foreground block py-1">Quick Start</a></li>
                  <li><a href="#architecture" className="text-muted-foreground hover:text-foreground block py-1">Architecture</a></li>
                  <li><a href="#api-reference" className="text-muted-foreground hover:text-foreground block py-1">API Reference</a></li>
                  <li><a href="#configuration" className="text-muted-foreground hover:text-foreground block py-1">Configuration</a></li>
                </ul>
                <div className="border-t border-border my-4" />
                <h3 className="font-semibold mb-3">More</h3>
                <ul className="space-y-1 text-sm">
                  <li><Link href="/try" className="text-muted-foreground hover:text-foreground block py-1">Try Citer</Link></li>
                  <li><a href="https://github.com/JeremiahShadams/Citer" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground block py-1 flex items-center gap-1">GitHub <ArrowRight className="h-3 w-3" aria-hidden="true" /></a></li>
                  <li><a href="https://github.com/JeremiahShadams/Citer/blob/main/ONE_PAGER.md" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground block py-1 flex items-center gap-1">One-Pager <ArrowRight className="h-3 w-3" aria-hidden="true" /></a></li>
                </ul>
              </nav>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}