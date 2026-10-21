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
  GitBranch,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------- */
/*  Demo Specification Data                                              */
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
      {/* Subtle stage glow */}
      <div
        className="pointer-events-none absolute -inset-x-6 -inset-y-10 select-none"
        aria-hidden="true"
      >
        <div className="mx-auto h-full w-[94%] rounded-3xl bg-[radial-gradient(ellipse_at_top,rgba(20,232,198,0.07),transparent_65%)]" />
      </div>

      {/* Main Product Window */}
      <figure
        aria-label="Citer product interface: asking question, grounded answer, and cited source code"
        className={cn(
          'relative z-10 w-full overflow-hidden rounded-2xl border border-porcelain/[0.09] bg-[#0C0E10]',
          'shadow-[0_1px_0_0_rgba(245,247,250,0.06)_inset,0_32px_80px_-24px_rgba(0,0,0,0.95)]'
        )}
      >
        {/* ---- Window Titlebar ---- */}
        <div className="flex h-12 items-center justify-between border-b border-porcelain/[0.07] bg-obsidian/70 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Citer Mark */}
            <div className="flex items-center gap-2">
              <span className="flex size-4 items-center justify-center">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
                  <path d="M7 3H3v14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-porcelain" />
                  <path d="M13 3h4v14h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-porcelain" />
                  <rect x="8" y="8.5" width="4" height="3" className="fill-mint" />
                </svg>
              </span>
              <span className="font-sans text-[13.5px] font-semibold text-porcelain">Citer</span>
            </div>

            <span className="text-steel/30">/</span>

            {/* Context breadcrumb */}
            <div className="flex items-center gap-2 font-mono text-[12px] text-steel">
              <FolderGit2 className="size-3.5 text-steel/70" aria-hidden="true" />
              <span className="text-porcelain/90">{repoName}</span>
              <span className="text-steel/30">/</span>
              <GitBranch className="size-3 text-steel/60" aria-hidden="true" />
              <span>main</span>
            </div>
          </div>

          {/* Right Action: Replay sequence */}
          <div className="flex items-center gap-2">
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

        {/* ---- App Body: Sidebar + Main Workspace ---- */}
        <div className="flex min-h-[460px] flex-col md:flex-row">
          {/* Inner Sidebar (hidden on mobile, visible on desktop/tablet) */}
          <aside className="hidden w-[200px] shrink-0 flex-col border-r border-porcelain/[0.06] bg-obsidian/40 p-4 md:flex">
            <div className="flex flex-col gap-4">
              {/* Repository Selector */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-steel/60">
                  Repository
                </p>
                <div className="mt-1.5 flex items-center justify-between rounded-lg border border-porcelain/[0.07] bg-porcelain/[0.03] px-2.5 py-1.5 text-porcelain shadow-sm">
                  <div className="flex min-w-0 items-center gap-2">
                    <FolderGit2 className="size-3.5 text-mint shrink-0" aria-hidden="true" />
                    <span className="truncate font-mono text-[12px] font-medium">{repoName}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav aria-label="Demo Sidebar" className="flex flex-col gap-0.5">
                {sidebarNav.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.name}
                      type="button"
                      tabIndex={-1}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors',
                        item.active
                          ? 'bg-porcelain/[0.07] font-medium text-porcelain'
                          : 'text-steel hover:bg-porcelain/[0.03] hover:text-porcelain'
                      )}
                    >
                      <Icon className={cn('size-3.5', item.active ? 'text-mint' : 'text-steel/70')} aria-hidden="true" />
                      <span>{item.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main Workspace Area - Unmistakable Focus on Question → Answer → Cited Code */}
          <div className="relative flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-7">
            {/* Search / Question Input Bar */}
            <div className="flex items-center gap-3 rounded-xl border border-porcelain/[0.08] bg-obsidian/90 px-4 py-3 shadow-sm">
              <Search className="size-4 shrink-0 text-mint" aria-hidden="true" />
              <p className="flex-1 truncate text-[14px] text-porcelain font-normal">
                {questionText}
              </p>
              <kbd className="hidden rounded border border-porcelain/[0.1] bg-porcelain/[0.04] px-2 py-0.5 font-mono text-[10.5px] text-steel md:inline-block">
                ⌘K
              </kbd>
            </div>

            {/* Grounded Answer Card with Prominent Interactive Citation */}
            <div
              className={cn(
                'rounded-xl border border-porcelain/[0.08] bg-surface-raised/95 p-4 sm:p-5 shadow-sm',
                'transition-[opacity,transform] duration-300 ease-out-expo motion-reduce:transition-none',
                answerVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/10 text-mint">
                  <Terminal className="size-3.5" aria-hidden="true" />
                </span>
                <div className="text-[14.5px] leading-relaxed text-porcelain/90">
                  <span>The payment validation happens in </span>
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredCitation(true)}
                    onMouseLeave={() => setHoveredCitation(false)}
                    onClick={() => setHoveredCitation((v) => !v)}
                    title="Click to highlight cited lines"
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[12.5px] font-medium transition-all cursor-pointer',
                      highlighted
                        ? 'border-mint/60 bg-mint/15 text-mint shadow-[0_0_12px_rgba(20,232,198,0.2)]'
                        : 'border-porcelain/[0.14] bg-porcelain/[0.05] text-porcelain hover:border-mint/40 hover:text-mint'
                    )}
                  >
                    <FileCode2 className="size-3.5 text-mint shrink-0" aria-hidden="true" />
                    <span>{citationFile}:{citationRange}</span>
                  </button>
                  <span> before the settlement is processed.</span>
                </div>
              </div>
            </div>

            {/* Cited Source Code Pane */}
            <div
              className={cn(
                'overflow-hidden rounded-xl border border-porcelain/[0.08] bg-obsidian/90 shadow-sm',
                'transition-[opacity,transform] duration-400 ease-out-expo motion-reduce:transition-none',
                codeVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              )}
            >
              {/* Code card top bar */}
              <div className="flex h-10 items-center justify-between border-b border-porcelain/[0.07] bg-surface-raised/70 px-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  <FileCode2 className="size-3.5 text-mint shrink-0" aria-hidden="true" />
                  <span className="truncate font-mono text-[12.5px] text-porcelain font-medium">
                    {citationFile}
                  </span>
                  <span className="rounded border border-porcelain/[0.08] bg-porcelain/[0.05] px-2 py-0.5 font-mono text-[11px] font-medium text-[#B8C0CC]">
                    {citationRange}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={copyCode}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11.5px] text-steel transition-colors hover:bg-porcelain/[0.06] hover:text-porcelain"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-mint" />
                      <span className="text-mint">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Lines with Syntax Highlighting */}
              <pre className="overflow-x-auto py-3 font-mono text-[12.5px] leading-[1.7]">
                <code>
                  {codeSnippet.map((line) => {
                    const isLit = line.cited && highlighted
                    return (
                      <div
                        key={line.num}
                        className={cn(
                          'relative flex min-w-max pr-6 transition-colors duration-150',
                          isLit ? 'bg-mint/[0.09]' : 'hover:bg-porcelain/[0.02]'
                        )}
                      >
                        {/* Indicator Accent Line */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute inset-y-0 left-0 w-[3px] transition-colors duration-150',
                            isLit ? 'bg-mint' : 'bg-transparent'
                          )}
                        />
                        {/* Line number */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'w-12 shrink-0 select-none pr-4 text-right transition-colors duration-150 font-mono',
                            isLit ? 'text-mint font-semibold' : 'text-steel/50'
                          )}
                        >
                          {line.num}
                        </span>
                        {/* Code Content */}
                        <span
                          className={cn(
                            'transition-opacity duration-150',
                            line.cited || !highlighted
                              ? 'opacity-100'
                              : 'opacity-55'
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
  return <span className="text-porcelain/85">{parts}</span>
}
