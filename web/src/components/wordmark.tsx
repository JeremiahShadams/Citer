export function Wordmark() {
  return (
    <span className="flex items-center gap-2 text-porcelain">
      <svg aria-hidden="true" viewBox="0 0 20 20" className="size-[18px]" fill="none">
        <path d="M7 3H3v14h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
        <path d="M13 3h4v14h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
        <rect x="8" y="8.5" width="4" height="3" className="fill-mint" />
      </svg>
      <span className="text-[20px] font-semibold leading-none tracking-[-0.4px]">citer</span>
    </span>
  )
}