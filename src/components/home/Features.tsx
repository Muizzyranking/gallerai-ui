"use client";

import Fade from "@/components/motion/Fade";
import { features } from "@/content/site";

const ICONS = [
  <svg
    key="scan"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8" />
    <path d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8" />
    <path d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16" />
    <path d="M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
    <circle cx="12" cy="12" r="3.2" />
  </svg>,
  <svg
    key="layers"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </svg>,
  // controls — sliders
  <svg
    key="sliders"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 7h10" />
    <path d="M18 7h2" />
    <circle cx="16" cy="7" r="2" />
    <path d="M4 17h4" />
    <path d="M12 17h8" />
    <circle cx="10" cy="17" r="2" />
  </svg>,
  // private — lock
  <svg
    key="lock"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>,
];

const TONES = [
  {
    bg: "var(--espresso)",
    border: "var(--espresso)",
    title: "#fff",
    body: "#d8c3ab",
    chipBg: "rgba(255,255,255,0.1)",
    chip: "#ffb3ab",
    index: "rgba(255,244,234,0.5)",
  },
  {
    bg: "var(--accent-soft)",
    border: "#f3c9c3",
    title: "var(--ink)",
    body: "var(--ink-2)",
    chipBg: "#fff",
    chip: "var(--accent-deep)",
    index: "var(--accent-deep)",
  },
  {
    bg: "#fff",
    border: "var(--line)",
    title: "var(--ink)",
    body: "var(--ink-2)",
    chipBg: "var(--cream)",
    chip: "var(--ink)",
    index: "var(--ink-3)",
  },
  {
    bg: "var(--marigold-soft)",
    border: "#ecd9a8",
    title: "var(--ink)",
    body: "#6b5420",
    chipBg: "#fff",
    chip: "#8a6100",
    index: "#8a6100",
  },
];

export default function Features() {
  return (
    <section id="features" style={{ background: "var(--paper)", borderTop: "1px solid var(--line)" }}>
      <div className="wrap section-pad">
        <Fade>
          <div className="kicker" style={{ marginBottom: 14 }}>
            {features.kicker}
          </div>
          <h2 className="display-lg" style={{ marginBottom: 12, maxWidth: 560 }}>
            {features.heading}
          </h2>
          <p className="body-text" style={{ maxWidth: 600, marginBottom: 40 }}>
            Built around the guest experience: every photo in one place, and a one-selfie shortcut to the ones that
            matter to each person.
          </p>
        </Fade>

        <div id="feature-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 18 }}>
          {features.items.map((f, i) => {
            const tone = TONES[i % TONES.length];
            const wide = i % 2 === 0;
            return (
              <Fade key={f.title} delay={Math.min(i * 70, 210)} className={wide ? "feat-wide" : "feat-narrow"}>
                <article
                  className="card"
                  style={{
                    background: tone.bg,
                    borderColor: tone.border,
                    padding: "30px 30px 32px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      aria-hidden="true"
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: tone.chipBg,
                        color: tone.chip,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {ICONS[i % ICONS.length]}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        color: tone.index,
                      }}
                    >
                      0{i + 1}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: wide ? "1.65rem" : "1.35rem",
                      fontWeight: 750,
                      letterSpacing: "-0.015em",
                      lineHeight: 1.15,
                      color: tone.title,
                    }}
                  >
                    {f.title}
                  </h3>
                  <p style={{ fontSize: "1rem", lineHeight: 1.65, color: tone.body, maxWidth: wide ? "46ch" : "36ch" }}>
                    {f.body}
                  </p>
                </article>
              </Fade>
            );
          })}
        </div>
      </div>
      <style>{`
        .feat-wide { grid-column: span 7; }
        .feat-narrow { grid-column: span 5; }
        @media (max-width: 900px) {
          .feat-wide, .feat-narrow { grid-column: 1 / -1; }
        }
      `}</style>
    </section>
  );
}
