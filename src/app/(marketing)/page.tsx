import FaqTeaser from "@/components/home/FaqTeaser";
import Features from "@/components/home/Features";
import FinalCta from "@/components/home/FinalCta";
import GalleryStrip from "@/components/home/GalleryStrip";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import UseCases from "@/components/home/UseCases";

export default function HomePage() {
  return (
    <>
      <Hero />
      <GalleryStrip />
      <HowItWorks />
      <UseCases />
      <Features />
      <Pricing />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}
