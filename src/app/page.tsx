import CtaBanner from "@/components/home/Ctabanner";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import HeroSection from "@/components/home/hero";
import PricingSection from "@/components/home/PricingSection";
import SocialProof from "@/components/home/SocialProof";
import StatsBar from "@/components/home/StatsBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <HowItWorks />
        <SocialProof />
        <Features />
        <CtaBanner />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
