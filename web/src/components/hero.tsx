'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Code2, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteLinks } from '@/lib/site'
import { ProductPreview } from '@/components/product-preview'

export function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-24 xl:py-28"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(460px,520px)_1fr] lg:gap-14 xl:gap-20">
        {/* Left Column: Technical Narrative & Actions */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Eyebrow */}
          <div
            className={cn(
              'font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-mint',
              'transition-[opacity,transform] duration-500 ease-out-expo',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            )}
          >
            Codebase Intelligence
          </div>

          {/* Headline */}
          <h1
            id="hero-heading"
            className={cn(
              'mt-5 text-balance text-[38px] font-[550] leading-[1.08] tracking-[-1.5px] text-porcelain',
              'sm:text-[46px] sm:tracking-[-2px]',
              'xl:text-[56px] xl:leading-[1.05] xl:tracking-[-2.6px]',
              'transition-[opacity,transform] duration-[600ms] ease-out-expo delay-[60ms]',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            )}
          >
            Understand any codebase.
            <br />
            Trace every answer.
          </h1>

          {/* Supporting copy */}
          <p
            className={cn(
              'mt-5 max-w-[500px] text-pretty text-[16px] leading-[1.6] tracking-[-0.2px] text-steel',
              'sm:text-[17px] xl:text-[18px]',
              'transition-[opacity,transform] duration-[600ms] ease-out-expo delay-[120ms]',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            )}
          >
            Ask questions about your repository and get answers grounded in the
            code, with file and line references you can open and verify.
          </p>

          {/* CTA Actions */}
          <div
            className={cn(
              'mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row',
              'transition-[opacity,transform] duration-[600ms] ease-out-expo delay-[180ms]',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            )}
          >
            <a
              href={siteLinks.preview}
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-md bg-mint px-6 text-[14.5px] font-medium tracking-[-0.1px] text-obsidian transition-all duration-[140ms] hover:brightness-110"
            >
              Get started
              <svg
                aria-hidden="true"
                className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M6 3.5L10.5 8L6 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href={siteLinks.docs}
              className="inline-flex h-11 items-center justify-center rounded-md border border-porcelain/[0.12] px-6 text-[14.5px] font-medium tracking-[-0.1px] text-porcelain transition-all duration-[140ms] hover:border-porcelain/[0.22] hover:bg-porcelain/[0.04]"
            >
              Read the docs
            </a>
          </div>

          {/* Feature capability pills */}
          <div
            className={cn(
              'mt-10 flex flex-wrap items-center justify-center gap-6 text-[12.5px] text-steel/80 lg:justify-start',
              'transition-[opacity,transform] duration-[600ms] ease-out-expo delay-[240ms]',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            )}
          >
            <span className="flex items-center gap-1.5 transition-colors hover:text-porcelain">
              <MessageSquare className="size-3.5 text-steel/60" aria-hidden="true" />
              <span>Ask questions</span>
            </span>
            <span className="flex items-center gap-1.5 transition-colors hover:text-porcelain">
              <Code2 className="size-3.5 text-steel/60" aria-hidden="true" />
              <span>View source</span>
            </span>
            <span className="flex items-center gap-1.5 transition-colors hover:text-porcelain">
              <Compass className="size-3.5 text-steel/60" aria-hidden="true" />
              <span>Explore code</span>
            </span>
          </div>
        </div>

        {/* Right Column: Product Demonstration */}
        <div
          className={cn(
            'w-full max-w-[660px] lg:max-w-none',
            'transition-[opacity,transform] duration-[800ms] ease-out-expo delay-[260ms]',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <ProductPreview />
        </div>
      </div>
    </section>
  )
}
