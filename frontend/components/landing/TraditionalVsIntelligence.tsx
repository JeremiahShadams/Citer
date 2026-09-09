"use client";

import { ArrowDown, Check, X, ShieldAlert, Cpu } from "lucide-react";

export default function TraditionalVsIntelligence() {
  return (
    <section id="system" className="py-24 bg-void border-t border-hairline">
      <div className="mx-auto max-w-5xl px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 uppercase tracking-widest mb-3">
            <Cpu className="h-3.5 w-3.5 text-zinc-400" />
            Architecture Comparison
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Ordinary RAG searches text.
            <br />
            <span className="text-zinc-400">
              Codebase Intelligence resolves software structures.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-400 font-sans">
            A software repository is not a flat bucket of documentation. Fixed-token chunking destroys function definitions, interfaces, and call hierarchies.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Traditional Naive RAG */}
          <div className="rounded-xl border border-hairline bg-surface-1/40 p-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
              <div className="font-mono text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <X className="h-4 w-4 text-zinc-500" />
                <span>Naive Vector Search</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 bg-surface-2 px-2 py-0.5 rounded border border-hairline">
                Arbitrary 500-token chunks
              </span>
            </div>

            {/* Pipeline Flow */}
            <div className="space-y-4 font-mono text-xs">
              <div className="rounded-lg border border-hairline bg-surface-0 p-3 text-zinc-300">
                Query: &quot;How does auth work?&quot;
              </div>
              <div className="flex justify-center text-zinc-600">
                <ArrowDown className="h-4 w-4" />
              </div>
              <div className="rounded-lg border border-hairline bg-surface-0 p-3 text-zinc-400">
                Cosine similarity across flat token windows
              </div>
              <div className="flex justify-center text-zinc-600">
                <ArrowDown className="h-4 w-4" />
              </div>
              <div className="rounded-lg border border-dashed border-hairline bg-surface-0/60 p-3 text-zinc-400">
                Truncated AST chunks (Cut mid-function)
              </div>
              <div className="flex justify-center text-zinc-600">
                <ArrowDown className="h-4 w-4" />
              </div>
              <div className="rounded-lg border border-hairline bg-surface-0 p-3 text-zinc-500">
                Ungrounded LLM summary with no exact line proof
              </div>
            </div>

            <div className="mt-6 border-t border-hairline pt-4 text-xs text-zinc-500 space-y-1.5 font-mono">
              <div className="flex items-center gap-2">
                <span>&times;</span> Truncates function signatures and classes
              </div>
              <div className="flex items-center gap-2">
                <span>&times;</span> Cannot verify line-level citations
              </div>
              <div className="flex items-center gap-2">
                <span>&times;</span> Silent hallucinations on multi-file dependencies
              </div>
            </div>
          </div>

          {/* Right: Codebase Intelligence */}
          <div className="rounded-xl border border-hairline-bright bg-surface-1 p-6 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
              <div className="font-mono text-xs uppercase tracking-wider text-white flex items-center gap-2 font-semibold">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Codebase Intelligence</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                AST + Hybrid RRF
              </span>
            </div>

            {/* Pipeline Flow */}
            <div className="space-y-4 font-mono text-xs">
              <div className="rounded-lg border border-hairline bg-surface-0 p-3 text-white">
                Query: &quot;How does auth work?&quot;
              </div>
              <div className="flex justify-center text-zinc-400">
                <ArrowDown className="h-4 w-4" />
              </div>
              <div className="rounded-lg border border-hairline bg-surface-0 p-3 text-zinc-200 flex items-center justify-between">
                <span>Tree-sitter AST parsing (10+ languages)</span>
                <span className="text-[10px] text-zinc-400">AST</span>
              </div>
              <div className="flex justify-center text-zinc-400">
                <ArrowDown className="h-4 w-4" />
              </div>
              <div className="rounded-lg border border-hairline bg-surface-2 p-3 text-zinc-200 flex items-center justify-between">
                <span>3-Way Fusion: Dense Vector + Keyword + Symbol</span>
                <span className="text-[10px] text-zinc-400">RRF</span>
              </div>
              <div className="flex justify-center text-zinc-400">
                <ArrowDown className="h-4 w-4" />
              </div>
              <div className="rounded-lg border border-hairline bg-surface-0 p-3 text-zinc-100 flex items-center justify-between">
                <span>Verified Source-Level Evidence</span>
                <span className="text-[10px] text-emerald-400">100% Line Verified</span>
              </div>
            </div>

            <div className="mt-6 border-t border-hairline pt-4 text-xs text-zinc-300 space-y-1.5 font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <span>&check;</span> Preserves intact functions, classes, and methods
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span>&check;</span> Cites exact file paths and illuminated line ranges
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span>&check;</span> Zero ungrounded claims; every point is inspectable
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
