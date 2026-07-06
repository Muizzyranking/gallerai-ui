"use client";
import { motion } from "framer-motion";

const STATS = [
  { value: "50k+", label: "Events hosted" },
  { value: "2M+", label: "Photos served" },
  { value: "< 3s", label: "Face match time" },
  { value: "98.7%", label: "Match accuracy" },
];

export default function StatsBar() {
  return (
    <div style={{ display: "none" }}>
      <section style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", background: "var(--bg-1)" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }} className="stats-grid">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                style={{
                  padding: "clamp(28px,5vw,44px) 0",
                  textAlign: "center",
                  borderRight: i < STATS.length - 1 ? "1px solid var(--rule)" : "none",
                }}
              >
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3.6rem)", fontWeight: 600, color: "var(--coral)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)", marginTop: 8 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 600px) {
            .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          }
        `}</style>
      </section>
    </div>
  );
}
