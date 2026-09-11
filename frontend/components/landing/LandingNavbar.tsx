"use client";

import Link from "next/link";
import { Terminal, ArrowRight } from "lucide-react";

export default function LandingNavbar() {
  return (
    <header className="fixed inset-x-0 top-3 z-50 mx-auto max-w-5xl px-3 sm:top-4 sm:px-4">
      <nav className="flex min-w-0 items-center justify-between gap-2 rounded-full border border-hairline bg-surface-1/80 px-3.5 py-2 backdrop-blur-xl shadow-2xl sm:px-5">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-6 w-6 items-center justify-center rounded border border-brand-primary/30 bg-brand-primary/10 text-brand-hover group-hover:border-brand-primary/60 transition-colors">
            <Terminal className="h-3.5 w-3.5" />
          </div>
          <div className="flex min-w-0 items-center gap-1.5 truncate font-mono text-[10px] font-semibold tracking-wider text-zinc-100 uppercase sm:text-xs">
            <span>Codebase</span>
            <span className="text-brand-hover">Intelligence</span>
          </div>
        </Link>

        {/* Anchors */}
        <div className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
          <a href="#system" className="hover:text-zinc-100 transition-colors">
            System
          </a>
          <a href="#investigation" className="hover:text-zinc-100 transition-colors">
            Investigation
          </a>
          <a href="#evidence" className="hover:text-zinc-100 transition-colors">
            Evidence
          </a>
          <a href="#architecture" className="hover:text-zinc-100 transition-colors">
            Architecture
          </a>
          <a href="#security" className="hover:text-zinc-100 transition-colors">
            Security
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-200 sm:block"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-full border border-brand-primary/40 bg-brand-primary/15 px-3.5 py-1.5 text-xs font-medium text-zinc-200 hover:bg-brand-primary/25 hover:border-brand-hover/60 hover:text-white transition-all shadow-sm"
          >
            <span>Connect GitHub</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
