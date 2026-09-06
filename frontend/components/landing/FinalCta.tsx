"use client";

import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export default function FinalCta() {
  return (
    <section className="py-28 bg-void border-t border-hairline text-center">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase leading-tight mb-6">
          Your codebase is already telling the story.
          <br />
          <span className="text-brand-blue">We help you read it.</span>
        </h2>

        <p className="mx-auto max-w-lg text-sm sm:text-base text-zinc-400 mb-8 font-sans">
          Index your first repository in under two minutes. Experience precise,
          evidence-backed code exploration.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-brand-blue/70 bg-brand-blue px-8 text-sm font-medium text-white shadow-lg hover:bg-blue-600 transition-all"
          >
            <span>Connect GitHub</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-hairline bg-surface-1 px-8 text-sm font-medium text-zinc-300 hover:bg-surface-2 transition-all"
          >
            <span>Open Dashboard</span>
          </Link>
        </div>

        <div className="mt-8 font-mono text-xs text-zinc-500">
          No credit card required &middot; SOC 2 Type II compliant pipeline
        </div>

        {/* Minimal Footer */}
        <div className="mt-20 border-t border-hairline pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-brand-blue" />
            <span>Codebase Intelligence &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#system" className="hover:text-zinc-300 transition-colors">
              System
            </a>
            <a href="#investigation" className="hover:text-zinc-300 transition-colors">
              Investigation
            </a>
            <a href="#architecture" className="hover:text-zinc-300 transition-colors">
              Architecture
            </a>
            <Link href="/eval" className="hover:text-zinc-300 transition-colors">
              Evaluations
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
