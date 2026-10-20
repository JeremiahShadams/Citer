'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Compass,
  FileCode2,
  FolderGit2,
  FolderOpen,
  History,
  RotateCcw,
  Search,
  Check,
  Copy,
  Terminal,
  Code2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------- */
/*  Demo Data (Matches Mockup Spec)                                      */
/* -------------------------------------------------------------------- */
const repoName = 'payments-service'
const questionText = 'Where is the payment validation handled?'
const citationFile = 'payment-service/src/validation/validator.ts'
const citationRange = 'Lines 42–58'

const codeSnippet = [
  { num: 42, text: 'export async function validatePayment(' },
  { num: 43, text: '  payment: Payment,' },
  { num: 44, text: '): Promise<ValidationResult> {' },
  { num: 45, text: '  if (!isValid(payment)) {', cited: true },
  { num: 46, text: '    throw new ValidationError(', cited: true },
  { num: 47, text: "      'Invalid payment details'", cited: true },
  { num: 48, text: '    );', cited: true },
  { num: 49, text: '  }' },
  { num: 50, text: '// ...' },
]

const sidebarNav = [
  { name: 'Overview', icon: Compass },
  { name: 'Ask', icon: Search, active: true },
  { name: 'Files', icon: FolderOpen },
  { name: 'Symbols', icon: Code2 },
  { name: 'History', icon: History },
]

