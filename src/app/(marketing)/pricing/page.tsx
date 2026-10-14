import FaqTeaser from "@/components/home/FaqTeaser";
import FinalCta from "@/components/home/FinalCta";
import Pricing from "@/components/home/Pricing";
import PageHero from "@/components/marketing/PageHero";
import Fade from "@/components/motion/Fade";
import { pricing } from "@/content/site";

export default function PricingPage() {
  return (
    <>
      <PageHero
        kicker="Pricing"
        title="Pay per event, not per headache"
        lede="Start free. Upgrade when the guest list grows. All plans include guest uploads and selfie search."
      />
      <Pricing />
      <section style={{ background: "var(--paper)", borderTop: "1px solid var(--line)" }}>
        <div className="wrap section-pad">
          <Fade>
            <h2 className="display-md" style={{ marginBottom: 28 }}>
              Included in every plan
            </h2>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} id="included-grid">
            {pricing.everyPlan.map((f, i) => (
              <Fade key={f.title} delay={Math.min(i * 70, 210)}>
                <div className="card" style={{ padding: "24px 22px", height: "100%" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "var(--accent-deep)",
                      marginBottom: 8,
                    }}
                  >
                    0{i + 1}
                  </div>
                  <div style={{ fontSize: "1.02rem", fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
                  <p className="small-text">{f.body}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>
      <FaqTeaser />
      <FinalCta />
      <style>{`
        @media (max-width: 900px) {
          #included-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          #included-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
