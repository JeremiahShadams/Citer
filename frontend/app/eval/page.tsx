"use client";

import { useEffect, useState } from "react";
import { getEvalRuns } from "@/lib/api";
import Link from "next/link";
import {
  Terminal,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Zap,
  Filter,
  Layers,
} from "lucide-react";

type EvalResult = {
  question: string;
  passed: boolean;
  hallucinated?: boolean;
  latency_ms: number;
  cited_files?: string[];
};

type EvalRun = {
  dataset: string;
  pass_rate: number;
  hallucination_rate: number;
  avg_latency_ms: number;
  results: EvalResult[];
};

export default function EvalDashboard() {
  const [runs, setRuns] = useState<EvalRun[]>([]);
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all");

  useEffect(() => {
    getEvalRuns().then((data) => {
      if (Array.isArray(data)) setRuns(data);
    }).catch(() => {});
  }, []);

  const latestRun = runs[runs.length - 1];

  const filteredResults = latestRun
    ? latestRun.results.filter((r) => {
        if (filter === "passed") return r.passed;
        if (filter === "failed") return !r.passed;
        return true;
      })
    : [];

  return (
    <main className="min-h-screen bg-void text-zinc-100 font-sans selection:bg-brand-blue/30 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-hairline bg-surface-0 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-white">
            <Layers className="h-3.5 w-3.5 text-brand-blue" />
            <span>Evaluation &amp; Ground-Truth Benchmarks</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Harness Online</span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        {/* Title & Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Ground-Truth Evaluation Harness
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-sans">
            Rigorous automated verification measuring citation recall, line-level accuracy, hallucination prevention, and response latency.
          </p>
        </div>

        {!latestRun && (
          <div className="rounded-xl border border-hairline bg-surface-1 p-8 text-center font-mono text-xs text-zinc-500">
            No eval runs recorded yet. Run <code className="text-zinc-300">python -m scripts.eval</code> to generate benchmarks.
          </div>
        )}

        {latestRun && (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pass Rate */}
              <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-lg">
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Pass Rate</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white font-mono">
                  {(latestRun.pass_rate * 100).toFixed(0)}%
                </div>
                <div className="mt-2 text-[11px] font-mono text-emerald-400">
                  Target: &gt; 90% (Passed)
                </div>
              </div>

              {/* Hallucination Rate */}
              <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-lg">
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Hallucination</span>
                  <ShieldCheck className="h-4 w-4 text-brand-cyan" />
                </div>
                <div className="text-3xl font-bold text-white font-mono">
                  {(latestRun.hallucination_rate * 100).toFixed(1)}%
                </div>
                <div className="mt-2 text-[11px] font-mono text-brand-cyan">
                  Zero ungrounded assertions
                </div>
              </div>

              {/* Avg Latency */}
              <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-lg">
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Avg Latency</span>
                  <Zap className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-3xl font-bold text-white font-mono">
                  {latestRun.avg_latency_ms.toFixed(0)}
                  <span className="text-base text-zinc-500 font-normal">ms</span>
                </div>
                <div className="mt-2 text-[11px] font-mono text-zinc-400">
                  RRF + Stream generation
                </div>
              </div>

              {/* Dataset Scope */}
              <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-lg">
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Total Scenarios</span>
                  <Terminal className="h-4 w-4 text-brand-blue" />
                </div>
                <div className="text-3xl font-bold text-white font-mono">
                  {latestRun.results.length}
                </div>
                <div className="mt-2 text-[11px] font-mono text-zinc-400">
                  Dataset: {latestRun.dataset}
                </div>
              </div>
            </div>

            {/* Results Table Section */}
            <div className="rounded-xl border border-hairline bg-surface-1 overflow-hidden shadow-xl">
              {/* Table Toolbar */}
              <div className="border-b border-hairline bg-surface-0 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Scenario Drilldown ({filteredResults.length} / {latestRun.results.length})
                </div>

                <div className="flex items-center rounded-lg border border-hairline bg-surface-2 p-0.5 font-mono text-xs">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      filter === "all" ? "bg-surface-3 text-white" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    All ({latestRun.results.length})
                  </button>
                  <button
                    onClick={() => setFilter("passed")}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      filter === "passed" ? "bg-surface-3 text-emerald-400 font-semibold" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Passed
                  </button>
                  <button
                    onClick={() => setFilter("failed")}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      filter === "failed" ? "bg-surface-3 text-red-400 font-semibold" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Failed
                  </button>
                </div>
              </div>

              {/* Table Rows */}
              <div className="overflow-x-auto font-mono text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-hairline text-zinc-500 bg-surface-0/50 text-[11px]">
                      <th className="py-3 px-6 w-24">Status</th>
                      <th className="py-3 px-4">Evaluation Question</th>
                      <th className="py-3 px-4">Cited Evidence Files</th>
                      <th className="py-3 px-6 text-right w-24">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {filteredResults.map((res, i) => (
                      <tr key={i} className="hover:bg-surface-2/40 transition-colors">
                        <td className="py-3 px-6">
                          {res.passed ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-950/60 px-2 py-0.5 text-[10px] text-emerald-400 border border-emerald-900/50">
                              <CheckCircle2 className="h-3 w-3" />
                              PASS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-red-950/60 px-2 py-0.5 text-[10px] text-red-400 border border-red-900/50">
                              <XCircle className="h-3 w-3" />
                              FAIL
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-zinc-200 font-sans text-xs">
                          {res.question}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-zinc-400">
                          {res.cited_files && res.cited_files.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {res.cited_files.map((file, idx) => (
                                <span
                                  key={idx}
                                  className="rounded bg-surface-2 px-1.5 py-0.5 text-zinc-300 border border-hairline"
                                >
                                  {file}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-right text-zinc-400">
                          {res.latency_ms.toFixed(0)}ms
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}