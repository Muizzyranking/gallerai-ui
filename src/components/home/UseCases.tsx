import Image from "next/image";
import Fade from "@/components/motion/Fade";
import { useCases } from "@/content/site";

export default function UseCases({ limit = 6 }: { limit?: number }) {
  const cards = useCases.cards.slice(0, limit);
  return (
    <section id="events" style={{ background: "var(--espresso)", color: "#f7ecdd" }}>
      <div className="wrap section-pad">
        <Fade>
          <div className="kicker" style={{ color: "#f0a49d", marginBottom: 14 }}>
            {useCases.kicker}
          </div>
          <h2 className="display-lg" style={{ color: "#fff", marginBottom: 14 }}>
            {useCases.heading}
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.65, color: "#cbb69f", maxWidth: 640, marginBottom: 44 }}>{useCases.body}</p>
        </Fade>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }} id="usecase-grid">
          {cards.map((c, i) => (
            <Fade key={c.title} delay={Math.min(i * 70, 210)}>
              <article
                style={{
                  background: "#3a2a20",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "var(--r-card)",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                <div style={{ position: "relative", aspectRatio: "16/10" }}>
                  <Image src={c.image} alt={c.imageAlt} fill sizes="(max-width: 900px) 100vw, 380px" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ padding: "20px 22px 24px" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 750, color: "#fff", marginBottom: 8 }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: "0.94rem", lineHeight: 1.65, color: "#d8c3ab" }}>{c.body}</p>
                </div>
              </article>
            </Fade>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          #usecase-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
