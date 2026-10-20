'use client'

import { SiteHeader } from '@/components/site-header'
import { Terminal, Github, CheckCircle, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const steps = [
  {
    title: 'Prerequisites',
    description: 'Docker & Docker Compose, Node 20+, Python 3.12+, GROQ_API_KEY, OPENAI_API_KEY',
    commands: [],
  },
  {
    title: 'Clone & Configure',
    description: 'Get the code and add your API keys',
    commands: [
      'git clone https://github.com/JeremiahShadams/Citer',
      'cd Citer',
      'cp .env.example .env',
      '# Edit .env with your GROQ_API_KEY and OPENAI_API_KEY',
    ],
  },
  {
    title: 'Start with Docker (Recommended)',
    description: 'One command spins up Postgres, Redis, Backend, and Frontend',
    commands: [
      'docker compose up -d --build',
      '# Postgres :5432  Redis :6379  Backend :8000',
    ],
  },
  {
    title: 'Or Run for Development',
    description: 'Hot reload on host for faster iteration',
    commands: [
      'make up              # Build + start all containers',
      'make dev-backend     # cd backend && uvicorn app.main:app --reload',
    ],
  },
  {
    title: 'Index a Repository',
    description: 'Shallow clone + parse + embed any GitHub repo',
    commands: [
      'curl -X POST http://localhost:8000/api/index \\',
      '  -H "Content-Type: application/json" \\',
      '  -d \'{"repo_url":"https://github.com/user/repo"}\'',
    ],
  },
  {
    title: 'Ask Questions (Streaming)',
    description: 'Get cited answers via SSE or open the UI',
    commands: [
      'curl -N -X POST http://localhost:8000/api/ask \\',
      '  -H "Content-Type: application/json" \\',
      '  -d \'{"question":"Where is auth handled?","repo_url":"https://github.com/user/repo"}\'',
      '',
      '# Or open the UI',
      'open http://localhost:8000',
    ],
  },
]

export default function TryPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Try Citer <span className="text-foreground">locally</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Run the full stack in Docker or develop with hot reload. Both paths take ~2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {steps.map((step, index) => (
                <article key={step.title} className="rounded-xl border border-border bg-background overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-mono font-bold text-sm">
                        {index + 1}
                      </span>
                      <div>
                        <h2 className="text-lg font-semibold">{step.title}</h2>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  {step.commands.length > 0 && (
                    <div className="p-4 bg-muted/30">
                      <div className="font-mono text-sm space-y-1.5">
                        {step.commands.map((cmd, cmdIndex) => (
                          <div
                            key={cmdIndex}
                            className="flex items-center gap-3 px-3 py-2 rounded bg-background border border-border group"
                          >
                            <code className="flex-1 text-foreground break-all">{cmd}</code>
                            <button
                              onClick={() => copyToClipboard(cmd, index * 100 + cmdIndex)}
                              className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors opacity-0 group-hover:opacity-100"
                              aria-label="Copy command"
                            >
                              {copiedIndex === index * 100 + cmdIndex ? (
                                <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                              ) : (
                                <Copy className="h-4 w-4" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-xl border border-border bg-background p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Terminal className="h-5 w-5" aria-hidden="true" />
                    Quick Start
                  </h3>
                  <div className="font-mono text-sm space-y-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
                      <span>docker compose up -d --build</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
                      <span>curl -X POST localhost:8000/api/index ...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
                      <span>curl -N -X POST localhost:8000/api/ask ...</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Github className="h-5 w-5" aria-hidden="true" />
                    Repository
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Full source, issues, and contributing guide on GitHub.
                  </p>
                  <Link
                    href="https://github.com/JeremiahShadams/Citer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-transparent border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    <span>View on GitHub</span>
                  </Link>
                </div>

                <div className="rounded-xl border border-border bg-muted/50 p-6">
                  <h3 className="font-semibold mb-3">Need help?</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>Check <a href="/docs" className="underline hover:text-foreground">Documentation</a></li>
                    <li>Open a <a href="https://github.com/JeremiahShadams/Citer/issues" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">GitHub Issue</a></li>
                    <li>Read <a href="https://github.com/JeremiahShadams/Citer/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Contributing Guide</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}