/* -------------------------------------------------------------------- */
/*  ProductPreview                                                       */
/* -------------------------------------------------------------------- */
export function ProductPreview() {
  const [step, setStep] = useState<number>(0)
  const [hoveredCitation, setHoveredCitation] = useState(false)
  const [copied, setCopied] = useState(false)
  const timers = useRef<number[]>([])

  const play = useCallback(() => {
    timers.current.forEach(clearTimeout)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(3)
      return
    }
    setStep(0)
    timers.current = [
      window.setTimeout(() => setStep(1), 350),
      window.setTimeout(() => setStep(2), 700),
      window.setTimeout(() => setStep(3), 1050),
    ]
  }, [])

  useEffect(() => {
    play()
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [play])

  const copyCode = () => {
    const text = codeSnippet.map((l) => l.text).join('\n')
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const answerVisible = step >= 1
  const codeVisible = step >= 2
  const highlighted = step >= 3 || hoveredCitation

  return (
    <div className="relative w-full">
      {/* 3D Depth Context Layer in background (visible on xl screens) */}
      <div
        className="pointer-events-none absolute -right-6 -top-4 hidden h-full w-[90%] select-none xl:block"
        aria-hidden="true"
      >
        <div className="absolute right-0 top-6 h-[85%] w-[380px] rounded-2xl border border-porcelain/[0.04] bg-surface/40 backdrop-blur-sm opacity-40 shadow-2xl transition-all [transform:rotate(3deg)_translateZ(-20px)]" />
        <div className="absolute right-6 top-12 h-[80%] w-[340px] rounded-2xl border border-porcelain/[0.03] bg-surface/30 opacity-20 transition-all [transform:rotate(6deg)_translateZ(-40px)]" />
        {/* Source connection line badge */}
        <div className="absolute -right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-full border border-mint/20 bg-obsidian/90 px-3 py-1 font-mono text-[11px] text-steel shadow-xl backdrop-blur-md">
          <span className="text-steel/50">—</span>
          <span>Source</span>
          <span className="text-mint font-medium">validator.ts:42-58</span>
        </div>
      </div>

      {/* Main Product Window */}
      <figure
        aria-label="Citer product interface: asking question, grounded answer, and cited source code"
        className={cn(
          'relative z-10 overflow-hidden rounded-2xl border border-porcelain/[0.08] bg-[#0E1012]',
          'shadow-[0_1px_0_0_rgba(245,247,250,0.04)_inset,0_24px_68px_-20px_rgba(0,0,0,0.85)]'
        )}
      >
        {/* ---- Window Top Bar ---- */}
        <div className="flex h-11 items-center justify-between border-b border-porcelain/[0.07] bg-obsidian/60 px-4">
          <div className="flex items-center gap-2">
            <span className="flex size-3.5 items-center justify-center">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="size-3.5" fill="none">
                <path d="M7 3H3v14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-porcelain" />
                <path d="M13 3h4v14h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-porcelain" />
                <rect x="8" y="8.5" width="4" height="3" className="fill-mint" />
              </svg>
            </span>
            <span className="font-sans text-[13px] font-semibold text-porcelain">Citer</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-1.5 rounded-full border border-porcelain/[0.07] bg-porcelain/[0.03] px-2.5 py-0.5 font-mono text-[11px] text-steel sm:inline-flex">
              <span className="size-1.5 rounded-full bg-mint animate-pulse" />
              Connected
            </span>
            <button
              type="button"
              onClick={play}
              title="Replay sequence"
              className="inline-flex size-7 items-center justify-center rounded-md text-steel transition-colors hover:bg-porcelain/[0.06] hover:text-porcelain"
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
              <span className="sr-only">Replay animation</span>
            </button>
          </div>
        </div>

        {/* ---- App Layout: Sidebar + Main Workspace ---- */}
        <div className="flex min-h-[460px]">
          {/* Inner Sidebar (hidden on small mobile, visible sm+) */}
          <aside className="hidden w-[168px] shrink-0 flex-col border-r border-porcelain/[0.06] bg-obsidian/40 p-3 sm:flex">
            <div className="mb-3 px-2">
              <p className="font-mono text-[10px] uppercase tracking-wider text-steel/60">
                Repository
              </p>
              <div className="mt-1.5 flex items-center gap-1.5 rounded-md border border-porcelain/[0.06] bg-porcelain/[0.03] px-2 py-1 text-porcelain">
                <FolderGit2 className="size-3.5 text-mint shrink-0" aria-hidden="true" />
                <span className="truncate font-mono text-[11.5px] font-medium">{repoName}</span>
              </div>
            </div>

            <nav aria-label="Demo Sidebar" className="flex flex-col gap-0.5">
              {sidebarNav.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.name}
                    type="button"
                    tabIndex={-1}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12.5px] transition-colors',
                      item.active
                        ? 'bg-porcelain/[0.06] font-medium text-porcelain'
                        : 'text-steel hover:bg-porcelain/[0.03] hover:text-porcelain'
                    )}
                  >
                    <Icon className={cn('size-3.5', item.active ? 'text-mint' : 'text-steel/70')} aria-hidden="true" />
                    <span>{item.name}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main Area */}
          <div className="flex min-w-0 flex-1 flex-col gap-3.5 p-3.5 sm:p-5">
            {/* Search / Question Input Bar */}
            <div className="flex items-center gap-2.5 rounded-lg border border-porcelain/[0.08] bg-obsidian/80 px-3 py-2.5 shadow-sm">
              <Search className="size-3.5 shrink-0 text-mint" aria-hidden="true" />
              <p className="flex-1 truncate text-[13.5px] text-porcelain">
                {questionText}
              </p>
              <kbd className="hidden rounded border border-porcelain/[0.1] bg-porcelain/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-steel md:inline-block">
                ⌘K
              </kbd>
            </div>

            {/* Grounded Answer Card */}
            <div
              className={cn(
                'rounded-lg border border-porcelain/[0.07] bg-surface-raised/90 p-3 sm:p-3.5 shadow-sm',
                'transition-[opacity,transform] duration-300 ease-out-expo motion-reduce:transition-none',
                answerVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              )}
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-mint/10 text-mint">
                  <Terminal className="size-3" aria-hidden="true" />
                </span>
                <div className="text-[13.5px] leading-relaxed text-porcelain/90">
                  <span>The payment validation happens in </span>
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredCitation(true)}
                    onMouseLeave={() => setHoveredCitation(false)}
                    onClick={() => setHoveredCitation((v) => !v)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[12px] font-medium transition-all',
                      highlighted
                        ? 'border-mint/60 bg-mint/15 text-mint'
                        : 'border-porcelain/[0.12] bg-porcelain/[0.04] text-porcelain hover:border-mint/40 hover:text-mint'
                    )}
                  >
                    <FileCode2 className="size-3 text-mint" aria-hidden="true" />
                    <span>{citationFile}</span>
                  </button>
                  <span> before the settlement is processed.</span>
                </div>
              </div>
            </div>

            {/* Cited Source Code Card */}
            <div
              className={cn(
                'overflow-hidden rounded-lg border border-porcelain/[0.08] bg-obsidian/90 shadow-sm',
                'transition-[opacity,transform] duration-400 ease-out-expo motion-reduce:transition-none',
                codeVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              )}
            >
              {/* Code card top bar */}
              <div className="flex h-9 items-center justify-between border-b border-porcelain/[0.07] bg-surface-raised/60 px-3">
                <div className="flex min-w-0 items-center gap-2">
                  <FileCode2 className="size-3.5 text-mint shrink-0" aria-hidden="true" />
                  <span className="truncate font-mono text-[12px] text-porcelain">
                    {citationFile}
                  </span>
                  <span className="rounded bg-porcelain/[0.05] px-1.5 py-0.5 font-mono text-[10.5px] text-steel">
                    {citationRange}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={copyCode}
                  className="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] text-steel transition-colors hover:bg-porcelain/[0.06] hover:text-porcelain"
                >
                  {copied ? (
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

              {/* Code Pane */}
              <pre className="overflow-x-auto py-2.5 font-mono text-[12px] leading-[1.65]">
                <code>
                  {codeSnippet.map((line) => {
                    const isLit = line.cited && highlighted
                    return (
                      <div
                        key={line.num}
                        className={cn(
                          'relative flex min-w-max pr-4 transition-colors duration-150',
                          isLit ? 'bg-mint/[0.09]' : 'hover:bg-porcelain/[0.02]'
                        )}
                      >
                        {/* Indicator bar */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute inset-y-0 left-0 w-[2.5px] transition-colors duration-150',
                            isLit ? 'bg-mint' : 'bg-transparent'
                          )}
                        />
                        {/* Line number */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'w-10 shrink-0 select-none pr-3 text-right transition-colors duration-150',
                            isLit ? 'text-mint font-semibold' : 'text-steel/40'
                          )}
                        >
                          {line.num}
                        </span>
                        {/* Line Content */}
                        <span
                          className={cn(
                            'transition-opacity duration-150',
                            line.cited || !highlighted
                              ? 'opacity-100'
                              : 'opacity-50'
                          )}
                        >
                          <Highlighted line={line.text} />
                        </span>
                      </div>
                    )
                  })}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </figure>
    </div>
  )
}

