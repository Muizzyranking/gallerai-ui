import Link from "next/link";
import Fade from "@/components/motion/Fade";
import { pricing } from "@/content/site";

export default function Pricing({ compact = false }: { compact?: boolean }) {
  return (
    <section id="pricing" style={{ background: "var(--cream)", borderTop: "1px solid var(--line)" }}>
      <div className="wrap section-pad">
        <Fade>
          <div className="kicker" style={{ marginBottom: 14 }}>
            {pricing.kicker}
          </div>
          <h2 className="display-lg" style={{ marginBottom: 14 }}>
            {pricing.heading}
          </h2>
          <p className="body-text" style={{ maxWidth: 620, marginBottom: 40 }}>
            {pricing.body}
          </p>
        </Fade>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, alignItems: "stretch" }} id="pricing-grid">
          {pricing.plans.map((p, i) => (
            <Fade key={p.name} delay={i * 80}>
              <article
                className="card"
                style={{
                  padding: "30px 28px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: p.featured ? "var(--espresso)" : "#fff",
                  borderColor: p.featured ? "var(--espresso)" : "var(--line)",
                  color: p.featured ? "#f7ecdd" : "var(--ink)",
                }}
              >
                {p.featured && (
                  <span className="event-tag-light" style={{ alignSelf: "flex-start", marginBottom: 16 }}>
                    Most chosen
                  </span>
                )}
                <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "2.6rem", fontWeight: 800, lineHeight: 1 }}>{p.price}</span>
                </div>
                <div style={{ fontSize: "0.86rem", fontWeight: 600, color: p.featured ? "#cbb69f" : "var(--ink-3)", marginBottom: 12 }}>{p.per}</div>
                <p style={{ fontSize: "0.94rem", lineHeight: 1.6, color: p.featured ? "#d8c3ab" : "var(--ink-2)", marginBottom: 20 }}>{p.body}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
                  {p.points.map((pt) => (
                    <li
                      key={pt}
                      style={{ display: "flex", gap: 10, fontSize: "0.93rem", lineHeight: 1.55, color: p.featured ? "#f0e2cf" : "var(--ink-2)" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke={p.featured ? "var(--accent)" : "var(--accent-deep)"}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ flexShrink: 0, marginTop: 3 }}
                        aria-hidden="true"
                      >
                        <path d="M3 8.5l3.2 3L13 4.5" />
                      </svg>
                      {pt}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: "auto" }}>
                  <Link href={p.cta.href} className={p.featured ? "btn-primary" : "btn-secondary"} style={{ width: "100%" }}>
                    {p.cta.label}
                  </Link>
                </div>
              </article>
            </Fade>
          ))}
        </div>

        {!compact && (
          <Fade>
            <p className="small-text" style={{ marginTop: 26, maxWidth: 680 }}>
              {pricing.note}
            </p>
          </Fade>
        )}
      </div>
      <style>{`
        @media (max-width: 900px) {
          #pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
