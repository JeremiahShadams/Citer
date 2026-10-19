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

const STEP = { question: 0, answer: 4, citation: 5, evidence: 6 } as const
const FINAL = STEP.evidence
const schedule = [300, 355, 410, 760, 940, 1120]

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
    timers.current = schedule.map((ms, i) => window.setTimeout(() => setStep(i + 1), ms))
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
      className="overflow-hidden rounded-xl border border-border bg-muted/50 shadow-[0_1px_0_0_rgba(241,240,232,0.04)_inset,0_40px_80px_-40px_rgba(0,0,0,0.7)]"
    >
      <div className="flex h-11 items-center justify-between gap-3 border-b border-border px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="truncate whitespace-nowrap font-mono text-[12px] text-muted-foreground">{previewRepo}</span>
          <span className="hidden text-border sm:inline">/</span>
          <span className="hidden font-mono text-[12px] text-muted-foreground sm:inline">main</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="whitespace-nowrap rounded-[4px] border border-border px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            <span className="hidden sm:inline">Product </span>Preview
          </span>
          <button
            type="button"
            onClick={play}
            className="inline-flex size-7 items-center justify-center rounded-[5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            <span className="sr-only">Replay preview</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="flex flex-col gap-5 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div>
            <PanelLabel>Question</PanelLabel>
            <p className="mt-2 rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] leading-[1.5] text-foreground">
              {previewQuestion}
            </p>
          </div>

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
                      'relative flex items-center justify-between gap-3 rounded-md px-3 py-2 transition-[opacity,background-color] duration-200 motion-reduce:transition-none',
                      active ? 'opacity-100' : 'opacity-35',
                      active && file.cited && 'bg-[#a6b58a]/[0.07]',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-y-1.5 left-0 w-px transition-colors duration-200',
                        active && file.cited ? 'bg-[#a6b58a]' : 'bg-border',
                      )}
                    />
                    <span className="flex min-w-0 items-center gap-2">
                      <FileCode2 aria-hidden="true" className={cn('size-3.5 shrink-0', file.cited ? 'text-[#a6b58a]' : 'text-muted-foreground')} />
                      <span className="truncate font-mono text-[12.5px]">
                        <span className="text-muted-foreground">{file.path}</span>
                        <span className="text-foreground">{file.name}</span>
                      </span>
                    </span>
                    <span className="hidden shrink-0 font-mono text-[12px] text-muted-foreground sm:inline">{file.match}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div
            className={cn(
              'transition-[opacity,transform] duration-200 ease-out-expo motion-reduce:transition-none',
              answerVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
            )}
          >
            <PanelLabel>Answer</PanelLabel>
            <p className="mt-2 text-[15px] leading-[1.6] text-foreground">{previewAnswer}</p>
            <button
              type="button"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
              onClick={() => setStep(FINAL)}
              aria-describedby="cited-code-caption"
              className={cn(
                'mt-3 inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-[12.5px] transition-[opacity,background-color,border-color] duration-150 motion-reduce:transition-none',
                citationVisible ? 'opacity-100' : 'opacity-0',
                evidenceActive ? 'border-[#a6b58a]/60 bg-[#a6b58a]/10 text-foreground' : 'border-border text-foreground',
              )}
            >
              <span className="size-1.5 rounded-full bg-[#a6b58a]" aria-hidden="true" />
              {previewCitation.file}:{previewCitation.start}–{previewCitation.end}
            </button>
          </div>
        </div>

        <CodePane evidenceActive={evidenceActive} emphasized={hovered} />
      </div>
    </figure>
  )
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">{children}</p>
  )
}

function CodePane({ evidenceActive, emphasized }: { evidenceActive: boolean; emphasized: boolean }) {
  return (
    <div className="min-w-0 bg-background/60">
      <div className="flex h-10 items-center justify-between gap-3 border-b border-border px-4">
        <span className="truncate font-mono text-[12px] text-muted-foreground">{previewCitation.path}</span>
        <span id="cited-code-caption" className="shrink-0 font-mono text-[12px] text-[#a6b58a]">
          Lines {previewCitation.start}–{previewCitation.end} cited
        </span>
      </div>
      <pre className="overflow-x-auto py-3 font-mono text-[12.5px] leading-[1.7]">
        <code>
          {codeLines.map((line, i) => {
            const n = codeStartLine + i
            const cited = n >= previewCitation.start && n <= previewCitation.end
            const lit = cited && evidenceActive
            return (
              <div
                key={n}
                className={cn(
                  'relative flex min-w-max pr-6 transition-colors duration-[160ms] motion-reduce:transition-none',
                  lit && (emphasized ? 'bg-[#a6b58a]/[0.14]' : 'bg-[#a6b58a]/[0.08]'),
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn('absolute inset-y-0 left-0 w-0.5 transition-colors duration-[160ms]', lit ? 'bg-[#a6b58a]' : 'bg-transparent')}
                />
                <span
                  aria-hidden="true"
                  className={cn('w-12 shrink-0 select-none pr-4 text-right', lit ? 'text-[#a6b58a]' : 'text-muted-foreground/60')}
                >
                  {n}
                </span>
                <span className={cn(cited || !evidenceActive ? 'opacity-100' : 'opacity-55', 'transition-opacity duration-[160ms]')}>
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
      ? 'text-muted-foreground/70 italic'
      : str
        ? 'text-[#a6b58a]'
        : kw
          ? 'text-[#C9B99A]'
          : type
            ? 'text-[#B8C4CF]'
            : fn
              ? 'text-foreground'
              : ''
    parts.push(
      <span key={idx} className={cls}>
        {text}
      </span>,
    )
    last = idx + text.length
  }
  if (last < line.length) parts.push(line.slice(last))
  return <span className="text-foreground/85">{parts}</span>
}