/* -------------------------------------------------------------------- */
/*  Syntax Highlighter                                                   */
/* -------------------------------------------------------------------- */
const tokenPattern =
  /(\/\*\*|\*\/|^\s*\*.*$|\/\/.*$)|('[^']*'|"[^"]*")|\b(export|async|function|return|if|throw|new|const)\b|\b([A-Z][A-Za-z]+)\b|\b([a-z][A-Za-z]+)(?=\()/g

function Highlighted({ line }: { line: string }) {
  if (!line) return <>{' '}</>
  const parts: React.ReactNode[] = []
  let last = 0
  for (const m of line.matchAll(tokenPattern)) {
    const idx = m.index ?? 0
    if (idx > last) parts.push(line.slice(last, idx))
    const [text, comment, str, kw, type, fn] = m
    const cls = comment
      ? 'text-steel/50 italic'
      : str
        ? 'text-mint'
        : kw
          ? 'text-porcelain font-medium'
          : type
            ? 'text-steel font-medium'
            : fn
              ? 'text-porcelain/95'
              : ''
    parts.push(
      <span key={idx} className={cls}>
        {text}
      </span>
    )
    last = idx + text.length
  }
  if (last < line.length) parts.push(line.slice(last))
  return <span className="text-porcelain/80">{parts}</span>
}
