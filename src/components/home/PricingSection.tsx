"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

type Cycle = "monthly" | "annual";

const TIERS = [
  {
    name: "Free",
    tagline: "Try it out",
    mo: 0,
    yr: 0,
    hot: false,
    cta: "Start free",
    href: "/register",
    inc: ["1 active event", "Up to 100 photos", "Face match for guests", "Shareable event link", "30-day photo hosting"],
    exc: ["Private access codes", "Custom branding", "Bulk download"],
  },
  {
    name: "Pro",
    tagline: "For photographers",
    mo: 19,
    yr: 15,
    hot: true,
    cta: "Get Pro",
    href: "/register?plan=pro",
    inc: ["Unlimited events", "Up to 5,000 photos/event", "Priority face matching", "Private access codes", "Custom event branding", "1-year photo hosting", "Bulk download", "Email support"],
    exc: [],
  },
  {
    name: "Business",
    tagline: "For agencies",
    mo: 59,
    yr: 47,
    hot: false,
    cta: "Get Business",
    href: "/register?plan=business",
    inc: ["Everything in Pro", "Unlimited photos/event", "White-label (custom domain)", "API access", "Dedicated compute", "Indefinite hosting", "Priority support", "5 team seats", "Analytics"],
    exc: [],
  },
];

const TOPUPS = [
  { label: "500 photos", price: "$4" },
  { label: "2,000 photos", price: "$12" },
  { label: "10,000 photos", price: "$39" },
];

const Check = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M1.5 6l3 3 6-6" />
  </svg>
);
const Dash = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--ink-4)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M2.5 6h7" />
  </svg>
);

export default function PricingSection() {
  const [cycle, setCycle] = useState<Cycle>("monthly");

  return (
    <section id="pricing" className="section-pad" style={{ background: "var(--bg)", position: "relative" }}>
      <div className="rule-line" />

      <div className="wrap">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 56 }}>
          <div className="label-coral" style={{ marginBottom: 14 }}>
            Pricing
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 24,
            }}
          >
            <h2 className="display-lg">
              Simple pricing.
              <br />
              <em style={{ fontStyle: "italic", color: "var(--coral)" }}>No surprises.</em>
            </h2>
            {/* Toggle */}
            <div
              style={{
                display: "flex",
                background: "var(--bg-2)",
                border: "1px solid var(--rule-strong)",
                borderRadius: 6,
                padding: 3,
                gap: 2,
                flexShrink: 0,
              }}
            >
              {(["monthly", "annual"] as Cycle[]).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCycle(c)}
                  style={{
                    padding: "9px 18px",
                    borderRadius: 4,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    transition: "all 0.2s",
                    background: cycle === c ? "var(--bg-3)" : "transparent",
                    color: cycle === c ? "var(--ink)" : "var(--ink-3)",
                  }}
                >
                  {c === "monthly" ? "Monthly" : "Annual"}
                  {c === "annual" && (
                    <span
                      style={{
                        marginLeft: 6,
                        background: "rgba(255,107,107,0.12)",
                        color: "var(--coral)",
                        fontSize: "0.58rem",
                        padding: "2px 6px",
                        borderRadius: 3,
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      −20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid-3" style={{ background: "var(--rule)", marginBottom: 1 }}>
          {TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                background: t.hot ? "var(--bg-2)" : "var(--bg)",
                padding: "clamp(28px,4vw,48px) clamp(20px,3vw,40px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {t.hot && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "var(--coral)",
                  }}
                />
              )}
              {t.hot && (
                <div
                  style={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    background: "var(--coral-subtle)",
                    border: "1px solid rgba(255,107,107,0.22)",
                    borderRadius: 99,
                    padding: "3px 10px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.52rem",
                    color: "var(--coral)",
                    letterSpacing: "0.15em",
                  }}
                >
                  POPULAR
                </div>
              )}

              <div
                className="label"
                style={{
                  marginBottom: 6,
                  color: t.hot ? "var(--coral)" : undefined,
                }}
              >
                {t.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.78rem",
                  color: "var(--ink-3)",
                  marginBottom: 24,
                }}
              >
                {t.tagline}
              </div>

              {/* Price */}
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 4,
                    lineHeight: 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: t.mo === 0 ? "2.8rem" : "3.5rem",
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {t.mo === 0 ? "Free" : `$${cycle === "monthly" ? t.mo : t.yr}`}
                  </span>
                  {t.mo > 0 && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.58rem",
                        color: "var(--ink-3)",
                        letterSpacing: "0.1em",
                        marginBottom: 8,
                      }}
                    >
                      /MO
                    </span>
                  )}
                </div>
                {t.mo > 0 && cycle === "annual" && (
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.56rem",
                      color: "var(--ink-3)",
                      letterSpacing: "0.08em",
                      marginTop: 5,
                    }}
                  >
                    BILLED ${t.yr * 12}/YR
                  </div>
                )}
              </div>

              {t.hot ? (
                <Link
                  href={t.href}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    marginBottom: 28,
                    display: "flex",
                  }}
                >
                  {t.cta}
                </Link>
              ) : (
                <Link
                  href={t.href}
                  className="btn-ghost"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    marginBottom: 28,
                    display: "flex",
                  }}
                >
                  {t.cta}
                </Link>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {t.inc.map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      gap: 9,
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ marginTop: 1, flexShrink: 0 }}>
                      <Check />
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8rem",
                        color: "var(--ink-2)",
                        lineHeight: 1.5,
                      }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
                {t.exc.map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      gap: 9,
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ marginTop: 1, flexShrink: 0 }}>
                      <Dash />
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8rem",
                        color: "var(--ink-4)",
                        lineHeight: 1.5,
                      }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Top-up strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: "var(--bg-1)",
            border: "1px solid var(--rule-strong)",
            borderTop: "none",
            padding: "clamp(20px,3vw,32px) clamp(16px,3vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="label" style={{ marginBottom: 6 }}>
              Top-up credits
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                color: "var(--ink-2)",
              }}
            >
              Need more photos for a single event? Credits never expire.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {TOPUPS.map((t) => (
              <button
                type="button"
                key={t.label}
                style={{
                  background: "var(--bg-2)",
                  border: "1px solid var(--rule-strong)",
                  borderRadius: 5,
                  padding: "11px 18px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,107,107,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--rule-strong)";
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    color: "var(--coral)",
                    lineHeight: 1,
                  }}
                >
                  {t.price}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.55rem",
                    color: "var(--ink-3)",
                    letterSpacing: "0.1em",
                    marginTop: 3,
                  }}
                >
                  {t.label.toUpperCase()}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
