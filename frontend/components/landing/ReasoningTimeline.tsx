"use client";

import { useState } from "react";
import { GitCommit, Search, Network, CheckCircle, FileText, ArrowRight } from "lucide-react";

type Stage = {
  id: string;
  step: string;
  title: string;
  detail: string;
  telemetry: string;
};

const STAGES: Stage[] = [
  {
    id: "01",
    step: "01",
    title: "Understand query & classify intent",
    detail: "Deconstructs natural language into architectural targets (components, routes, state mutations).",
    telemetry: "Query classified: ARCHITECTURAL_FLOW",
  },
  {
    id: "02",
    step: "02",
    title: "Identify relevant symbols",
    detail: "Extracts classes, functions, and interfaces using language-aware AST heuristics.",
    telemetry: "Extracted symbols: [AuthService, createSession, middleware]",
  },
  {
    id: "03",
    step: "03",
    title: "Retrieve candidate evidence",
    detail: "Executes 3-way hybrid search: pgvector embeddings, Postgres full-text search, and symbol match.",
    telemetry: "RRF Fusion merged 60 candidates -> top 8 chunks",
  },
  {
    id: "04",
    step: "04",
    title: "Trace relationships & call graphs",
    detail: "Follows caller/callee trees across files to capture multi-hop execution flow.",
    telemetry: "Followed 4 edges: Route -> Middleware -> AuthService -> DB",
  },
  {
    id: "05",
    step: "05",
    title: "Inspect surrounding context",
    detail: "Reads raw file slices around candidate chunks to avoid partial-context misinterpretation.",
    telemetry: "Expanded context slice: middleware.ts (lines 1-45)",
  },
  {
    id: "06",
    step: "06",
    title: "Verify claims against ground truth",
    detail: "Agentic critic validates that every statement is backed by an actual file and line number.",
    telemetry: "Verification score: 1.0 (Zero ungrounded assertions)",
  },
  {
    id: "07",
    step: "07",
    title: "Respond with source-level citations",
    detail: "Generates structured report with clickable, illuminated file anchors.",
    telemetry: "Report emitted with 3 line-range citations",
  },
];

export default function ReasoningTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 bg-void border-t border-hairline">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-cyan uppercase tracking-widest mb-3">
            <Network className="h-3.5 w-3.5" />
            Agentic Investigation
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">
            The AI doesn&apos;t guess.
            <br />
            <span className="text-zinc-500">It investigates.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-400">
            A deterministic 7-stage pipeline transforms broad engineering questions into verified, evidence-backed answers.
          </p>
        </div>

        {/* Interactive Investigation Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Steps List */}
          <div className="lg:col-span-7 space-y-2">
            {STAGES.map((stage, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStep(idx)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                    isActive
                      ? "border-brand-blue/70 bg-surface-2 shadow-lg"
                      : "border-hairline bg-surface-1/40 hover:border-hairline-bright hover:bg-surface-1"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          isActive
                            ? "bg-brand-blue text-white"
                            : "bg-surface-3 text-zinc-500"
                        }`}
                      >
                        {stage.step}
                      </span>
                      <h4
                        className={`text-sm font-medium ${
                          isActive ? "text-white" : "text-zinc-300"
                        }`}
                      >
                        {stage.title}
                      </h4>
                    </div>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
                    )}
                  </div>
                  {isActive && (
                    <p className="mt-2 text-xs text-zinc-400 pl-9 font-sans leading-relaxed">
                      {stage.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Step Telemetry Card */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-hairline-bright bg-surface-1 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-hairline pb-3 mb-4">
                <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-blue animate-ping" />
                  Live Step Telemetry
                </div>
                <span className="font-mono text-xs text-brand-cyan">
                  Stage {STAGES[activeStep].step} of 07
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="rounded border border-hairline bg-surface-0 p-3">
                  <div className="text-[11px] text-zinc-500 mb-1 uppercase">
                    Stage Name
                  </div>
                  <div className="text-zinc-200 font-semibold">
                    {STAGES[activeStep].title}
                  </div>
                </div>

                <div className="rounded border border-hairline bg-surface-0 p-3">
                  <div className="text-[11px] text-zinc-500 mb-1 uppercase">
                    Agent Log
                  </div>
                  <div className="text-brand-cyan whitespace-pre-wrap">
                    &gt; {STAGES[activeStep].telemetry}
                  </div>
                </div>

                <div className="rounded border border-hairline bg-surface-0 p-3">
                  <div className="text-[11px] text-zinc-500 mb-1 uppercase">
                    State Machine Status
                  </div>
                  <div className="text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>LangGraph State Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
