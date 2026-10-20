import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <SiteHeader />
      <main>
        <Hero />
      </main>
    </div>
  )
}