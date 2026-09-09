import { FaqList } from "@/components/home/FaqTeaser";
import FinalCta from "@/components/home/FinalCta";
import PageHero from "@/components/marketing/PageHero";
import Fade from "@/components/motion/Fade";
import { faqFull } from "@/content/site";

export default function FaqPage() {
  return (
    <>
      <PageHero
        kicker="FAQ"
        title="Questions, answered plainly"
        lede="Everything organisers, photographers and guests ask before the event. Edit all entries in src/content/site.ts."
      />
      <section style={{ background: "var(--paper)" }}>
        <div className="wrap" style={{ maxWidth: 820, paddingTop: 48, paddingBottom: 72 }}>
          <Fade>
            <FaqList items={faqFull} />
          </Fade>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
