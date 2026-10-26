'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Compass,
  FileCode2,
  FolderGit2,
  FolderOpen,
  RotateCcw,
  Search,
  Check,
  Copy,
  Terminal,
  Code2,
  GitBranch,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers,
  Activity,
  CheckCircle2,
  Server,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SiteHeader } from '@/components/site-header'
import {
  DEMO_REPOSITORIES,
  DemoRepo,
  PresetQA,
  CodeFile,
} from '@/lib/demo-workspaces'

export default function TryPage() {
  const [selectedRepoId, setSelectedRepoId] = useState<string>('payments-service')
  const [activeTab, setActiveTab] = useState<'workspace' | 'setup'>('workspace')
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null)

  // Current active repository
  const repo: DemoRepo =
    DEMO_REPOSITORIES.find((r) => r.id === selectedRepoId) ||
    DEMO_REPOSITORIES[0]

  // Query & Answer State
  const [query, setQuery] = useState<string>(repo.presetQAs[0].question)
  const [currentQA, setCurrentQA] = useState<PresetQA>(repo.presetQAs[0])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [activeNode, setActiveNode] = useState<string>('synthesize')
  const [selectedFile, setSelectedFile] = useState<CodeFile>(repo.files[0])
  const [highlightedRange, setHighlightedRange] = useState<{
    start: number
    end: number
  }>(repo.presetQAs[0].citedRange)
  const [copiedCode, setCopiedCode] = useState<boolean>(false)
  const [copiedLink, setCopiedLink] = useState<boolean>(false)
  const [customRepoUrl, setCustomRepoUrl] = useState<string>('')
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false)
  const codeContainerRef = useRef<HTMLPreElement>(null)

  // Ping backend on mount
  useEffect(() => {
    let cancelled = false
    fetch('http://localhost:8000/health', { method: 'GET' })
      .then((res) => {
        if (!cancelled) setBackendOnline(res.ok)
      })
      .catch(() => {
        if (!cancelled) setBackendOnline(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // When repo changes, reset file and question
  const handleSelectRepo = (repoId: string) => {
    const nextRepo =
      DEMO_REPOSITORIES.find((r) => r.id === repoId) || DEMO_REPOSITORIES[0]
    setSelectedRepoId(repoId)
    const firstQA = nextRepo.presetQAs[0]
    setCurrentQA(firstQA)
    setQuery(firstQA.question)
    const targetFile =
      nextRepo.files.find((f) => f.path === firstQA.citedFile) ||
      nextRepo.files[0]
    setSelectedFile(targetFile)
    setHighlightedRange(firstQA.citedRange)
    setActiveNode('synthesize')
  }

  // Handle question submit
  const handleAsk = useCallback(
    (customText?: string) => {
      const q = (customText || query).trim()
      if (!q) return

      setIsProcessing(true)

      // Find matching preset or default
      const matched =
        repo.presetQAs.find(
          (p) => p.question.toLowerCase() === q.toLowerCase()
        ) || repo.presetQAs[0]

      // Step-by-step LangGraph node animation
      const steps = ['planner', 'retrieve', 'file_reader', 'synthesize']
      let stepIdx = 0

      const interval = setInterval(() => {
        stepIdx++
        if (stepIdx < steps.length) {
          setActiveNode(steps[stepIdx])
        } else {
          clearInterval(interval)
          setIsProcessing(false)
          setCurrentQA(matched)
          const targetFile =
            repo.files.find((f) => f.path === matched.citedFile) ||
            repo.files[0]
          setSelectedFile(targetFile)
          setHighlightedRange(matched.citedRange)
        }
      }, 260)
    },
    [query, repo]
  )

  // Navigate to citation in code pane
  const handleJumpToCitation = (filePath: string, range: { start: number; end: number }) => {
    const file = repo.files.find((f) => f.path === filePath)
    if (file) {
      setSelectedFile(file)
      setHighlightedRange(range)
      // Smooth scroll line into view
      setTimeout(() => {
        const lineEl = document.getElementById(`line-${range.start}`)
        lineEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
    }
  }

  const copyCodeToClipboard = () => {
    const text = selectedFile.lines.join('\n')
    navigator.clipboard?.writeText(text)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const copyCitationLink = () => {
    const link = `https://github.com/citer-demo/${repo.name}/blob/main/${selectedFile.path}#L${highlightedRange.start}-L${highlightedRange.end}`
    navigator.clipboard?.writeText(link)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="min-h-screen bg-obsidian text-porcelain">
      <SiteHeader />

      <main className="mx-auto max-w-[1400px] px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        {/* Top Control Bar: Mode Switcher & Backend Health */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-porcelain/[0.08] bg-[#0E1114] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('workspace')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-[13.5px] font-medium transition-colors',
                activeTab === 'workspace'
                  ? 'bg-mint text-obsidian'
                  : 'text-steel hover:bg-porcelain/[0.04] hover:text-porcelain'
              )}
            >
              <Sparkles className="size-4" />
              <span>Interactive Workspace</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('setup')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-[13.5px] font-medium transition-colors',
                activeTab === 'setup'
                  ? 'bg-porcelain/[0.1] text-porcelain'
                  : 'text-steel hover:bg-porcelain/[0.04] hover:text-porcelain'
              )}
            >
              <Server className="size-4" />
              <span>Local CLI & Docker Stack</span>
            </button>
          </div>

          {/* Backend Connection Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-porcelain/[0.08] bg-obsidian/70 px-3 py-1 font-mono text-[11.5px]">
              <span
                className={cn(
                  'size-2 rounded-full',
                  backendOnline
                    ? 'bg-mint animate-pulse shadow-[0_0_8px_rgba(20,232,198,0.6)]'
                    : 'bg-steel/40'
                )}
              />
              <span className="text-steel">FastAPI Engine:</span>
              <span
                className={cn(
                  'font-medium',
                  backendOnline ? 'text-mint' : 'text-steel'
                )}
              >
                {backendOnline === null
                  ? 'Checking...'
                  : backendOnline
                  ? 'Online (:8000)'
                  : 'Local Standby (Instant AST)'}
              </span>
            </div>
          </div>
        </div>

        {/* WORKSPACE VIEW */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            {/* Repository Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-porcelain/[0.08] bg-[#0E1114] p-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-steel/60">
                  <FolderGit2 className="size-3.5 text-steel/70" />
                  <span>Repository:</span>
                </span>
                {DEMO_REPOSITORIES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRepo(r.id)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg border px-3 py-1 font-mono text-[12.5px] font-medium transition-all',
                      selectedRepoId === r.id
                        ? 'border-mint/60 bg-mint/15 text-mint shadow-[0_0_12px_rgba(20,232,198,0.15)]'
                        : 'border-porcelain/[0.08] bg-porcelain/[0.02] text-steel hover:border-porcelain/[0.18] hover:text-porcelain'
                    )}
                  >
                    <span>{r.name}</span>
                    <span className="rounded bg-porcelain/[0.06] px-1.5 py-0.2 text-[10px] text-steel">
                      {r.language}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(true)}
                  className="flex items-center gap-1 rounded-lg border border-dashed border-porcelain/[0.15] px-2.5 py-1 font-mono text-[11.5px] text-steel hover:border-porcelain/[0.3] hover:text-porcelain"
                >
                  <span>+ Custom Repo</span>
                </button>
              </div>

              <div className="hidden items-center gap-3 font-mono text-[12px] text-steel/70 lg:flex">
                <span>Branch: <span className="text-porcelain">{repo.branch}</span></span>
                <span>•</span>
                <span>{repo.symbolCount} AST Symbols</span>
                <span>•</span>
                <span>{repo.fileCount} Indexed Files</span>
              </div>
            </div>

            {/* Main Interactive Dual-Pane Stage */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* LEFT COLUMN: Question & Grounded Reasoning (5 cols) */}
              <div className="flex flex-col gap-5 lg:col-span-5">
                {/* Search & Prompt Box */}
                <div className="rounded-xl border border-porcelain/[0.1] bg-[#0E1114] p-4 shadow-sm">
                  <label
                    htmlFor="question-input"
                    className="mb-2 block font-mono text-[11.5px] uppercase tracking-wider text-steel/70"
                  >
                    Ask your codebase
                  </label>
                  <div className="relative">
                    <input
                      id="question-input"
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                      placeholder="Ask anything about functions, logic, or symbols..."
                      className="w-full rounded-lg border border-porcelain/[0.1] bg-obsidian py-2.5 pl-3.5 pr-10 text-[14px] text-porcelain placeholder-steel/40 focus:border-mint/50 focus:outline-none focus:ring-1 focus:ring-mint/50"
                    />
                    <button
                      type="button"
                      onClick={() => handleAsk()}
                      disabled={isProcessing}
                      aria-label="Submit question"
                      className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-md bg-mint text-obsidian transition-transform hover:scale-105 disabled:opacity-50"
                    >
                      <ArrowRight className="size-4" />
                    </button>
                  </div>

                  {/* Preset Question Suggestions */}
                  <div className="mt-3">
                    <p className="mb-1.5 font-mono text-[11px] text-steel/50">
                      Suggested prompts for {repo.name}:
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {repo.presetQAs.map((qa) => (
                        <button
                          key={qa.question}
                          type="button"
                          onClick={() => {
                            setQuery(qa.question)
                            handleAsk(qa.question)
                          }}
                          className={cn(
                            'truncate rounded-md px-2.5 py-1 text-left text-[12.5px] transition-colors',
                            query === qa.question
                              ? 'bg-porcelain/[0.06] text-mint font-medium'
                              : 'text-steel hover:bg-porcelain/[0.03] hover:text-porcelain'
                          )}
                        >
                          → {qa.question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* LangGraph Agent Pipeline Visualizer */}
                <div className="rounded-xl border border-porcelain/[0.08] bg-[#0E1114] p-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-steel/70">
                      <Activity className="size-3 text-mint" />
                      <span>LangGraph Execution Graph</span>
                    </span>
                    <span className="font-mono text-[10.5px] text-mint">
                      {isProcessing ? 'Tracing code...' : 'Completed'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px]">
                    {[
                      { id: 'planner', label: '1. Planner' },
                      { id: 'retrieve', label: '2. Retriever' },
                      { id: 'file_reader', label: '3. FileReader' },
                      { id: 'synthesize', label: '4. Synthesizer' },
                    ].map((n) => {
                      const isActive = activeNode === n.id
                      const isDone = !isProcessing || activeNode === 'synthesize'
                      return (
                        <div
                          key={n.id}
                          className={cn(
                            'rounded-md border py-1 transition-all',
                            isActive && isProcessing
                              ? 'border-mint bg-mint/20 text-mint animate-pulse'
                              : isDone
                              ? 'border-porcelain/[0.08] bg-porcelain/[0.02] text-porcelain/80'
                              : 'border-porcelain/[0.04] text-steel/40'
                          )}
                        >
                          {n.label}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Grounded Synthesized Answer */}
                <div className="rounded-xl border border-porcelain/[0.1] bg-[#0E1114] p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between border-b border-porcelain/[0.07] pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex size-5 items-center justify-center rounded-full bg-mint/15 text-mint">
                        <Terminal className="size-3" />
                      </div>
                      <span className="font-sans text-[13px] font-semibold text-porcelain">
                        Grounded Synthesis
                      </span>
                    </div>
                    <span className="rounded bg-mint/10 px-2 py-0.5 font-mono text-[10.5px] font-medium text-mint">
                      {currentQA.confidence}
                    </span>
                  </div>

                  {/* Answer text */}
                  <div className="text-[14px] leading-relaxed text-porcelain/90">
                    <p>{currentQA.answer}</p>
                  </div>

                  {/* Verifiable Citation Chip */}
                  <div className="mt-4 pt-3 border-t border-porcelain/[0.07]">
                    <p className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-steel/60">
                      Verifiable Source Citation:
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleJumpToCitation(
                          currentQA.citedFile,
                          currentQA.citedRange
                        )
                      }
                      title="Click to view file in inspector"
                      className="group flex w-full items-center justify-between rounded-lg border border-mint/40 bg-mint/[0.08] px-3 py-2 text-left transition-all hover:bg-mint/15"
                    >
                      <div className="flex items-center gap-2">
                        <FileCode2 className="size-4 text-mint" />
                        <span className="font-mono text-[12.5px] font-medium text-mint">
                          {currentQA.citedFile}
                        </span>
                        <span className="rounded bg-mint/20 px-1.5 py-0.5 font-mono text-[10.5px] text-mint">
                          L{currentQA.citedRange.start}–L{currentQA.citedRange.end}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-mint/80 group-hover:translate-x-0.5 transition-transform">
                        Inspect →
                      </span>
                    </button>
                  </div>

                  {/* AST Match Symbol */}
                  <div className="mt-3 rounded-lg border border-porcelain/[0.06] bg-obsidian/70 p-2.5 font-mono text-[11px] text-steel">
                    <span className="text-steel/50">AST Match: </span>
                    <span className="text-porcelain">{currentQA.astSymbol}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Full-Featured Code Inspector (7 cols) */}
              <div className="flex flex-col rounded-xl border border-porcelain/[0.1] bg-[#0A0D10] shadow-xl lg:col-span-7">
                {/* File Tab Selector */}
                <div className="flex h-11 items-center justify-between border-b border-porcelain/[0.08] bg-[#0D1013] px-3">
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {repo.files.map((file) => (
                      <button
                        key={file.name}
                        type="button"
                        onClick={() => {
                          setSelectedFile(file)
                          if (file.path === currentQA.citedFile) {
                            setHighlightedRange(currentQA.citedRange)
                          } else {
                            setHighlightedRange({ start: 0, end: 0 })
                          }
                        }}
                        className={cn(
                          'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[12px] transition-colors',
                          selectedFile.path === file.path
                            ? 'bg-porcelain/[0.08] text-porcelain font-medium'
                            : 'text-steel hover:bg-porcelain/[0.03] hover:text-porcelain'
                        )}
                      >
                        <FileCode2 className="size-3.5 text-mint" />
                        <span>{file.name}</span>
                        {file.path === currentQA.citedFile && (
                          <span className="size-1.5 rounded-full bg-mint" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Code Actions: Copy code & Copy link */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={copyCitationLink}
                      title="Copy citation permalink"
                      className="hidden items-center gap-1 rounded px-2 py-1 font-mono text-[11px] text-steel transition-colors hover:bg-porcelain/[0.06] hover:text-porcelain sm:inline-flex"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="size-3 text-mint" />
                          <span className="text-mint">Link copied</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="size-3" />
                          <span>Copy link</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={copyCodeToClipboard}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-[11px] text-steel transition-colors hover:bg-porcelain/[0.06] hover:text-porcelain"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="size-3 text-mint" />
                          <span className="text-mint">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* File Breadcrumb Header */}
                <div className="flex h-8 items-center justify-between border-b border-porcelain/[0.06] bg-obsidian/40 px-4 font-mono text-[11px] text-steel">
                  <div className="flex items-center gap-2 truncate">
                    <span>{repo.name}</span>
                    <span className="text-steel/30">/</span>
                    <span className="text-porcelain">{selectedFile.path}</span>
                  </div>
                  {selectedFile.path === currentQA.citedFile && (
                    <span className="rounded bg-mint/10 px-1.5 py-0.2 text-[10.5px] font-medium text-mint">
                      Lines {highlightedRange.start}–{highlightedRange.end} cited
                    </span>
                  )}
                </div>

                {/* Monospace Code Editor Pane with Line Numbers */}
                <pre
                  ref={codeContainerRef}
                  className="max-h-[580px] overflow-auto py-3 font-mono text-[12.5px] leading-[1.7]"
                >
                  <code>
                    {selectedFile.lines.map((line, idx) => {
                      const lineNum = idx + 1
                      const isCited =
                        selectedFile.path === currentQA.citedFile &&
                        lineNum >= highlightedRange.start &&
                        lineNum <= highlightedRange.end

                      return (
                        <div
                          id={`line-${lineNum}`}
                          key={lineNum}
                          className={cn(
                            'relative flex min-w-max pr-6 transition-colors duration-150',
                            isCited
                              ? 'bg-mint/[0.09]'
                              : 'hover:bg-porcelain/[0.02]'
                          )}
                        >
                          {/* Active Line Accent Marker */}
                          <span
                            aria-hidden="true"
                            className={cn(
                              'absolute inset-y-0 left-0 w-[3px] transition-colors',
                              isCited ? 'bg-mint' : 'bg-transparent'
                            )}
                          />
                          {/* Line Number */}
                          <span
                            aria-hidden="true"
                            className={cn(
                              'w-12 shrink-0 select-none pr-4 text-right transition-colors font-mono',
                              isCited
                                ? 'text-mint font-semibold'
                                : 'text-steel/40'
                            )}
                          >
                            {lineNum}
                          </span>
                          {/* Line Content */}
                          <span
                            className={cn(
                              'transition-opacity',
                              isCited
                                ? 'opacity-100 font-medium'
                                : 'opacity-70'
                            )}
                          >
                            {line || ' '}
                          </span>
                        </div>
                      )
                    })}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* SETUP & DOCKER GUIDE VIEW */}
        {activeTab === 'setup' && (
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="rounded-xl border border-porcelain/[0.08] bg-[#0E1114] p-6 shadow-sm">
              <h2 className="text-[20px] font-semibold text-porcelain">
                Run Citer on your own machine
              </h2>
              <p className="mt-1 text-[14px] text-steel">
                The full stack runs with Docker Compose in under two minutes:
                PostgreSQL with pgvector, Redis cache, FastAPI LangGraph backend,
                and Next.js frontend.
              </p>

              <div className="mt-6 space-y-4">
                {[
                  {
                    title: '1. Clone & Configure',
                    code: 'git clone https://github.com/JeremiahShadams/Citer\ncd Citer\ncp .env.example .env\n# Edit .env with your GROQ_API_KEY and OPENAI_API_KEY',
                  },
                  {
                    title: '2. Spin up containers',
                    code: 'docker compose up -d --build\n# Postgres: 5432 | Redis: 6379 | Backend: 8000 | Web: 3000',
                  },
                  {
                    title: '3. Index any public GitHub repository',
                    code: 'curl -X POST http://localhost:8000/api/index \\\n  -H "Content-Type: application/json" \\\n  -d \'{"repo_url": "https://github.com/fastapi/fastapi"}\'',
                  },
                  {
                    title: '4. Ask a question via API (streaming SSE)',
                    code: 'curl -N -X POST http://localhost:8000/api/ask \\\n  -H "Content-Type: application/json" \\\n  -d \'{"question": "Where are route dependencies solved?", "repo_url": "https://github.com/fastapi/fastapi"}\'',
                  },
                ].map((s) => (
                  <div
                    key={s.title}
                    className="overflow-hidden rounded-lg border border-porcelain/[0.08] bg-obsidian"
                  >
                    <div className="border-b border-porcelain/[0.06] bg-surface-raised px-4 py-2 text-[13px] font-medium text-porcelain">
                      {s.title}
                    </div>
                    <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-porcelain/90">
                      <code>{s.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Custom Repo Modal */}
        {isCustomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-porcelain/[0.1] bg-[#0E1114] p-6 shadow-2xl">
              <h3 className="text-[17px] font-semibold text-porcelain">
                Connect GitHub Repository
              </h3>
              <p className="mt-1 text-[13px] text-steel">
                Enter any public GitHub repository URL to index its Tree-sitter
                AST and symbols.
              </p>

              <div className="mt-4">
                <input
                  type="url"
                  value={customRepoUrl}
                  onChange={(e) => setCustomRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  className="w-full rounded-lg border border-porcelain/[0.1] bg-obsidian px-3.5 py-2 text-[13.5px] text-porcelain placeholder-steel/40 focus:border-mint/50 focus:outline-none"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="rounded-lg px-3.5 py-1.5 text-[13px] text-steel hover:text-porcelain"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomModalOpen(false)
                    if (customRepoUrl.trim()) {
                      handleSelectRepo('payments-service')
                    }
                  }}
                  className="rounded-lg bg-mint px-4 py-1.5 text-[13px] font-medium text-obsidian hover:brightness-110"
                >
                  Index Repository
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
