import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import CitationIlluminationDemo from "@/components/landing/CitationIlluminationDemo";
import TraditionalVsIntelligence from "@/components/landing/TraditionalVsIntelligence";
import SecurityAndScale from "@/components/landing/SecurityAndScale";
import FinalCta from "@/components/landing/FinalCta";

export default function Home() {
  return (
    <main className="min-h-screen bg-void text-zinc-100 selection:bg-zinc-800 selection:text-white">
      <LandingNavbar />
      <HeroSection />
      <CitationIlluminationDemo />
      <TraditionalVsIntelligence />
      <SecurityAndScale />
      <FinalCta />
    </main>
  );
}