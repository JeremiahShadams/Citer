"use client";

import { useState, useEffect } from "react";
import { Terminal, CheckCircle2, Search, ArrowRight, Play, FileCode } from "lucide-react";

type DemoQuestion = {
  question: string;
  steps: string[];
  answer: string;
  sources: { file: string; lines: string }[];
};

const DEMO_PRESETS: DemoQuestion[] = [
  {
    question: "How does authentication work?",
    steps: [
      "Parsing query intent & architectural scope...",
      "Searching authentication symbols (middleware.ts, auth.ts)",
      "Tracing session creation pipeline (lib/session.ts)",
      "Inspecting AuthService callers (14 related symbols)",
      "Verifying source-level evidence & references...",
    ],
    answer:
      "Authentication is enforced primarily through `middleware.ts` and the session layer. The login route creates the cryptographic session through `services/auth.ts`, while `middleware.ts` validates that session token before permitting access to protected routes.",
    sources: [
      { file: "middleware.ts", lines: "12–38" },
      { file: "services/auth.ts", lines: "21–67" },
      { file: "lib/session.ts", lines: "4–39" },
    ],
  },
  {
    question: "What breaks if I remove UserService?",
    steps: [
      "Analyzing dependency graph of UserService...",
      "Found 7 dependent modules and 34 call sites",
      "Tracing AuthSession -> UserService link in auth.ts",
      "Checking database repository consumers in billing.ts",
      "Compiling blast radius report...",
    ],
    answer:
      "Removing `UserService` creates immediate runtime breaks in `AuthService.validateSession()`, `BillingManager.syncCustomer()`, and 5 API routes. The database layer will fail foreign-key cascades on `user_sessions`.",
    sources: [
      { file: "services/user.ts", lines: "1–142" },
      { file: "services/auth.ts", lines: "84–112" },
      { file: "billing/customer.ts", lines: "45–73" },
    ],
  },
  {
    question: "Where are API endpoints missing authentication?",
    steps: [
      "Enumerating all route handlers under /api...",
      "Cross-referencing against middleware route matcher",
      "Scanning for manual session token checks in handlers",
      "Flagging uncovered route patterns...",
    ],
    answer:
      "All routes under `/api/v1/*` are guarded by `middleware.ts`, except `/api/v1/health` and `/api/v1/webhooks/stripe`. The webhook endpoint validates HMAC signatures independently via `verifyWebhookSignature()`.",
    sources: [
      { file: "middleware.ts", lines: "4–18" },
      { file: "routes/webhooks.ts", lines: "14–50" },
    ],
  },
];

export default function AskTerminalDemo() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isInvestigating, setIsInvestigating] = useState(false);

  const activeDemo = DEMO_PRESETS[selectedIdx];

  const runInvestigation = (idx: number) => {
    setSelectedIdx(idx);
    setIsInvestigating(true);
    setStepIndex(0);
  };

  useEffect(() => {
    if (!isInvestigating) return;

    if (stepIndex < activeDemo.steps.length) {
      const timer = setTimeout(() => {
        setStepIndex((prev) => prev + 1);
      }, 550);
      return () => clearTimeout(timer);
    } else {
      setIsInvestigating(false);
    }
  }, [isInvestigating, stepIndex, activeDemo.steps.length]);

  return (
    <section id="investigation" className="relative border-t border-hairline bg-void py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-blue uppercase tracking-widest mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
            Live Demonstration
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Ask your codebase.
          </h2>
          <p className="mt-2 text-zinc-400 max-w-xl text-sm">
            Watch the agent investigate the repository structure, trace symbol
            references across files, and produce cited engineering answers.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => runInvestigation(idx)}
              className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-mono transition-all ${
                selectedIdx === idx
                  ? "border border-brand-blue/50 bg-brand-blue/15 text-white"
                  : "border border-hairline bg-surface-1 text-zinc-400 hover:border-hairline-bright hover:text-zinc-200"
              }`}
            >
              <Play className="h-3 w-3 text-brand-cyan" />
              <span>{preset.question}</span>
            </button>
          ))}
        </div>

        {/* Terminal Window */}
        <div className="rounded-xl border border-hairline bg-surface-1 shadow-2xl overflow-hidden">
          {/* Terminal Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-surface-0 px-3 py-3 sm:px-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]/80" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]/80" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]/80" />
              <span className="ml-1 min-w-0 truncate font-mono text-[10px] text-zinc-400 sm:ml-2 sm:text-xs">
                acme/frontend &mdash; branch: main
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Agent ready
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-3 font-mono text-[11px] sm:p-6 sm:text-sm">
            {/* User Prompt */}
            <div className="flex items-start gap-3 text-zinc-200 mb-6">
              <span className="text-brand-blue font-bold">&gt;</span>
              <div className="flex-1 font-semibold text-white">
                {activeDemo.question}
              </div>
            </div>

            {/* Investigation Stepper */}
            <div className="space-y-2 border-l border-hairline-bright pl-4 ml-1 mb-6">
              {activeDemo.steps.map((step, idx) => {
                const isCompleted = idx < stepIndex;
                const isCurrent = idx === stepIndex && isInvestigating;
                const isUpcoming = idx > stepIndex;

                if (isUpcoming) return null;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 transition-opacity duration-200 ${
                      isCurrent
                        ? "text-brand-cyan"
                        : isCompleted
                        ? "text-zinc-400"
                        : "text-zinc-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <span className="h-2 w-2 rounded-full bg-brand-cyan animate-ping shrink-0" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-zinc-600 shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>

            {/* Answer Display */}
            {(!isInvestigating || stepIndex >= activeDemo.steps.length) && (
              <div className="rounded-lg border border-hairline-bright bg-surface-2/60 p-5 mt-4 text-zinc-200 leading-relaxed font-sans text-sm animate-in fade-in duration-300">
                <div className="font-mono text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-brand-blue" />
                  Synthesized Answer
                </div>
                <p className="text-zinc-300 mb-4">{activeDemo.answer}</p>

                {/* Sources Bar */}
                <div className="border-t border-hairline pt-3 mt-4">
                  <div className="font-mono text-[11px] font-semibold text-zinc-400 mb-2">
                    Evidence Sources:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeDemo.sources.map((src, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded border border-hairline-bright bg-surface-3/80 px-2.5 py-1 font-mono text-xs text-blue-300 hover:border-brand-blue/50 transition-colors"
                      >
                        <FileCode className="h-3 w-3 text-brand-cyan" />
                        <span>{src.file}</span>
                        <span className="text-zinc-500">{src.lines}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
