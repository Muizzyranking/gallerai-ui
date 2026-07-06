"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        stroke="var(--coral)"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="16" height="16" rx="3" />
        <path d="M7 11h8M11 7v8" />
      </svg>
    ),
    title: "Create your event",
    body: "Set up a gallery in under a minute. Name it, pick a date, add an optional access code for private events. Share the link anywhere.",
  },
  {
    num: "02",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        stroke="var(--coral)"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M4 14l4-4 3 3 4-5 5 6H4z" />
        <rect x="2" y="3" width="18" height="16" rx="2" />
        <circle cx="7.5" cy="8.5" r="1.5" />
      </svg>
    ),
    title: "Upload your photos",
    body: "Drop in photos from your camera, SD card, or phone. Batch upload thousands at once — we index every face automatically.",
  },
  {
    num: "03",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        stroke="var(--coral)"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="9" r="5" />
        <path d="M4 19c0-3.31 3.13-6 7-6s7 2.69 7 6" />
        <path d="M8 9l2 2 4-4" />
      </svg>
    ),
    title: "Guests find themselves",
    body: "Attendees open the link, snap a selfie or upload a photo. AI returns every shot they appear in — in under 3 seconds.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-pad"
      style={{ background: "var(--bg)", position: "relative" }}
    >
      <div className="rule-line" />

      <div className="wrap">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 64 }}
        >
          <div className="label-coral" style={{ marginBottom: 14 }}>
            How it works
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <h2 className="display-lg">
              Three steps.
              <br />
              <em style={{ fontStyle: "italic", color: "var(--coral)" }}>
                Zero friction.
              </em>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.92rem",
                color: "var(--ink-2)",
                lineHeight: 1.8,
                maxWidth: 400,
              }}
            >
              No more WhatsApp groups, no more shared drives, no more "can you
              send me the photos?"
            </p>
          </div>
        </motion.div>

        {/* Steps grid */}
        <div className="grid-3" style={{ background: "var(--rule)" }}>
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              style={{
                background: "var(--bg)",
                padding: "clamp(28px,5vw,52px) clamp(20px,4vw,44px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Ghost number */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 20,
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(4rem,8vw,7rem)",
                  fontWeight: 700,
                  color: "var(--rule)",
                  lineHeight: 1,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {s.num}
              </div>

              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: "var(--coral-subtle)",
                  border: "1px solid rgba(255,107,107,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                {s.icon}
              </div>

              <div className="label" style={{ marginBottom: 10 }}>
                Step {s.num}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.4rem,3vw,1.8rem)",
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: 12,
                  lineHeight: 1.1,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.87rem",
                  color: "var(--ink-2)",
                  lineHeight: 1.75,
                }}
              >
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
