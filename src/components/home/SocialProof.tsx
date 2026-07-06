"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote: "I used to spend hours sending couples their photos. Now they just scan and download. My clients are obsessed.",
    name: "Amara Osei",
    role: "Wedding photographer, Lagos",
    av: "AO",
    bg: "#3d1a1a",
  },
  {
    quote: "600-person conference. Everyone found their photos in under 10 minutes. No one was chasing me for files.",
    name: "James Kofi",
    role: "Corporate events, Accra",
    av: "JK",
    bg: "#1a2340",
  },
  {
    quote: "The private access code is genius. Our client event stayed completely exclusive — no leaks at all.",
    name: "Chidinma Eze",
    role: "Event planner, Abuja",
    av: "CE",
    bg: "#28183d",
  },
  {
    quote: "300 graduates, 1,200 photos, everyone found theirs. GallerAI cut our post-event workload by 90%.",
    name: "Tunde Adeyemi",
    role: "Ceremony coordinator",
    av: "TA",
    bg: "#1a3020",
  },
];

function Stars() {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[...Array(5)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static decorative dots, never reordered
        <svg key={i} width="11" height="11" viewBox="0 0 11 11" fill="#F59E0B" aria-hidden="true">
          <path d="M5.5 1l1.29 2.61 2.88.42-2.08 2.03.49 2.87L5.5 7.51 2.92 8.93l.49-2.87L1.33 4.03l2.88-.42z" />
        </svg>
      ))}
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="section-pad" style={{ background: "var(--bg-1)", position: "relative" }}>
      <div className="rule-line" />

      <div className="wrap">
        {/* Pull quote */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ marginBottom: 64 }}>
          <div className="label-coral" style={{ marginBottom: 18 }}>
            Social proof
          </div>
          <blockquote
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.7rem,4vw,3.4rem)",
              fontWeight: 500,
              lineHeight: 1.12,
              color: "var(--ink)",
              letterSpacing: "-0.015em",
              maxWidth: 860,
            }}
          >
            "Event photos should reach guests <em style={{ fontStyle: "italic", color: "var(--coral)" }}>instantly</em>. Not days later in a shared folder."
          </blockquote>
        </motion.div>

        {/* Rating */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 16,
            marginBottom: 52,
            paddingBottom: 52,
            borderBottom: "1px solid var(--rule)",
          }}
        >
          <Stars />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.82rem",
              color: "var(--ink-2)",
            }}
          >
            <strong style={{ color: "var(--ink)" }}>4.9 / 5</strong> from 800+ event organisers
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              color: "var(--ink-3)",
              letterSpacing: "0.12em",
            }}
          >
            VERIFIED REVIEWS
          </span>
        </div>

        {/* Testimonial cards */}
        <div className="grid-4" style={{ background: "var(--rule)" }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                background: "var(--bg-1)",
                padding: "clamp(22px,4vw,36px) clamp(18px,3vw,32px)",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <Stars />
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.87rem",
                  color: "var(--ink-2)",
                  lineHeight: 1.75,
                  flex: 1,
                }}
              >
                "{t.quote}"
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingTop: 14,
                  borderTop: "1px solid var(--rule)",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: t.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.7)",
                    flexShrink: 0,
                  }}
                >
                  {t.av}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.56rem",
                      color: "var(--ink-3)",
                      letterSpacing: "0.1em",
                      marginTop: 2,
                    }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
