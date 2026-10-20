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
      className="mx-auto max-w-7xl px-4 pb-20 pt-16 md:px-6 md:pt-24 lg:px-12 lg:pb-28 lg:pt-32"
    >
      <div className="mx-auto flex max-w-[850px] flex-col items-center text-center">
        {/* Eyebrow */}
        <p
          className={cn(
            'font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-mint',
            'transition-[opacity,transform] duration-500 ease-out-expo',
            visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          )}
        >
          Codebase intelligence
        </p>

        {/* Headline */}
        <h1
          id="hero-heading"
          className={cn(
            'mt-6 text-balance text-[40px] font-[530] leading-[1.06] tracking-[-1.6px] text-porcelain',
            'sm:text-[48px] sm:tracking-[-2px]',
            'lg:text-[64px] lg:leading-[1.04] lg:tracking-[-3px]',
            'transition-[opacity,transform] duration-[600ms] ease-out-expo delay-[60ms]',
            visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          )}
        >
          Understand any codebase.
          <br />
          Trace every answer.
        </h1>

        {/* Supporting copy */}
        <p
          className={cn(
            'mt-6 max-w-[600px] text-pretty text-[17px] leading-[1.6] tracking-[-0.2px] text-steel',
            'lg:text-[18px]',
            'transition-[opacity,transform] duration-[600ms] ease-out-expo delay-[120ms]',
            visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          )}
        >
          Ask questions about your repository and get answers grounded in the
          code, with file and line references you can open and verify.
        </p>

        {/* CTAs */}
        <div
          className={cn(
            'mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row',
            'transition-[opacity,transform] duration-[600ms] ease-out-expo delay-[180ms]',
            visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          )}
        >
          <a
            href={siteLinks.preview}
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-md bg-mint px-6 text-[15px] font-medium tracking-[-0.1px] text-obsidian transition-all duration-[140ms] hover:brightness-110"
          >
            Explore Citer
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
            className="inline-flex h-11 items-center justify-center rounded-md border border-porcelain/[0.12] px-6 text-[15px] font-medium tracking-[-0.1px] text-porcelain transition-all duration-[140ms] hover:border-porcelain/[0.2] hover:bg-porcelain/[0.04]"
          >
            Read the docs
          </a>
        </div>
      </div>

      {/* Product demonstration */}
      <div
        className={cn(
          'mx-auto mt-16 max-w-[1120px] scroll-mt-28 lg:mt-20',
          'transition-[opacity,transform] duration-[800ms] ease-out-expo delay-[300ms]',
          visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-5'
        )}
      >
        <ProductPreview />
      </div>
    </section>
  )
}