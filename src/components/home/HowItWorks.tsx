import Image from "next/image";
import Fade from "@/components/motion/Fade";
import { howItWorks } from "@/content/site";

/* Everything visible at a glance: three cards, no click-to-reveal. */
export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: "var(--paper)" }}>
      <div className="wrap section-pad">
        <Fade>
          <div className="kicker" style={{ marginBottom: 14 }}>
            {howItWorks.kicker}
          </div>
          <h2 className="display-lg" style={{ marginBottom: 14 }}>
            {howItWorks.heading}
          </h2>
          <p className="body-text" style={{ maxWidth: 620, marginBottom: 44 }}>
            {howItWorks.body}
          </p>
        </Fade>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} id="hiw-grid">
          {howItWorks.steps.map((s, i) => (
            <Fade key={s.n} delay={Math.min(i * 80, 160)}>
              <article
                className="card"
                style={{ overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}
              >
                <div style={{ position: "relative", aspectRatio: "16/10" }}>
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="(max-width: 900px) 100vw, 380px"
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                  />
                  <span style={{ position: "absolute", top: 12, left: 12 }} className="event-tag">
                    {s.n}
                  </span>
                </div>
                <div style={{ padding: "22px 22px 26px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.3rem",
                      fontWeight: 750,
                      letterSpacing: "-0.01em",
                      marginBottom: 10,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p className="small-text">{s.body}</p>
                </div>
              </article>
            </Fade>
          ))}
        </div>

        <Fade>
          <div
            className="card"
            style={{
              marginTop: 20,
              padding: "22px 26px",
              background: "var(--cream)",
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "var(--espresso)",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <p className="body-text" style={{ margin: 0 }}>
              <strong style={{ color: "var(--ink)" }}>Private when you need it. </strong>
              {howItWorks.privacyNote}
            </p>
          </div>
        </Fade>
      </div>
      <style>{`
        @media (max-width: 900px) {
          #hiw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
