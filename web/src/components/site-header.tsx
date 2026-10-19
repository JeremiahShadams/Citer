'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { productMenu, siteLinks } from '@/lib/site'
import { Wordmark } from '@/components/wordmark'

const menuTransition =
  'transition-[opacity,transform,visibility] motion-reduce:transition-none motion-reduce:translate-y-0'
const openState =
  'visible opacity-100 translate-y-0 duration-[160ms] ease-out-expo'
const closedState =
  'invisible opacity-0 translate-y-[5px] duration-[110ms] ease-out pointer-events-none'

export function SiteHeader() {
  const [productOpen, setProductOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const productRef = useRef<HTMLDivElement>(null)
  const productTriggerRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const mobileId = useId()

  useEffect(() => {
    if (!productOpen && !mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (productOpen) productTriggerRef.current?.focus()
      setProductOpen(false)
      setMobileOpen(false)
    }
    const onPointer = (e: PointerEvent) => {
      if (productRef.current && !productRef.current.contains(e.target as Node)) {
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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center px-4 md:px-6 lg:h-[76px] lg:px-8 xl:px-12">
        <a href="/" className="shrink-0 rounded-sm" aria-label="Citer home">
          <Wordmark />
        </a>

        <nav aria-label="Primary" className="ml-14 hidden md:block">
          <ul className="flex items-center gap-7 lg:gap-8">
            <li>
              <div
                ref={productRef}
                className="relative"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setProductOpen(false)
                }}
              >
                <button
                  ref={productTriggerRef}
                  type="button"
                  aria-expanded={productOpen}
                  aria-controls={menuId}
                  onClick={() => setProductOpen((v) => !v)}
                  className={cn(
                    'flex items-center gap-1 rounded-sm text-[14.5px] font-[480] tracking-[-0.1px] transition-colors duration-[120ms]',
                    productOpen ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  Product
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      'size-3.5 transition-transform duration-[160ms] motion-reduce:transition-none',
                      productOpen && 'rotate-180',
                    )}
                  />
                </button>
                <div
                  id={menuId}
                  className={cn(
                    'absolute left-[-12px] top-[calc(100%+14px)] w-80 rounded-lg border border-border bg-background p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]',
                    menuTransition,
                    productOpen ? openState : closedState,
                  )}
                >
                  <ul>
                    {productMenu.map((item) => (
                      <li key={item.title}>
                        <a
                          href={item.href}
                          onClick={() => setProductOpen(false)}
                          className="flex min-h-11 flex-col justify-center rounded-md px-3 py-2 transition-colors duration-[120ms] hover:bg-muted focus-visible:bg-muted"
                        >
                          <span className="text-[14px] font-[500] text-foreground">{item.title}</span>
                          <span className="text-[13px] text-muted-foreground">{item.description}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <a
                href={siteLinks.docs}
                className="rounded-sm text-[14.5px] font-[480] tracking-[-0.1px] text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"
              >
                Docs
              </a>
            </li>
            <li>
              <a
                href={siteLinks.source}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm text-[14.5px] font-[480] tracking-[-0.1px] text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"
              >
                Source
              </a>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={siteLinks.preview}
            className="inline-flex h-9 items-center rounded-md bg-foreground px-4 text-[14px] font-medium tracking-[-0.1px] text-background transition-opacity duration-[120ms] hover:opacity-90"
          >
            Explore Citer
          </a>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
            {mobileOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id={mobileId}
        className={cn(
          'absolute inset-x-0 top-full border-b border-border bg-background md:hidden',
          menuTransition,
          mobileOpen ? openState : closedState,
        )}
      >
        <nav aria-label="Mobile" className="px-4 pb-4 pt-2">
          <p className="px-2 pb-1 pt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            Product
          </p>
          <ul>
            {productMenu.map((item) => (
              <li key={item.title}>
                <a
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-11 items-center justify-between gap-4 rounded-md px-2 text-[15px] text-foreground hover:bg-muted"
                >
                  {item.title}
                  <span className="truncate text-[13px] text-muted-foreground">{item.description}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="my-2 h-px bg-border" />
          <ul>
            <li>
              <a href={siteLinks.docs} onClick={() => setMobileOpen(false)} className="flex min-h-11 items-center rounded-md px-2 text-[15px] text-foreground hover:bg-muted">
                Docs
              </a>
            </li>
            <li>
              <a href={siteLinks.source} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="flex min-h-11 items-center rounded-md px-2 text-[15px] text-foreground hover:bg-muted">
                Source
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-sm text-[14.5px] font-[480] tracking-[-0.1px] text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"
    >
      {children}
    </a>
  )
}