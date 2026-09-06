"use client";

import { ArrowDown, Check, X, ShieldAlert, Cpu } from "lucide-react";

export default function TraditionalVsIntelligence() {
  return (
    <section id="system" className="py-24 bg-void border-t border-hairline">
      <div className="mx-auto max-w-5xl px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-indigo uppercase tracking-widest mb-3">
            <Cpu className="h-3.5 w-3.5" />
            The Architectural Divide
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Traditional AI finds text.
            <br />
            <span className="text-brand-blue">
              Codebase Intelligence understands relationships.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-400">
            A software repository is not a flat bucket of documentation. Naive
            vector similarity loses call graphs, dependencies, and architectural
            intent.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Traditional Naive RAG */}
          <div className="rounded-xl border border-red-950/40 bg-surface-1/50 p-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
              <div className="font-mono text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <X className="h-4 w-4 text-red-400" />
                <span>Ordinary Vector RAG</span>
              </div>
              <span className="text-[11px] font-mono text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-900/50">
                Disconnected Chunks
              </span>
            </div>

            {/* Pipeline Flow */}
            <div className="space-y-4 font-mono text-xs">
              <div className="rounded-lg border border-hairline bg-surface-0 p-3 text-zinc-300">
                Question: &quot;How does auth work?&quot;
              </div>
              <div className="flex justify-center text-zinc-600">
                <ArrowDown className="h-4 w-4" />
              </div>
              <div className="rounded-lg border border-hairline bg-surface-0 p-3 text-zinc-400">
                Cosine Similarity on Flat Text
              </div>
              <div className="flex justify-center text-zinc-600">
                <ArrowDown className="h-4 w-4" />
              </div>
              <div className="rounded-lg border border-dashed border-red-900/50 bg-red-950/20 p-3 text-red-300">
                Scattered Chunks (No Call Hierarchy)
              </div>
              <div className="flex justify-center text-zinc-600">
                <ArrowDown className="h-4 w-4" />
              </div>
              <div className="rounded-lg border border-red-900/40 bg-surface-0 p-3 text-zinc-400">
                Plausible Hallucinated Summary
              </div>
            </div>

            <div className="mt-6 border-t border-hairline pt-4 text-xs text-zinc-500 space-y-1.5 font-mono">
              <div className="flex items-center gap-2 text-red-400">
                <span>&times;</span> Misses indirect callers and interfaces
              </div>
              <div className="flex items-center gap-2 text-red-400">
                <span>&times;</span> Cannot verify line-level citations
              </div>
              <div className="flex items-center gap-2 text-red-400">
                <span>&times;</span> Breaks on refactored symbol names
              </div>
            </div>
          </div>

          {/* Right: Codebase Intelligence */}
          <div className="rounded-xl border border-brand-blue/40 bg-surface-1 p-6 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
              <div className="font-mono text-xs uppercase tracking-wider text-zinc-200 flex items-center gap-2 font-semibold">
                <Check className="h-4 w-4 text-brand-blue" />
                <span>Codebase Intelligence</span>
              </div>
              <span className="text-[11px] font-mono text-brand-blue bg-brand-blue/15 px-2 py-0.5 rounded border border-brand-blue/30">
                Multi-Hop Graph Agent
              </span>
            </div>

            {/* Pipeline Flow */}
            <div className="space-y-4 font-mono text-xs">
              <div className="rounded-lg border border-hairline bg-surface-0 p-3 text-white">
                Question: &quot;How does auth work?&quot;
              </div>
              <div className="flex justify-center text-brand-blue">
                <ArrowDown className="h-4 w-4" />
              </div>
              <div className="rounded-lg border border-hairline bg-surface-0 p-3 text-zinc-200 flex items-center justify-between">
                <span>Tree-Sitter AST + Hybrid Fusion</span>
                <span className="text-[10px] text-brand-cyan">RRF</span>
              </div>
              <div className="flex justify-center text-brand-blue">
                <ArrowDown className="h-4 w-4" />
              </div>
              <div className="rounded-lg border border-brand-blue/30 bg-brand-blue/10 p-3 text-brand-blue">
                Trace Symbols, Callers, &amp; Dependencies
              </div>
              <div className="flex justify-center text-brand-blue">
                <ArrowDown className="h-4 w-4" />
              </div>
              <div className="rounded-lg border border-hairline bg-surface-0 p-3 text-emerald-300 flex items-center justify-between">
                <span>Verified Source-Level Evidence</span>
                <span className="text-[10px] text-emerald-400">100% Cited</span>
              </div>
            </div>

            <div className="mt-6 border-t border-hairline pt-4 text-xs text-zinc-300 space-y-1.5 font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <span>&check;</span> Maps call hierarchy and cross-file dependencies
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span>&check;</span> Cites exact file paths and line ranges
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span>&check;</span> Ground-truth verification eliminates hallucination
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
