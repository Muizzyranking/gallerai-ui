"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const content = {
  label: "Get started today",
  heading: {
    line1: "Your next event",
    line2: "deserves better.",
  },
  body: "Free to start. No credit card required. Create your first event and see why thousands of photographers choose GallerAI.",
  cta: {
    label: "Create free event",
    href: "/register",
  },
  badge: "FREE · 1 EVENT · 100 PHOTOS",
} as const;

export default function CtaBanner() {
  return (
    <section
      className="section-pad"
      style={{
        background: "var(--bg-1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="rule-line" />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 800,
          height: 400,
          background: "radial-gradient(ellipse,rgba(255,107,107,0.1) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Dot grids */}
      {["right:6%,top:15%", "left:6%,bottom:15%"].map((pos) => {
        const s: Record<string, string> = {};
        pos.split(",").forEach((p) => {
          const [k, v] = p.split(":");
          s[k] = v;
        });
        return (
          <div
            key={pos}
            style={{
              position: "absolute",
              ...(s as React.CSSProperties),
              opacity: 0.1,
              pointerEvents: "none",
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              width: 80,
            }}
          >
            {[...Array(16)].map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static decorative dots, never reordered
                key={i}
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "var(--coral)",
                }}
              />
            ))}
          </div>
        );
      })}

      <div className="wrap" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="label-coral" style={{ marginBottom: 22 }}>
            {content.label}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem,7vw,6.5rem)",
              fontWeight: 600,
              lineHeight: 0.9,
              letterSpacing: "-0.025em",
              color: "var(--ink)",
              marginBottom: 36,
            }}
          >
            {content.heading.line1}
            <br />
            <em style={{ fontStyle: "italic", color: "var(--coral)" }}>{content.heading.line2}</em>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.88rem,2vw,0.98rem)",
              color: "var(--ink-2)",
              lineHeight: 1.75,
              maxWidth: 420,
              margin: "0 auto 40px",
            }}
          >
            {content.body}
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Link href={content.cta.href} className="btn-primary" style={{ padding: "16px 44px", fontSize: "0.82rem" }}>
              {content.cta.label}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M2 6.5h9M7 2l4.5 4.5L7 11" />
              </svg>
            </Link>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                color: "var(--ink-3)",
                letterSpacing: "0.12em",
              }}
            >
              {content.badge}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
