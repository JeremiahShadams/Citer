"use client";

import { HelpCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";

type QuestionCard = {
  question: string;
  category: string;
  capability: string;
  reasoningType: string;
};

const QUESTIONS: QuestionCard[] = [
  {
    question: "What calls createSession() across all services?",
    category: "Reverse Call Graph",
    capability: "Multi-hop reverse AST traversal",
    reasoningType: "Callers & Dependents",
  },
  {
    question: "How does a user move from login to an authenticated dashboard?",
    category: "Full Execution Trace",
    capability: "Cross-file lifecycle flow tracing",
    reasoningType: "End-to-end Path",
  },
  {
    question: "What breaks if I remove or refactor UserService?",
    category: "Blast Radius & Impact",
    capability: "Static dependency impact analysis",
    reasoningType: "Architectural Safety",
  },
  {
    question: "Where are API endpoints missing authentication or rate limits?",
    category: "Security Invariants",
    capability: "Static route invariant verification",
    reasoningType: "Vulnerability Auditing",
  },
];

export default function ImpossibleQuestions() {
  return (
    <section className="py-24 bg-void border-t border-hairline">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-blue uppercase tracking-widest mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            Repository Reasoning
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">
            Ask questions that
            <br />
            <span className="text-zinc-500">require understanding.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-400">
            Move beyond simple keyword and snippet retrieval to deep architectural impact analysis and multi-file reasoning.
          </p>
        </div>

        {/* Question Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUESTIONS.map((q, idx) => (
            <div
              key={idx}
              className="group rounded-xl border border-hairline bg-surface-1 p-6 hover:border-hairline-bright hover:bg-surface-2 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="rounded bg-surface-3 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400 uppercase tracking-wider">
                  {q.category}
                </span>
                <span className="font-mono text-xs text-brand-cyan flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {q.reasoningType}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-4 leading-snug group-hover:text-brand-blue transition-colors">
                &ldquo;{q.question}&rdquo;
              </h3>

              <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 pt-4 border-t border-hairline">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{q.capability}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
