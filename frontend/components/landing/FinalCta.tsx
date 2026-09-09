"use client";

import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export default function FinalCta() {
  return (
    <section className="py-28 bg-void border-t border-hairline text-center">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase leading-tight mb-6">
          Your codebase is telling the story.
          <br />
          <span className="text-zinc-400">We help you query it with citations.</span>
        </h2>

        <p className="mx-auto max-w-lg text-sm sm:text-base text-zinc-400 mb-8 font-sans">
          Index your first repository in under two minutes. Experience precise,
          evidence-backed code exploration.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-white px-8 text-sm font-semibold text-zinc-950 shadow-md hover:bg-zinc-200 transition-colors"
          >
            <span>Connect GitHub</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-hairline bg-surface-1 px-8 text-sm font-medium text-zinc-300 hover:bg-surface-2 transition-colors"
          >
            <span>Open Dashboard</span>
          </Link>
        </div>

        <div className="mt-8 font-mono text-xs text-zinc-500">
          No credit card required &middot; Self-hosted &amp; enterprise isolated
        </div>

        {/* Minimal Footer */}
        <div className="mt-20 border-t border-hairline pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-zinc-400" />
            <span>Codebase Intelligence &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#system" className="hover:text-zinc-300 transition-colors">
              System
            </a>
            <a href="#evidence" className="hover:text-zinc-300 transition-colors">
              Evidence
            </a>
            <a href="#security" className="hover:text-zinc-300 transition-colors">
              Security
            </a>
            <Link href="/eval" className="hover:text-zinc-300 transition-colors">
              Benchmarks
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
