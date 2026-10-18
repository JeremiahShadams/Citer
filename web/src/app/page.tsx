import { Navbar } from '@/components/nav/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { TechStackSection } from '@/components/landing/TechStackSection'
import { EvaluationSection } from '@/components/landing/EvaluationSection'
import { CTASection } from '@/components/landing/CTASection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TechStackSection />
        <EvaluationSection />
        <CTASection />
      </main>
    </div>
  )
}