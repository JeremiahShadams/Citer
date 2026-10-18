'use client'

const stack = [
  {
    category: 'Frontend',
    items: [
      { name: 'Next.js 14', description: 'App Router, Server Components' },
      { name: 'React 18', description: 'Concurrent features, Suspense' },
      { name: 'TypeScript 5', description: 'Strict mode, type safety' },
      { name: 'Tailwind CSS', description: 'Utility-first, dark mode' },
      { name: 'react-markdown', description: 'Citation-aware rendering' },
      { name: 'SSE Client', description: 'Native EventSource streaming' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Python 3.12', description: 'Modern async/await' },
      { name: 'FastAPI', description: 'Auto OpenAPI, validation' },
      { name: 'SQLAlchemy 2.0', description: 'Async ORM, typed queries' },
      { name: 'psycopg[binary]', description: 'PostgreSQL driver' },
      { name: 'pgvector', description: 'Vector similarity search' },
      { name: 'LangGraph 1.x', description: 'Stateful agent orchestration' },
    ],
  },
  {
    category: 'AI / ML',
    items: [
      { name: 'OpenAI GPT-4o', description: 'Streaming, temperature=0' },
      { name: 'text-embedding-3-large', description: '1536-dim (truncated 3072)' },
      { name: 'LangChain OpenAI', description: 'Structured output, callbacks' },
      { name: 'Tree-sitter', description: '12+ language AST parsing' },
    ],
  },
  {
    category: 'Infrastructure',
    items: [
      { name: 'PostgreSQL + pgvector', description: 'HNSW vector_cosine_ops' },
      { name: 'Redis 7', description: 'Semantic cache, sessions' },
      { name: 'Docker Compose', description: 'pgvector:pg16 + redis:7-alpine' },
      { name: 'GitHub Actions CI', description: 'Backend tests, typecheck' },
      { name: 'LangSmith', description: 'Tracing, evaluation' },
    ],
  },
]

export function TechStackSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30" aria-labelledby="stack-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="stack-heading" className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Technical <span className="text-foreground">stack</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Boring technology, sharp execution. Every choice justified by the problem it solves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stack.map((category) => (
            <article key={category.category} className="p-6 rounded-xl border border-border bg-background">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                {category.category}
              </h3>
              <dl className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.name} className="flex flex-col gap-1">
                    <dt className="font-medium text-foreground">{item.name}</dt>
                    <dd className="text-sm text-muted-foreground">{item.description}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}