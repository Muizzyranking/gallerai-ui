"use client";

import Link from "next/link";
import { useState } from "react";
import Fade from "@/components/motion/Fade";
import { faqTeaser } from "@/content/site";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div style={{ borderTop: "2px solid var(--ink)" }}>
      {items.map((f, i) => {
        const open = openIdx === i;
        return (
          <div key={f.q} style={{ borderBottom: "1px solid var(--line)" }}>
            <button
              type="button"
              onClick={() => setOpenIdx(open ? null : i)}
              aria-expanded={open}
              aria-controls={`faq-panel-${i}`}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "22px 4px",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1.4 }}>{f.q}</span>
              <span aria-hidden="true" className={`faq-icon${open ? " faq-icon-open" : ""}`}>
                {open ? "−" : "+"}
              </span>
            </button>
            <section id={`faq-panel-${i}`} className={`faq-panel${open ? " faq-panel-open" : ""}`}>
              <div style={{ overflow: "hidden" }}>
                <p className="body-text" style={{ padding: "0 4px 24px", maxWidth: 720 }}>
                  {f.a}
                </p>
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}

export default function FaqTeaser() {
  return (
    <section style={{ background: "var(--paper)" }}>
      <div
        className="wrap section-pad"
        style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "clamp(32px,5vw,64px)", alignItems: "start" }}
        id="faq-grid"
      >
        <Fade>
          <div className="kicker" style={{ marginBottom: 14 }}>
            {faqTeaser.kicker}
          </div>
          <h2 className="display-lg" style={{ marginBottom: 16 }}>
            {faqTeaser.heading}
          </h2>
          <p className="body-text" style={{ marginBottom: 24 }}>
            Straight answers for organisers, photographers and guests. The full list covers uploads, downloads, retention and face data.
          </p>
          <Link href="/faq" className="btn-secondary">
            Read all FAQs
          </Link>
        </Fade>
        <Fade delay={100}>
          <FaqList items={faqTeaser.items} />
        </Fade>
      </div>
      <style>{`
        @media (max-width: 900px) {
          #faq-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
