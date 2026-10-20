'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FileCode2, RotateCcw, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  codeLines,
  codeStartLine,
  previewAnswer,
  previewCitation,
  previewFiles,
  previewQuestion,
  previewRepo,
} from '@/lib/preview-data'

/* -------------------------------------------------------------------- */
/*  Animation schedule                                                   */
/* -------------------------------------------------------------------- */
const STEP = { question: 0, answer: 4, citation: 5, evidence: 6 } as const
const FINAL = STEP.evidence
const schedule = [300, 355, 410, 760, 940, 1120]

/* -------------------------------------------------------------------- */
/*  ProductPreview                                                       */
/* -------------------------------------------------------------------- */
export function ProductPreview() {
  const [step, setStep] = useState<number>(STEP.question)
  const [hovered, setHovered] = useState(false)
  const timers = useRef<number[]>([])

  const play = useCallback(() => {
    timers.current.forEach(clearTimeout)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(FINAL)
      return
    }
    setStep(STEP.question)
    timers.current = schedule.map((ms, i) =>
      window.setTimeout(() => setStep(i + 1), ms)
    )
  }, [])

  useEffect(() => {
    play()
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [play])

  const evidenceActive = step >= STEP.evidence || hovered
  const answerVisible = step >= STEP.answer
  const citationVisible = step >= STEP.citation

  return (
    <figure
      aria-label="Citer product preview: an illustrative question, answer, and cited source code"
      className={cn(
        'overflow-hidden rounded-xl border border-porcelain/[0.08] bg-surface',
        'shadow-[0_1px_0_0_rgba(245,247,250,0.03)_inset,0_40px_80px_-40px_rgba(0,0,0,0.7)]'
      )}
    >
      {/* ---- Top bar ---- */}
      <div className="flex h-11 items-center justify-between gap-3 border-b border-porcelain/[0.08] px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="truncate whitespace-nowrap font-mono text-[12px] text-steel">
            {previewRepo}
          </span>
          <span className="hidden text-porcelain/[0.12] sm:inline">/</span>
          <span className="hidden font-mono text-[12px] text-steel sm:inline">
            main
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="whitespace-nowrap rounded-[4px] border border-porcelain/[0.08] px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.06em] text-steel">
            <span className="hidden sm:inline">Product </span>Preview
          </span>
          <button
            type="button"
            onClick={play}
            className="inline-flex size-7 items-center justify-center rounded-[5px] text-steel transition-colors hover:bg-porcelain/[0.05] hover:text-porcelain"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            <span className="sr-only">Replay preview</span>
          </button>
        </div>
      </div>

      {/* ---- Content grid ---- */}
      <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        {/* Left panel — question, files, answer */}
        <div className="flex flex-col gap-5 border-b border-porcelain/[0.08] p-4 sm:p-6 lg:border-b-0 lg:border-r">
          {/* Question */}
          <div>
            <PanelLabel>Question</PanelLabel>
            <p className="mt-2 rounded-lg border border-porcelain/[0.08] bg-obsidian px-3.5 py-3 text-[15px] leading-[1.5] text-porcelain">
              {previewQuestion}
            </p>
          </div>

          {/* Relevant files */}
          <div>
            <PanelLabel>
              <Search aria-hidden="true" className="size-3" />
              Relevant files
            </PanelLabel>
            <ul className="mt-2 flex flex-col gap-1">
              {previewFiles.map((file, i) => {
                const active = step >= i + 1
                return (
                  <li
                    key={file.name}
                    className={cn(
                      'relative flex items-center justify-between gap-3 rounded-md px-3 py-2',
                      'transition-[opacity,background-color] duration-200 motion-reduce:transition-none',
                      active ? 'opacity-100' : 'opacity-35',
                      active && file.cited && 'bg-mint/[0.06]'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-y-1.5 left-0 w-px transition-colors duration-200',
                        active && file.cited
                          ? 'bg-mint'
                          : 'bg-porcelain/[0.08]'
                      )}
                    />
                    <span className="flex min-w-0 items-center gap-2">
                      <FileCode2
                        aria-hidden="true"
                        className={cn(
                          'size-3.5 shrink-0',
                          file.cited ? 'text-mint' : 'text-steel'
                        )}
                      />
                      <span className="truncate font-mono text-[12.5px]">
                        <span className="text-steel">{file.path}</span>
                        <span className="text-porcelain">{file.name}</span>
                      </span>
                    </span>
                    <span className="hidden shrink-0 font-mono text-[12px] text-steel sm:inline">
                      {file.match}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Answer + citation */}
          <div
            className={cn(
              'transition-[opacity,transform] duration-200 ease-out-expo motion-reduce:transition-none',
              answerVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-1 opacity-0'
            )}
          >
            <PanelLabel>Answer</PanelLabel>
            <p className="mt-2 text-[15px] leading-[1.6] text-porcelain">
              {previewAnswer}
            </p>
            <button
              type="button"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
              onClick={() => setStep(FINAL)}
              aria-describedby="cited-code-caption"
              className={cn(
                'mt-3 inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-[12.5px]',
                'transition-[opacity,background-color,border-color] duration-150 motion-reduce:transition-none',
                citationVisible ? 'opacity-100' : 'opacity-0',
                evidenceActive
                  ? 'border-mint/50 bg-mint/10 text-porcelain'
                  : 'border-porcelain/[0.08] text-porcelain'
              )}
            >
              <span
                className="size-1.5 rounded-full bg-mint"
                aria-hidden="true"
              />
              {previewCitation.file}:{previewCitation.start}–
              {previewCitation.end}
            </button>
          </div>
        </div>

        {/* Right panel — code */}
        <CodePane evidenceActive={evidenceActive} emphasized={hovered} />
      </div>
    </figure>
  )
}

/* -------------------------------------------------------------------- */
/*  Panel label                                                          */
/* -------------------------------------------------------------------- */
function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[12px] font-medium text-steel">
      {children}
    </p>
  )
}

/* -------------------------------------------------------------------- */
/*  Code pane                                                            */
/* -------------------------------------------------------------------- */
function CodePane({
  evidenceActive,
  emphasized,
}: {
  evidenceActive: boolean
  emphasized: boolean
}) {
  return (
    <div className="min-w-0 bg-obsidian/60">
      <div className="flex h-10 items-center justify-between gap-3 border-b border-porcelain/[0.08] px-4">
        <span className="truncate font-mono text-[12px] text-steel">
          {previewCitation.path}
        </span>
        <span
          id="cited-code-caption"
          className="shrink-0 font-mono text-[12px] text-mint"
        >
          Lines {previewCitation.start}–{previewCitation.end} cited
        </span>
      </div>
      <pre className="overflow-x-auto py-3 font-mono text-[12.5px] leading-[1.7]">
        <code>
          {codeLines.map((line, i) => {
            const n = codeStartLine + i
            const cited =
              n >= previewCitation.start && n <= previewCitation.end
            const lit = cited && evidenceActive
            return (
              <div
                key={n}
                className={cn(
                  'relative flex min-w-max pr-6 transition-colors duration-[160ms] motion-reduce:transition-none',
                  lit &&
                    (emphasized ? 'bg-mint/[0.12]' : 'bg-mint/[0.06]')
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-y-0 left-0 w-0.5 transition-colors duration-[160ms]',
                    lit ? 'bg-mint' : 'bg-transparent'
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'w-12 shrink-0 select-none pr-4 text-right',
                    lit ? 'text-mint' : 'text-steel/40'
                  )}
                >
                  {n}
                </span>
                <span
                  className={cn(
                    cited || !evidenceActive
                      ? 'opacity-100'
                      : 'opacity-45',
                    'transition-opacity duration-[160ms]'
                  )}
                >
                  <Highlighted line={line} />
                </span>
              </div>
            )
          })}
        </code>
      </pre>
    </div>
  )
}

/* -------------------------------------------------------------------- */
/*  Syntax highlighting (palette-aware)                                  */
/* -------------------------------------------------------------------- */
const tokenPattern =
  /(\/\*\*|\*\/|^\s*\*.*$)|("[^"]*")|\b(export|function|return|if|const|true|false)\b|\b([A-Z][A-Za-z]+|[A-Z_]{3,})\b|\b([a-z][A-Za-z]+)(?=\()/g

function Highlighted({ line }: { line: string }) {
  if (!line) return <>{' '}</>
  const parts: React.ReactNode[] = []
  let last = 0
  for (const m of line.matchAll(tokenPattern)) {
    const idx = m.index ?? 0
    if (idx > last) parts.push(line.slice(last, idx))
    const [text, comment, str, kw, type, fn] = m
    const cls = comment
      ? 'text-steel/60 italic'
      : str
        ? 'text-mint/80'
        : kw
          ? 'text-porcelain'
          : type
            ? 'text-steel'
            : fn
              ? 'text-porcelain/90'
              : ''
    parts.push(
      <span key={idx} className={cls}>
        {text}
      </span>
    )
    last = idx + text.length
  }
  if (last < line.length) parts.push(line.slice(last))
  return <span className="text-porcelain/75">{parts}</span>
}