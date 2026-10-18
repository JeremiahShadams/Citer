'use client'

import { Github, Twitter, Linkedin, Mail, ArrowRight, Terminal } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-foreground text-background" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
          Ready to understand any codebase?
        </h2>
        <p className="text-lg text-background/70 max-w-2xl mx-auto mb-10">
          Clone the repo, run Docker Compose, and start asking questions in under 2 minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="https://github.com/JeremiahShadams/Citer"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 px-8 py-3 text-base font-medium text-foreground bg-background/10 border border-background/20 rounded-lg hover:bg-background/20 transition-all duration-200"
          >
            <Github className="h-5 w-5" aria-hidden="true" />
            <span>Star on GitHub</span>
          </Link>
          <Link
            href="/try"
            className="group flex items-center justify-center gap-2 px-8 py-3 text-base font-medium text-foreground bg-background rounded-lg hover:opacity-90 transition-opacity"
          >
            <Terminal className="h-5 w-5" aria-hidden="true" />
            <span>Try locally</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="border-t border-background/20 pt-12">
          <p className="text-sm text-background/50 mb-6">
            Built by <a href="https://github.com/JeremiahShadams" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-background underline">Jeremiah Shadams</a> — 
            I turn unfamiliar codebases into answered questions.
          </p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/JeremiahShadams"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/50 hover:text-background transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/JeremiahShadams"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/50 hover:text-background transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/jeremiahadams"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/50 hover:text-background transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:jeremiahshadamoro@gmail.com"
              className="text-background/50 hover:text-background transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}