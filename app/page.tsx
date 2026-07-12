import MainHero from "@/components/home/MainHero";
import EcosystemSection from "@/components/home/EcosystemSection";
import VerifySection from "@/components/home/VerifySection";
import GrowSection from "@/components/home/GrowSection";
import RecoverSection from "@/components/home/RecoverSection";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TechStack from "@/components/home/TechStack";

export default function HomePage() {
  return (
    <main>

      <MainHero />

      <EcosystemSection />

      <VerifySection />

      <GrowSection />

      <RecoverSection />

      <HowItWorks />

      <WhyChooseUs />

      <TechStack />

    </main>
  );
}