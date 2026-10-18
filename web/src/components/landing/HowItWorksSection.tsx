'use client'

import { 
  GitBranch, 
  Database, 
  Search, 
  Brain, 
  MessageSquare, 
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: GitBranch,
    title: 'Clone & Parse',
    description: 'Shallow git clone (depth=1) → tree-sitter AST extraction per language → symbol-level chunks with exact line boundaries.',
    details: [
      'git clone --depth=1',
      'tree-sitter for 12+ languages',
      'Per-function/class/method chunks',
      '400 lines / 8000 chars cap',
    ],
  },
  {
    number: '02',
    icon: Database,
    title: 'Enrich & Embed',
    description: 'Each chunk enriched with File:/Symbol:/Lines: header → batched embeddings (128/batch) via text-embedding-3-large → 1536-dim vectors.',
    details: [
      'Enriched content headers',
      'Batch 128 with retry',
      '24k char truncation',
      'text-embedding-3-large',
    ],
  },
  {
    number: '03',
    icon: Search,
    title: 'Hybrid Retrieval',
    description: 'Vector cosine (HNSW) + Postgres FTS (ts_rank) + exact symbol match → Reciprocal Rank Fusion (k=60) → final_k=8 from top_k=20.',
    details: [
      'pgvector HNSW index',
      'tsvector + ts_rank',
      'Exact symbol regex match',
      'RRF fusion',
    ],
  },
  {
    number: '04',
    icon: Brain,
    title: 'Agentic Reasoning',
    description: '6-node LangGraph: Planner rewrites query → Retrieve → Decide (synthesize/file_reader/symbol_searcher) → max 3 loops → Synthesize.',
    details: [
      'Planner: focused search query',
      'Retrieve: hybrid top-20',
      'Decide: JSON action routing',
      'Synthesize: streaming GPT-4o',
    ],
  },
  {
    number: '05',
    icon: MessageSquare,
    title: 'Streaming Answer',
    description: 'SSE streams tokens, citations, done events. Citations parsed against retrieved chunks. Out-of-range dropped. NO_CONTEXT fallback if empty.',
    details: [
      'event: token | citations | done',
      'Citation enforcement',
      'Markdown + citation chips',
      'Abstention over hallucination',
    ],
  },
  {
    number: '06',
    icon: CheckCircle,
    title: 'Persist & Learn',
    description: 'Sessions/messages saved to Postgres. Evaluation harness runs 25-Q golden set. Semantic cache (Redis) ready for production hot path.',
    details: [
      'Postgres sessions/messages',
      '25-Q golden evaluation',
      'pass_rate / hallucination_rate',
      'Redis semantic cache (0.95)',
    ],
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="how-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="how-heading" className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            How it works — <span className="text-foreground">6-node LangGraph pipeline</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From GitHub URL to cited answer in ~3-7s. Every step is observable and evaluated.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" aria-hidden="true" />
          
          <div className="space-y-12 lg:space-y-20">
            {steps.map((step, index) => (
              <article
                key={step.number}
                className={`relative flex flex-col lg:flex-row lg:items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="relative z-10 flex items-start gap-4 lg:w-1/2 lg:pr-8 lg:text-right">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-accent flex items-center justify-center mx-auto lg:mx-0">
                    <step.icon className="h-8 w-8 text-accent-foreground" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-muted-foreground">{step.number}</span>
                    <h3 className="text-xl font-bold mt-1 mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-end lg:justify-end">
                      {step.details.map((detail) => (
                        <span
                          key={detail}
                          className="px-2.5 py-1 text-xs font-mono bg-muted rounded border border-border"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block lg:w-1/2 lg:flex lg:items-center lg:justify-center">
                    <ArrowRight className="h-8 w-8 text-muted-foreground/30" aria-hidden="true" />
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}