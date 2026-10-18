'use client'

import { ArrowRight, Github, Terminal, CheckCircle, Zap, Shield, Brain } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-background via-background to-muted/30" aria-hidden="true" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 36v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 6V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8 border border-border">
            <Zap className="h-4 w-4" aria-hidden="true" />
            <span>Now with LangGraph agent + pgvector hybrid retrieval</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
            Ask any codebase a question.
            <br />
            <span className="text-foreground">Get a cited answer.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            Give Citer a GitHub repo and it tells you where every part lives — and where to go when an issue arises.
            <br />
            <span className="font-medium text-foreground">Grounded. Agentic. Evaluated.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/try"
              className="group flex items-center justify-center gap-2 px-8 py-3 text-base font-medium text-background bg-foreground rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg"
            >
              <Terminal className="h-5 w-5" aria-hidden="true" />
              <span>Try Citer locally</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="https://github.com/JeremiahShadams/Citer"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 px-8 py-3 text-base font-medium text-foreground bg-transparent border border-border rounded-lg hover:bg-accent transition-all duration-200"
            >
              <Github className="h-5 w-5" aria-hidden="true" />
              <span>View on GitHub</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span>Symbol-level chunking (tree-sitter)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span>Hybrid search + RRF</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span>LangGraph 6-node agent</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span>Streaming citations</span>
            </div>
          </div>
        </div>

        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent z-10 pointer-events-none" aria-hidden="true" />
          <div className="relative rounded-xl border border-border bg-background/50 backdrop-blur-sm overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" aria-hidden="true" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" aria-hidden="true" />
                <div className="w-3 h-3 rounded-full bg-green-500" aria-hidden="true" />
              </div>
              <div className="flex-1 text-center text-sm text-muted-foreground font-mono">
                citer ask --repo github.com/your-org/your-repo
              </div>
            </div>
            <div className="p-6 font-mono text-sm overflow-x-auto">
              <pre className="text-foreground"><code>{`$ citer ask --repo github.com/your-org/your-repo
🔍 Indexing repository... (shallow clone + tree-sitter parse + embed)
✅ Indexed 1,247 files, 8,932 symbols in 12.3s

❓ Question: "Where is JWT verification handled?"

🤔 Thinking...
  → Planner: Rewriting query → "JWT token verification middleware"
  → Retrieve: Hybrid search (vector + FTS + symbol) → RRF(k=60) → top 20
  → Decide: Synthesize (confidence: 0.94)

💡 Answer:
JWT verification is handled in <cite>app/security/tokens.py:42-68</cite> via the <code>verify_jwt_token()</code> function.

The middleware at <cite>app/middleware/auth.py:15</cite> extracts the token from the Authorization header and passes it to the verifier.

Key implementation details:
• Uses PyJWT with RS256 algorithm
• Validates exp, iat, aud claims
• JWKS caching with 1hr TTL (<cite>app/security/jwks.py:22</cite>)
• Returns typed <code>TokenPayload</code> or raises <code>InvalidTokenError</code>

📎 Citations: [1] tokens.py:42-68 [2] auth.py:15 [3] jwks.py:22`}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}