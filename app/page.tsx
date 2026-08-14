import Hero from "@/components/Blocks/Hero";
import { DaemonTicker } from "@/components/Blocks/DaemonTicker";
import { ShowcaseCarousel } from "@/components/Blocks/ShowcaseCarousel";
import { PainSection } from "@/components/Blocks/PainSection";
import { TurnSection } from "@/components/Blocks/TurnSection";
import { CrewSection } from "@/components/Blocks/CrewSection";
import { OrchestrationSection } from "@/components/Blocks/OrchestrationSection";
import { ControlSection } from "@/components/Blocks/ControlSection";
import { BeyondCodeSection } from "@/components/Blocks/BeyondCodeSection";
import { IntegrationsMarquee } from "@/components/Blocks/IntegrationsMarquee";
import { WhyFabrica } from "@/components/Blocks/FeatureSection";
import { ComparisonSection } from "@/components/Blocks/ComparisonSection";
import { TestimonialSection } from "@/components/Blocks/TestimonialSection";
import { PricingSection } from "@/components/Blocks/PricingSection";
import { FaqSection } from "@/components/Blocks/FaqSection";
import { FinalCta } from "@/components/Blocks/FinalCta";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F5F5F7]">
      {/* 1. Hero: Lead with the pain, mechanical promise & interactive command center */}
      <Hero />

      {/* 2. Live status strip: The 24/7 daemon stream */}
      <DaemonTicker />

      {/* 3. Vision gallery: The command center, visualized */}
      <ShowcaseCarousel />

      {/* 4. The Pain: The 11 PM 14-tab bottleneck, context loss & spreadsheet desync */}
      <PainSection />

      {/* 5. The Turn: "This is Fabrica." One confident pivot into crew direction */}
      <TurnSection />

      {/* 6. Meet Your Crew: 4 specialized agents with live interactive output inspectors */}
      <CrewSection />

      {/* 7. How It Actually Works: Parallel isolated worktrees & visual orchestration */}
      <OrchestrationSection />

      {/* 8. Business Control Layer: Approval gates, hard budget caps & autonomy dial */}
      <ControlSection />

      {/* 9. Beyond Code: Extensible business skills & plugins */}
      <BeyondCodeSection />

      {/* 10. Stack strip: Works with the stack you already trust */}
      <IntegrationsMarquee />

      {/* 11. The Core Pillars: Why founders direct the crew */}
      <WhyFabrica />

      {/* 12. Proof: Comparison matrix vs doing it alone and generic chat tools */}
      <ComparisonSection />

      {/* 13. Social Proof: Early adopter feedback */}
      <TestimonialSection />

      {/* 14. Pricing: Transparent tiers with built-in financial guardrails */}
      <PricingSection />

      {/* 15. FAQ: Technical & architectural depth in an accordion */}
      <FaqSection />

      {/* 16. Final CTA: "The Next AI Exit." Full-circle closure */}
      <FinalCta />
    </main>
  );
}
