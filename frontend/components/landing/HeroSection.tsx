"use client";

import Link from "next/link";
import { ArrowRight, Terminal, FileCode, Check, ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-16 overflow-hidden bg-void">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 z-0 bg-tech-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-void via-transparent to-void pointer-events-none" />

      {/* Hero Header & Typography */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center mt-8 md:mt-14">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-1/90 px-3.5 py-1 text-[11px] font-mono text-zinc-400 backdrop-blur-md mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-zinc-300 font-semibold tracking-wider uppercase">
            Tree-Sitter AST &middot; pgvector HNSW
          </span>
          <span className="text-zinc-600">|</span>
          <span>Verified Citations</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
          Codebase comprehension.
          <br />
          <span className="text-zinc-500 font-light">
            With exact source citations.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 font-normal leading-relaxed mb-8 font-sans">
          Index your GitHub repository into an AST-aware structural representation.
          Query data flows, routes, and call hierarchies with zero hallucinations. Every assertion links directly to highlighted source lines.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <Link
            href="/dashboard"
            className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-white px-7 text-sm font-semibold text-zinc-950 shadow-md hover:bg-zinc-200 transition-colors"
          >
            <span>Connect GitHub</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-hairline-bright bg-surface-1/90 px-7 text-sm font-medium text-zinc-300 hover:bg-surface-2 hover:text-white transition-colors"
          >
            <span>Open Dashboard</span>
          </Link>
        </div>

        {/* Realistic 3-Panel Cockpit Workspace Mockup Preview */}
        <div className="mx-auto max-w-5xl rounded-xl border border-hairline-bright bg-surface-0 shadow-2xl overflow-hidden text-left font-mono">
          {/* Mockup Window Header */}
          <div className="border-b border-hairline bg-surface-1 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="ml-2 text-xs text-zinc-400 font-sans">codebase-intelligence / workspace</span>
            </div>
            <div className="text-[11px] text-zinc-500">
              commit: 8f3d1a9 &middot; branch: main
            </div>
          </div>

          {/* Mockup 3-Panel Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 h-96 overflow-hidden text-xs">
            {/* Panel 1: File Tree (3 cols) */}
            <div className="md:col-span-3 border-r border-hairline bg-surface-1/50 p-3 space-y-1.5 hidden md:block">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Files</div>
              <div className="text-zinc-500 flex items-center gap-1.5 py-0.5">
                <span>▾ src/</span>
              </div>
              <div className="pl-3 space-y-1">
                <div className="rounded bg-zinc-800 text-white px-2 py-1 flex items-center justify-between border-l-2 border-white">
                  <span>middleware.ts</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-zinc-400 px-2 py-0.5 hover:text-zinc-200">
                  services/auth.ts
                </div>
                <div className="text-zinc-400 px-2 py-0.5 hover:text-zinc-200">
                  lib/session.ts
                </div>
                <div className="text-zinc-400 px-2 py-0.5 hover:text-zinc-200">
                  db/schema.sql
                </div>
              </div>
            </div>

            {/* Panel 2: Code Viewer with Line Illumination (5 cols) */}
            <div className="md:col-span-5 border-r border-hairline bg-surface-0 p-3 overflow-hidden">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-hairline pb-2 mb-2">
                <span>src/middleware.ts</span>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300">
                  Lines 12–16 illuminated
                </span>
              </div>
              <div className="space-y-1 text-[11px] leading-relaxed text-zinc-400">
                <div><span className="text-zinc-600 select-none mr-3">10</span>import &#123; getSession &#125; from &quot;@/lib/session&quot;;</div>
                <div><span className="text-zinc-600 select-none mr-3">11</span></div>
                <div className="bg-zinc-800/90 text-white -mx-3 px-3 py-0.5 border-l-2 border-white">
                  <span className="text-zinc-400 select-none mr-3">12</span>export async function middleware(req: NextRequest) &#123;
                </div>
                <div className="bg-zinc-800/90 text-white -mx-3 px-3 py-0.5 border-l-2 border-white">
                  <span className="text-zinc-400 select-none mr-3">13</span>  const token = req.cookies.get(&quot;session_token&quot;)?.value;
                </div>
                <div className="bg-zinc-800/90 text-white -mx-3 px-3 py-0.5 border-l-2 border-white">
                  <span className="text-zinc-400 select-none mr-3">14</span>  if (!token) return NextResponse.redirect(&quot;/login&quot;);
                </div>
                <div className="bg-zinc-800/90 text-white -mx-3 px-3 py-0.5 border-l-2 border-white">
                  <span className="text-zinc-400 select-none mr-3">15</span>  const session = await getSession(token);
                </div>
                <div className="bg-zinc-800/90 text-white -mx-3 px-3 py-0.5 border-l-2 border-white">
                  <span className="text-zinc-400 select-none mr-3">16</span>  if (!session?.isValid) return NextResponse.redirect(&quot;/login&quot;);
                </div>
                <div><span className="text-zinc-600 select-none mr-3">17</span>  return NextResponse.next();</div>
                <div><span className="text-zinc-600 select-none mr-3">18</span>&#125;</div>
              </div>
            </div>

            {/* Panel 3: Q&A Investigation (4 cols) */}
            <div className="md:col-span-4 bg-surface-1/40 p-3.5 flex flex-col justify-between font-sans">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
                  <span className="font-semibold text-white">Q: How is auth enforced?</span>
                  <span>10:42 AM</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  Authentication is validated in edge middleware before routing to protected paths.
                  Tokens are checked against <code className="text-white bg-surface-2 px-1 py-0.5 rounded font-mono text-[11px]">getSession()</code> in Redis/PostgreSQL.
                </p>
                <div className="pt-2 border-t border-hairline">
                  <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">
                    Verified Citations
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-[11px] text-zinc-200">
                    <FileCode className="h-3 w-3 text-zinc-400" />
                    <span>src/middleware.ts:12–16</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-hairline pt-2.5 mt-2">
                <div className="rounded border border-hairline bg-surface-0 px-2.5 py-1.5 text-xs text-zinc-500 font-mono flex items-center justify-between">
                  <span>Ask a follow-up question...</span>
                  <span className="text-zinc-600">&crarr;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Bar */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 w-full flex flex-col items-center mt-12">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-500 mb-6">
          <span>842 files</span>
          <span>&middot;</span>
          <span>12,409 symbols</span>
          <span>&middot;</span>
          <span>18,320 AST chunks</span>
          <span>&middot;</span>
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            System indexed
          </span>
        </div>

        <a
          href="#system"
          className="flex items-center gap-1 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <span>Architecture &amp; Features</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}
