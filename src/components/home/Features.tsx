"use client";

import { motion } from "framer-motion";

const LARGE = {
  title: "AI face matching",
  body: "Our model scans facial landmarks and cross-references them against every photo in your gallery. Guests get their personalised album in under 3 seconds. No manual tagging. No searching.",
  icon: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="var(--coral)" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="13" cy="11" r="6" />
      <path d="M4 24c0-4.97 4.03-9 9-9s9 4.03 9 9" />
      <path d="M9 11l2.5 2.5L17 8" />
    </svg>
  ),
};

const SMALL = [
  {
    title: "Private access codes",
    body: "Lock any event behind a code. Only attendees with the link + code can view or download.",
    icon: (
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
        <rect x="3" y="9" width="14" height="10" rx="2" />
        <path d="M7 9V6a3 3 0 016 0v3" />
        <circle cx="10" cy="14" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Live webcam selfie",
    body: "Guests use their browser camera directly. No app download. Works on every device.",
    icon: (
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
        <path d="M2 6h11a2 2 0 012 2v5a2 2 0 01-2 2H2a2 2 0 01-2-2V8a2 2 0 012-2z" />
        <path d="M15 9l5-3v8l-5-3" />
      </svg>
    ),
  },
  {
    title: "Results in < 3 seconds",
    body: "Face vectors processed on the edge. Results arrive before the page finishes loading.",
    icon: (
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
        <path d="M12 2L3 12h8l-1 6 9-10h-8l1-6z" />
      </svg>
    ),
  },
  {
    title: "One-click download",
    body: "Full resolution, no watermarks. Download individually or grab a full ZIP.",
    icon: (
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
        <path d="M10 3v11M5 10l5 5 5-5" />
        <path d="M2 17h16" />
      </svg>
    ),
  },
  {
    title: "Privacy by design",
    body: "Face vectors aren't stored permanently. Photos encrypted at rest. Never used for training.",
    icon: (
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
        <path d="M10 2l7 2.8v5.7c0 4.2-3 7.8-7 9-4-1.2-7-4.8-7-9V4.8z" />
        <path d="M7 10l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Shareable event link",
    body: "Every event gets a clean link. Share it in WhatsApp, on a projector, or in a follow-up email.",
    icon: (
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
        <circle cx="15" cy="5" r="2" />
        <circle cx="5" cy="10" r="2" />
        <circle cx="15" cy="15" r="2" />
        <path d="M7 9l6-3M7 11l6 3" />
      </svg>
    ),
  },
];

const CELL_PAD = "clamp(20px,3.5vw,40px)";

function SmallCard({ f, i }: { f: (typeof SMALL)[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: i * 0.06, duration: 0.5 }}
      style={{
        background: "var(--bg)",
        padding: CELL_PAD,
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        /* Critical: prevent content from blowing out cell width */
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          flexShrink: 0,
          borderRadius: 8,
          background: "var(--bg-2)",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "var(--rule-strong)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--ink-2)",
        }}
      >
        {f.icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <h4
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.88rem",
            fontWeight: 600,
            color: "var(--ink)",
            marginBottom: 7,
            lineHeight: 1.3,
          }}
        >
          {f.title}
        </h4>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8rem",
            color: "var(--ink-2)",
            lineHeight: 1.72,
            margin: 0,
          }}
        >
          {f.body}
        </p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section
      id="features"
      className="section-pad"
      style={{
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="rule-line" />

      <div
        className="wrap"
        style={{
          /* ensure wrap never overflows viewport */ maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <div className="label-coral" style={{ marginBottom: 14 }}>
            Features
          </div>
          <h2 className="display-lg">
            Everything you need.
            <br />
            <em style={{ fontStyle: "italic", color: "var(--coral)" }}>Nothing you don't.</em>
          </h2>
        </motion.div>

        {/*
          Layout strategy (avoids overflow):
          - All grids use `minmax(0, 1fr)` so cells compress instead of overflow
          - Large card is a normal block on mobile (no row-span tricks)
          - Two separate grids (large + small) stacked vertically
        */}

        {/* ── LARGE CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: "var(--bg)",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "var(--rule)",
            padding: CELL_PAD,
            position: "relative",
            overflow: "hidden",
            marginBottom: 1,
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(255,107,107,0.07) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}
            className="feat-large-inner"
          >
            <div>
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: "var(--coral-subtle)",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "rgba(255,107,107,0.18)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 22,
                }}
              >
                {LARGE.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.7rem,3.5vw,2.4rem)",
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: 14,
                  lineHeight: 1.05,
                }}
              >
                {LARGE.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "var(--ink-2)",
                  lineHeight: 1.8,
                }}
              >
                {LARGE.body}
              </p>
            </div>

            {/* Accuracy meter */}
            <div style={{ minWidth: 0 }}>
              <div style={{ marginBottom: 32 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.56rem",
                      color: "var(--ink-3)",
                      letterSpacing: "0.14em",
                    }}
                  >
                    MATCH ACCURACY
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.56rem",
                      color: "var(--coral)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    98.7%
                  </span>
                </div>
                <div
                  style={{
                    height: 2,
                    background: "var(--rule-strong)",
                    borderRadius: 1,
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "98.7%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: "var(--coral)",
                      borderRadius: 1,
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 32 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.56rem",
                      color: "var(--ink-3)",
                      letterSpacing: "0.14em",
                    }}
                  >
                    MATCH SPEED
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.56rem",
                      color: "var(--coral)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {"< 3s"}
                  </span>
                </div>
                <div
                  style={{
                    height: 2,
                    background: "var(--rule-strong)",
                    borderRadius: 1,
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "92%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: "rgba(255,107,107,0.5)",
                      borderRadius: 1,
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  ["98.7%", "Accuracy"],
                  ["<3s", "Speed"],
                  ["∞", "Events"],
                ].map(([v, l]) => (
                  <div
                    key={l}
                    style={{
                      background: "var(--bg-2)",
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: "var(--rule-strong)",
                      borderRadius: 6,
                      padding: "12px 16px",
                      flex: 1,
                      minWidth: 80,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        color: "var(--coral)",
                        lineHeight: 1,
                      }}
                    >
                      {v}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.52rem",
                        color: "var(--ink-3)",
                        letterSpacing: "0.12em",
                        marginTop: 4,
                      }}
                    >
                      {l.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Use minmax(0,1fr) — critical to prevent cell overflow */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 1,
            background: "var(--rule)",
          }}
          className="feat-small-grid"
        >
          {SMALL.map((f, i) => (
            <SmallCard key={f.title} f={f} i={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .feat-large-inner   { grid-template-columns: 1fr !important; gap: 32px !important; }
          .feat-small-grid    { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
        }
        @media (max-width: 520px) {
          .feat-small-grid    { grid-template-columns: minmax(0,1fr) !important; }
        }
      `}</style>
    </section>
  );
}
