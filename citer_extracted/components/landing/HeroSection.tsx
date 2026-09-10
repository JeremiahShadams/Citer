"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import CodeGalaxyScene from "@/components/3d/CodeGalaxyScene";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[760px] w-full flex-col justify-between overflow-hidden px-3 pb-8 pt-24 sm:min-h-screen sm:px-0 sm:pb-12 sm:pt-28">
      {/* 3D WebGL Living Map Canvas Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <CodeGalaxyScene />
        {/* Soft radial vignettes to preserve typography legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/90 via-transparent to-void/90 pointer-events-none" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 mx-auto mt-10 w-full max-w-4xl px-1 text-center sm:mt-12 sm:px-4 md:mt-20">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-hairline-bright bg-surface-1/80 px-3.5 py-1 text-[11px] font-mono tracking-wider text-zinc-400 backdrop-blur-md mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse" />
          <span className="text-zinc-300 font-semibold tracking-widest uppercase">
            AI Code Intelligence
          </span>
          <span className="text-zinc-600">|</span>
          <span>Structural Repository Graph</span>
        </div>

        {/* Headline */}
        <h1 className="mb-5 text-[clamp(2.25rem,11vw,4.5rem)] font-bold leading-[1.04] tracking-tight text-white sm:mb-6">
          Understand the software.
          <br />
          <span className="text-zinc-500 font-light italic">
            Not just the code.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 font-normal leading-relaxed mb-10">
          Codebase Intelligence builds a structural and semantic map of your
          repository, then uses AI to investigate it, trace relationships, and
          answer engineering questions with source-level evidence.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-brand-blue/60 bg-brand-blue px-6 text-sm font-medium text-white shadow-lg hover:bg-blue-600 transition-all"
          >
            <span>Connect GitHub</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#investigation"
            className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-hairline-bright bg-surface-1/90 px-6 text-sm font-medium text-zinc-300 hover:bg-surface-2 hover:text-white transition-all backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-brand-cyan" />
            <span>Explore live demo</span>
          </a>
        </div>
      </div>

      {/* Bottom Technical Telemetry & Scroll Prompt */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 w-full flex flex-col items-center">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[10px] font-mono text-zinc-500 sm:gap-6 sm:text-[11px]">
          <span>842 files</span>
          <span>&middot;</span>
          <span>12,409 symbols</span>
          <span>&middot;</span>
          <span>18,320 semantic chunks</span>
          <span>&middot;</span>
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            System indexed
          </span>
        </div>

        <a
          href="#system"
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <span>Watch the system</span>
          <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
