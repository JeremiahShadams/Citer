"use client";

import { ShieldCheck, Lock, RefreshCw, GitCommit, Database, Zap } from "lucide-react";

export default function SecurityAndScale() {
  return (
    <section id="security" className="border-t border-hairline bg-void py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 space-y-20">
        {/* Security Vault Section */}
        <div>
          <div className="mb-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-emerald-400 uppercase tracking-widest mb-3">
              <Lock className="h-3.5 w-3.5" />
              Enterprise Isolation
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">
              Your code is
              <br />
              <span className="text-zinc-500">your business.</span>
            </h2>
            <p className="mt-2 text-zinc-400 max-w-xl text-sm">
              Strict repository boundary enforcement prevents cross-tenant leakage. Your code is processed in isolated execution contexts and never used for model training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-hairline bg-surface-1 p-5">
              <div className="font-mono text-xs text-zinc-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Repository Isolation
              </div>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                PostgreSQL row-level security and schema-partitioned vector spaces enforce strict isolation. Queries for Repo A never retrieve chunks from Repo B.
              </p>
            </div>

            <div className="rounded-xl border border-hairline bg-surface-1 p-5">
              <div className="font-mono text-xs text-zinc-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Lock className="h-4 w-4 text-brand-hover" />
                Zero Retention LLM
              </div>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                OpenAI zero-data retention agreements ensure no source code is logged, retained, or utilized for foundational model retraining.
              </p>
            </div>

            <div className="rounded-xl border border-hairline bg-surface-1 p-5">
              <div className="font-mono text-xs text-zinc-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Database className="h-4 w-4 text-brand-accent" />
                Encrypted Credentials
              </div>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                GitHub tokens are stored using AES-256 GCM encryption at rest. Tokens are scoped strictly to read-only repository tree access.
              </p>
            </div>
          </div>
        </div>

        {/* Live Codebase Incremental Sync */}
        <div className="rounded-xl border border-hairline bg-surface-1 p-4 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-xs text-brand-accent uppercase tracking-widest mb-3">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            Incremental Ingestion
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            The code changes. The understanding should too.
          </h3>
          <p className="text-sm text-zinc-400 max-w-2xl mb-8">
            When you push a commit, webhooks trigger incremental AST re-parsing. Only changed files, invalidated symbols, and affected callers are re-embedded.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 font-mono text-center text-xs">
            <div className="rounded border border-hairline bg-surface-0 p-3">
              <div className="text-zinc-500 text-[10px] mb-1">01</div>
              <div className="text-zinc-300 font-semibold">Git Push</div>
            </div>
            <div className="rounded border border-hairline bg-surface-0 p-3">
              <div className="text-zinc-500 text-[10px] mb-1">02</div>
              <div className="text-zinc-300 font-semibold">Webhook</div>
            </div>
            <div className="rounded border border-hairline bg-surface-0 p-3">
              <div className="text-zinc-500 text-[10px] mb-1">03</div>
              <div className="text-zinc-300 font-semibold">Diff Delta</div>
            </div>
            <div className="rounded border border-hairline bg-surface-0 p-3">
              <div className="text-zinc-500 text-[10px] mb-1">04</div>
              <div className="text-brand-hover font-semibold">Reparse AST</div>
            </div>
            <div className="rounded border border-hairline bg-surface-0 p-3">
              <div className="text-zinc-500 text-[10px] mb-1">05</div>
              <div className="text-brand-accent font-semibold">Map Callers</div>
            </div>
            <div className="rounded border border-hairline bg-surface-0 p-3">
              <div className="text-zinc-500 text-[10px] mb-1">06</div>
              <div className="text-brand-violet font-semibold">Re-embed</div>
            </div>
            <div className="rounded border border-hairline bg-surface-0 p-3">
              <div className="text-zinc-500 text-[10px] mb-1">07</div>
              <div className="text-emerald-400 font-semibold">Sync Ready</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
