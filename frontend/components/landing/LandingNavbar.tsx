"use client";

import Link from "next/link";
import { Terminal, Shield, GitBranch, ArrowRight } from "lucide-react";

export default function LandingNavbar() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-5xl px-4">
      <nav className="flex items-center justify-between rounded-full border border-hairline bg-surface-1/80 px-5 py-2.5 backdrop-blur-xl shadow-2xl">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-6 w-6 items-center justify-center rounded border border-zinc-700 bg-surface-2 text-zinc-300 transition-colors">
            <Terminal className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-zinc-100 uppercase">
            <span>Codebase</span>
            <span className="text-zinc-400">Intelligence</span>
          </div>
        </Link>

        {/* Anchors */}
        <div className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
          <a href="#system" className="hover:text-zinc-100 transition-colors">
            System
          </a>
          <a href="#evidence" className="hover:text-zinc-100 transition-colors">
            Evidence
          </a>
          <a href="#security" className="hover:text-zinc-100 transition-colors">
            Security
          </a>
          <Link href="/eval" className="hover:text-zinc-100 transition-colors">
            Benchmarks
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors px-2 py-1"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
          >
            <span>Connect GitHub</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
