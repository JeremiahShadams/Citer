import { ArrowRight } from 'lucide-react'
import { siteLinks } from '@/lib/site'
import { ProductPreview } from '@/components/product-preview'

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="mx-auto max-w-[1440px] px-4 pb-20 pt-16 md:px-6 md:pt-20 lg:px-8 lg:pb-28 lg:pt-24 xl:px-12">
      <div className="mx-auto flex max-w-[860px] flex-col items-center text-center">
        <p className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-[#a6b58a]">
          Codebase intelligence
        </p>
        <h1
          id="hero-heading"
          className="mt-5 text-balance text-[40px] font-[530] leading-[1.06] tracking-[-1.4px] text-foreground sm:text-[48px] sm:tracking-[-2px] lg:text-[64px] lg:leading-[1.02] lg:tracking-[-3px]"
        >
          Answers about your code, with the receipts.
        </h1>
        <p className="mt-6 max-w-[580px] text-pretty text-[17px] leading-[1.55] tracking-[-0.2px] text-muted-foreground lg:text-[18px]">
          Ask questions about your repository and get answers grounded in the code, with file and line references you can open and verify.
        </p>
        <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href={siteLinks.preview}
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-[15px] font-medium tracking-[-0.1px] text-background transition-opacity duration-[120ms] hover:opacity-90"
          >
            Explore Citer
            <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </a>
          <a
            href={siteLinks.docs}
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-[15px] font-medium tracking-[-0.1px] text-foreground transition-colors duration-[120ms] hover:bg-muted"
          >
            Read the docs
          </a>
        </div>
      </div>

      <div id="preview" className="mx-auto mt-16 max-w-[1120px] scroll-mt-28 lg:mt-20">
        <ProductPreview />
      </div>
    </section>
  )
}