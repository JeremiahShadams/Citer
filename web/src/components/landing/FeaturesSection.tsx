'use client'

import { 
  Brain, 
  Search, 
  GitBranch, 
  Zap, 
  Shield, 
  FileText, 
  Layers, 
  Network,
  Terminal,
  CheckCircle
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Symbol-Aware Retrieval',
    description: 'Tree-sitter AST extraction for 12+ languages. Functions, classes, and methods are first-class chunks with exact line numbers — not arbitrary windows.',
  },
  {
    icon: Search,
    title: 'Hybrid Search with RRF',
    description: 'Vector (pgvector HNSW) + Postgres FTS + exact symbol match, fused via Reciprocal Rank Fusion. Rewards chunks appearing across multiple rankings.',
  },
  {
    icon: GitBranch,
    title: 'Agentic Loop (6-Node LangGraph)',
    description: 'Planner → Retrieve → Decide ↺ (file_reader / symbol_searcher) → Synthesize. Max 3 iterations, streaming GPT-4o tokens with enforced citations.',
  },
  {
    icon: Zap,
    title: 'Streaming UX with Citations',
    description: 'Server-Sent Events streaming tokens, citations, and completion. Rendered as markdown with inline citation chips linking to exact file:line.',
  },
  {
    icon: Shield,
    title: 'Citation Enforcement',
    description: 'System prompt requires every claim cited [n]. parse_citations() drops out-of-range markers. NO_CONTEXT fallback forces explicit abstention over hallucination.',
  },
  {
    icon: FileText,
    title: 'Multi-Turn Memory',
    description: 'Sessions persist in Postgres. Last 6 turns injected to resolve pronouns. Redis semantic cache (cosine >0.95, 3600s TTL) ready for hot path.',
  },
  {
    icon: Layers,
    title: 'Evaluated (25-Q Golden Set)',
    description: 'Golden dataset across auth, ingestion, retrieval, agent, API. pass_rate / hallucination_rate / latency metrics. eval_runs table persists results.',
  },
  {
    icon: Network,
    title: 'Production Docker Stack',
    description: 'pgvector:pg16 + redis:7-alpine + FastAPI backend. One-command deploy. Health checks, migrations, structured logging included.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30" aria-labelledby="features-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Built for <span className="text-foreground">onboarding and maintenance</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Every feature exists to answer: "Where is this in the codebase?" — with proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group p-6 rounded-xl border border-border bg-background transition-all duration-300 hover:border-accent hover:shadow-lg"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent text-accent-foreground mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}