import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import AskTerminalDemo from "@/components/landing/AskTerminalDemo";
import CitationIlluminationDemo from "@/components/landing/CitationIlluminationDemo";
import TraditionalVsIntelligence from "@/components/landing/TraditionalVsIntelligence";
import ReasoningTimeline from "@/components/landing/ReasoningTimeline";
import ArchitectureModeDemo from "@/components/landing/ArchitectureModeDemo";
import ImpossibleQuestions from "@/components/landing/ImpossibleQuestions";
import SecurityAndScale from "@/components/landing/SecurityAndScale";
import FinalCta from "@/components/landing/FinalCta";

export default function Home() {
  return (
    <main className="min-h-screen bg-void text-zinc-100 selection:bg-brand-blue/30 selection:text-white">
      <LandingNavbar />
      <HeroSection />
      <AskTerminalDemo />
      <CitationIlluminationDemo />
      <TraditionalVsIntelligence />
      <ReasoningTimeline />
      <ArchitectureModeDemo />
      <ImpossibleQuestions />
      <SecurityAndScale />
      <FinalCta />
    </main>
  );
}