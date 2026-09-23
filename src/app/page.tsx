import { BenefitsSection } from "@/components/BenefitsSection";
import { HeroSearch } from "@/components/HeroSearch";
import { PartnersSection } from "@/components/PartnersSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StepsSection } from "@/components/StepsSection";

export default function Home() {
  return (
    <div className="app_container">
      <SiteHeader />
      <main>
        <HeroSearch />
        <StepsSection />
        <BenefitsSection />
        <PartnersSection />
      </main>
      <SiteFooter />
    </div>
  );
}
