'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Github, Terminal, ChevronDown } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Product' },
  { href: '/docs', label: 'Docs' },
  { href: '/blog', label: 'Blog' },
  { href: '/eval', label: 'Evaluation' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-sm border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" aria-label="Citer home">
              <span className="text-xl font-bold tracking-tight">Citer</span>
              <span className="hidden sm:inline-block h-4 w-px bg-border" aria-hidden="true" />
              <span className="hidden sm:inline text-xs text-muted-foreground font-medium">
                Ask. Cite. Ship.
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="https://github.com/JeremiahShadams/Citer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md"
                aria-label="GitHub repository"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                <span>GitHub</span>
              </Link>

              <Link
                href="/try"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-background bg-foreground rounded-md hover:opacity-90 transition-opacity"
              >
                <Terminal className="h-4 w-4" aria-hidden="true" />
                <span>Try Citer</span>
              </Link>
            </div>

            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-md"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
            mobileOpen ? 'max-h-64 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground rounded-md"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Link
                href="https://github.com/JeremiahShadams/Citer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground rounded-md"
                onClick={() => setMobileOpen(false)}
              >
                <Github className="h-5 w-5" aria-hidden="true" />
                <span>GitHub</span>
              </Link>
              <Link
                href="/try"
                className="flex items-center gap-2 px-4 py-2 text-base font-medium text-background bg-foreground rounded-md hover:opacity-90"
                onClick={() => setMobileOpen(false)}
              >
                <Terminal className="h-5 w-5" aria-hidden="true" />
                <span>Try Citer</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}