import Image from "next/image";
import PageHero from "@/components/marketing/PageHero";
import Fade from "@/components/motion/Fade";

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About"
        title="Built for the people behind the event"
        lede="GallerAI exists so organisers stop chasing photos and guests stop scrolling. One gallery, everyone included. Edit this copy in src/content/site.ts."
      />
      <section style={{ background: "var(--paper)" }}>
        <div
          className="wrap section-pad"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}
          id="about-grid"
        >
          <Fade>
            <div
              style={{
                position: "relative",
                aspectRatio: "4/3",
                borderRadius: "var(--r-card)",
                overflow: "hidden",
                border: "1px solid var(--line)",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop"
                alt="Guests seated at a decorated event table"
                fill
                sizes="(max-width: 900px) 100vw, 560px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </Fade>
          <Fade delay={100}>
            <h2 className="display-md" style={{ marginBottom: 16 }}>
              Photos should feel like the event felt
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="body-text">
              <p>
                After every wedding, graduation or concert, the same problem appears: thousands of photos scattered
                across phones, drives and chats. The best moments exist, but nobody can find them.
              </p>
              <p>
                GallerAI collects every angle into one private gallery. Guests contribute in two taps and find
                themselves with one selfie. Organisers keep control of approvals, downloads and privacy.
              </p>
              <p>
                We are starting with celebrations of every size, from living-room birthdays to festival main stages, and
                building toward the fastest photo delivery in events.
              </p>
            </div>
          </Fade>
        </div>
      </section>
      <style>{`@media (max-width: 900px) { #about-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
