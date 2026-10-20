'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  ChevronDown,
  Github,
  Menu,
  X,
  MessageSquareCode,
  FileSearch,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { productMenu, siteLinks } from '@/lib/site'
import { Wordmark } from '@/components/wordmark'

const menuIcons = [MessageSquareCode, FileSearch, BookOpen, Sparkles]

export function SiteHeader() {
  const [productOpen, setProductOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileTriggerRef = useRef<HTMLButtonElement>(null)
  const hoverIntent = useRef<number | null>(null)
  const closeTimer = useRef<number | null>(null)
  const menuId = useId()
  const mobileId = useId()

  /* ------------------------------------------------------------------ */
  /*  Keyboard & outside-click dismissal                                 */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (productOpen) {
        setProductOpen(false)
        triggerRef.current?.focus()
      }
      if (mobileOpen) {
        setMobileOpen(false)
        mobileTriggerRef.current?.focus()
      }
    }
    const onPointer = (e: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProductOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [productOpen, mobileOpen])

  /* ------------------------------------------------------------------ */
  /*  Mobile menu: body scroll lock + focus trap                         */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!mobileOpen) return
    document.body.style.overflow = 'hidden'

    const menu = mobileMenuRef.current
    if (!menu) return

    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', trap)
    first?.focus()

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', trap)
    }
  }, [mobileOpen])

  /* ------------------------------------------------------------------ */
  /*  Hover-intent system (desktop dropdown)                             */
  /*  80ms open delay prevents accidental triggers while crossing the    */
  /*  nav bar. 150ms close delay lets the pointer travel into panel.     */
  /* ------------------------------------------------------------------ */
  const openDropdown = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    hoverIntent.current = window.setTimeout(() => {
      setProductOpen(true)
    }, 80)
  }, [])

  const scheduleClose = useCallback(() => {
    if (hoverIntent.current) {
      clearTimeout(hoverIntent.current)
      hoverIntent.current = null
    }
    closeTimer.current = window.setTimeout(() => {
      setProductOpen(false)
    }, 150)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <header className="sticky top-0 z-50 w-full border-b border-porcelain/[0.08] bg-obsidian/90 backdrop-blur-[15px]">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6 lg:h-[76px] lg:px-12">
        {/* ---- Wordmark ---- */}
        <a href="/" className="shrink-0" aria-label="Citer home">
          <Wordmark />
        </a>

        {/* ---- Desktop navigation ---- */}
        <nav aria-label="Primary" className="ml-14 hidden md:block">
          <ul className="flex items-center gap-8">
            {/* Product (dropdown) */}
            <li>
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={openDropdown}
                onMouseLeave={scheduleClose}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node))
                    setProductOpen(false)
                }}
              >
                <button
                  ref={triggerRef}
                  type="button"
                  aria-expanded={productOpen}
                  aria-controls={menuId}
                  onClick={() => setProductOpen((v) => !v)}
                  className={cn(
                    'flex items-center gap-1.5 text-[14.5px] font-[480] tracking-[-0.1px] transition-colors duration-[120ms]',
                    productOpen
                      ? 'text-porcelain'
                      : 'text-steel hover:text-porcelain'
                  )}
                >
                  Product
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      'size-3.5 transition-transform duration-[160ms] motion-reduce:transition-none',
                      productOpen && 'rotate-180'
                    )}
                  />
                </button>

                {/* Invisible hover bridge — prevents dead zone */}
                <div
                  className="absolute inset-x-[-12px] top-full h-3"
                  aria-hidden="true"
                />

                {/* Dropdown panel */}
                <div
                  id={menuId}
                  role="menu"
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                  className={cn(
                    'absolute left-[-12px] top-[calc(100%+12px)] w-[290px] rounded-xl border border-porcelain/[0.08] bg-surface-raised p-2.5',
                    'shadow-[0_16px_36px_-10px_rgba(0,0,0,0.8)]',
                    'transition-[opacity,transform,visibility] duration-[140ms] ease-out-expo',
                    'motion-reduce:transition-none',
                    productOpen
                      ? 'visible translate-y-0 opacity-100'
                      : 'invisible -translate-y-[5px] opacity-0 pointer-events-none'
                  )}
                >
                  <div className="px-2 pb-1.5 pt-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-steel/60">
                    Product
                  </div>
                  <ul className="flex flex-col gap-0.5">
                    {productMenu.map((item, idx) => {
                      const Icon = menuIcons[idx] || Sparkles
                      return (
                        <li key={item.title}>
                          {idx === 2 && (
                            <div className="my-1.5 h-px bg-porcelain/[0.08]" />
                          )}
                          <a
                            href={item.href}
                            role="menuitem"
                            onClick={() => setProductOpen(false)}
                            className="group flex min-h-[44px] items-center gap-3 rounded-lg px-2.5 py-2 transition-colors duration-[120ms] hover:bg-porcelain/[0.05]"
                          >
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-porcelain/[0.06] bg-porcelain/[0.03] text-steel transition-colors group-hover:border-porcelain/[0.12] group-hover:text-porcelain">
                              <Icon className="size-3.5" aria-hidden="true" />
                            </span>
                            <span className="flex flex-col">
                              <span className="text-[13.5px] font-[500] text-porcelain">
                                {item.title}
                              </span>
                              <span className="text-[11.5px] text-steel leading-tight">
                                {item.description}
                              </span>
                            </span>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </li>

            {/* Docs */}
            <li>
              <a
                href={siteLinks.docs}
                className="text-[14.5px] font-[480] tracking-[-0.1px] text-steel transition-colors duration-[120ms] hover:text-porcelain"
              >
                Docs
              </a>
            </li>

            {/* Source */}
            <li>
              <a
                href={siteLinks.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14.5px] font-[480] tracking-[-0.1px] text-steel transition-colors duration-[120ms] hover:text-porcelain"
              >
                Source
              </a>
            </li>
          </ul>
        </nav>

        {/* ---- Right side actions ---- */}
        <div className="ml-auto flex items-center gap-4">
          {/* GitHub */}
          <a
            href={siteLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center text-steel transition-colors duration-[120ms] hover:text-porcelain sm:flex"
            aria-label="GitHub repository"
          >
            <Github className="size-[18px]" />
          </a>

          {/* Primary CTA */}
          <a
            href={siteLinks.preview}
            className="hidden h-9 items-center gap-1.5 rounded-md bg-mint px-4 text-[14px] font-medium tracking-[-0.1px] text-obsidian transition-all duration-[120ms] hover:brightness-110 sm:inline-flex"
          >
            Get started
            <svg
              aria-hidden="true"
              className="size-3.5"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M6.5 3.5L11 8L6.5 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* Mobile menu trigger */}
          <button
            ref={mobileTriggerRef}
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md text-steel transition-colors hover:text-porcelain md:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">
              {mobileOpen ? 'Close menu' : 'Open menu'}
            </span>
            {mobileOpen ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* ---- Mobile backdrop ---- */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-obsidian/60 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ---- Mobile menu panel ---- */}
      <div
        ref={mobileMenuRef}
        id={mobileId}
        className={cn(
          'fixed inset-x-0 top-16 z-50 border-b border-porcelain/[0.08] bg-obsidian md:hidden',
          'transition-[opacity,transform,visibility] duration-200 ease-out-expo',
          'motion-reduce:transition-none',
          mobileOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-2 opacity-0 pointer-events-none'
        )}
      >
        <nav aria-label="Mobile" className="px-4 pb-6 pt-2">
          {/* Product section */}
          <p className="px-2 pb-1 pt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-steel/60">
            Product
          </p>
          <ul>
            {productMenu.map((item, idx) => {
              const Icon = menuIcons[idx] || Sparkles
              return (
                <li key={item.title}>
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-[44px] items-center gap-3 rounded-md px-2 text-[15px] text-porcelain transition-colors hover:bg-porcelain/[0.05]"
                  >
                    <Icon className="size-4 text-steel" aria-hidden="true" />
                    <span>{item.title}</span>
                    <span className="ml-auto truncate text-[13px] text-steel">
                      {item.description}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="my-3 h-px bg-porcelain/[0.08]" />

          {/* Direct links */}
          <ul>
            <li>
              <a
                href={siteLinks.docs}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center rounded-md px-2 text-[15px] text-porcelain transition-colors hover:bg-porcelain/[0.05]"
              >
                Docs
              </a>
            </li>
            <li>
              <a
                href={siteLinks.source}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center rounded-md px-2 text-[15px] text-porcelain transition-colors hover:bg-porcelain/[0.05]"
              >
                Source
              </a>
            </li>
            <li>
              <a
                href={siteLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center gap-2 rounded-md px-2 text-[15px] text-porcelain transition-colors hover:bg-porcelain/[0.05]"
              >
                <Github className="size-4" aria-hidden="true" />
                GitHub
              </a>
            </li>
          </ul>

          {/* Mobile CTA */}
          <div className="mt-4 px-2">
            <a
              href={siteLinks.preview}
              onClick={() => setMobileOpen(false)}
              className="flex h-11 w-full items-center justify-center gap-1.5 rounded-md bg-mint text-[15px] font-medium text-obsidian transition-colors hover:brightness-110"
            >
              Get started
              <svg
                aria-hidden="true"
                className="size-3.5"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M6.5 3.5L11 8L6.5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
