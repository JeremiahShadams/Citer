'use client'

import { useEffect, useState } from 'react'
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
      className="relative mx-auto max-w-[1344px] px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pt-20"
    >
      {/* Subtle Linear-style ambient stage light */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-[380px] w-[800px] max-w-full bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(20,232,198,0.06),transparent_70%)]" />
      </div>

      {/* Centered Hero Narrative Block */}
      <div className="mx-auto flex max-w-[840px] flex-col items-center text-center">
        {/* Eyebrow */}
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/[0.04] px-3.5 py-1 text-[11.5px] font-mono uppercase tracking-[0.12em] text-mint',
            'transition-[opacity,transform] duration-500 ease-out-expo',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          )}
        >
          <span className="size-1.5 rounded-full bg-mint animate-pulse" aria-hidden="true" />
          Codebase Intelligence
        </div>

        {/* Headline */}
        <h1
          id="hero-heading"
          className={cn(
            'mt-5 text-balance text-[42px] font-[550] leading-[1.04] tracking-[-2px] text-porcelain',
            'sm:text-[56px] sm:tracking-[-2.4px]',
            'lg:text-[66px] lg:tracking-[-2.8px]',
            'transition-[opacity,transform] duration-[600ms] ease-out-expo delay-[60ms]',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          )}
        >
          Understand any codebase.
          <br />
          Trace every answer.
        </h1>

        {/* Supporting copy - tightened & increased contrast */}
        <p
          className={cn(
            'mt-5 max-w-[580px] text-pretty text-[17px] leading-[1.55] tracking-[-0.15px] text-[#B8C0CC] sm:text-[18px]',
            'transition-[opacity,transform] duration-[600ms] ease-out-expo delay-[120ms]',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          )}
        >
          Ask questions about your codebase. Get answers with file and line
          references you can verify.
        </p>

        {/* Action CTAs - simplified to 1 primary + 1 secondary */}
        <div
          className={cn(
            'mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row',
            'transition-[opacity,transform] duration-[600ms] ease-out-expo delay-[180ms]',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          )}
        >
          <a
            href={siteLinks.preview}
            className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-mint px-6 text-[14.5px] font-medium tracking-[-0.1px] text-obsidian shadow-[0_0_24px_-4px_rgba(20,232,198,0.25)] transition-all duration-[140ms] hover:brightness-110 sm:w-auto"
          >
            Try Citer
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
            className="inline-flex h-11 w-full items-center justify-center rounded-md border border-porcelain/[0.14] px-6 text-[14.5px] font-medium tracking-[-0.1px] text-porcelain transition-all duration-[140ms] hover:border-porcelain/[0.24] hover:bg-porcelain/[0.04] sm:w-auto"
          >
            Read the docs
          </a>
        </div>
      </div>

      {/* Centered Product Demonstration Stage - tightened gap */}
      <div
        className={cn(
          'mx-auto mt-10 max-w-[1200px] sm:mt-12 lg:mt-14',
          'transition-[opacity,transform] duration-[800ms] ease-out-expo delay-[240ms]',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        )}
      >
        <ProductPreview />
      </div>
    </section>
  )
}
