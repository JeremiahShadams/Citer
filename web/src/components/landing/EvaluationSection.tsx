'use client'

import { BarChart, Target, Clock, AlertTriangle, CheckCircle, FileText } from 'lucide-react'

const metrics = [
  { label: 'Pass Rate', description: 'Expected files appear in cited files', icon: Target },
  { label: 'Hallucination Rate', description: 'Citations missing or out-of-range', icon: AlertTriangle },
  { label: 'Avg Latency', description: 'End-to-end p50 / p95 ms', icon: Clock },
  { label: 'Retrieval Precision', description: 'Relevant chunks in top-K', icon: BarChart },
]

const datasetCategories = [
  { name: 'Auth & Sessions', questions: 5, focus: 'JWT, middleware, session handling' },
  { name: 'Ingestion & AST', questions: 5, focus: 'Tree-sitter chunking, embeddings' },
  { name: 'DB & Hybrid Retrieval', questions: 5, focus: 'pgvector, FTS, symbol search, RRF' },
  { name: 'LangGraph & Tools', questions: 5, focus: 'Planner, router, file_reader, synthesizer' },
  { name: 'API & Streaming', questions: 5, focus: 'SSE, citations, sessions, evaluation' },
]

export function EvaluationSection() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="eval-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="eval-heading" className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Evaluated — <span className="text-foreground">25-question golden dataset</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Not vibes. Measured pass_rate, hallucination_rate, and latency against a fixed benchmark.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric) => (
            <article key={metric.label} className="p-6 rounded-xl border border-border bg-background">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent text-accent-foreground mb-4">
                <metric.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold mb-1">{metric.label}</h3>
              <p className="text-sm text-muted-foreground">{metric.description}</p>
            </article>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold">Golden Dataset — 25 Questions Across 5 Categories</h3>
          </div>
          <div className="divide-y divide-border">
            {datasetCategories.map((cat) => (
              <div key={cat.name} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <FileText className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-medium">{cat.name}</h4>
                    <p className="text-sm text-muted-foreground">{cat.focus}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-mono bg-muted px-2 py-1 rounded">{cat.questions} Qs</span>
                  <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
                  <span>In evaluation harness</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 rounded-xl border border-border bg-muted/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="font-semibold">Run the evaluation yourself</h4>
              <p className="text-sm text-muted-foreground mt-1">
                The harness is wired. Run <code className="font-mono bg-muted px-1.5 py-0.5 rounded">make eval</code> 
                and record results in ONE_PAGER.md before sharing.
              </p>
            </div>
            <div className="flex gap-3">
              <code className="font-mono bg-muted px-4 py-2 rounded border border-border text-sm">
                make eval
              </code>
              <code className="font-mono bg-muted px-4 py-2 rounded border border-border text-sm">
                cd backend && python -m scripts.eval
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}