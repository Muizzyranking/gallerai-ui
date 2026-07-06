"use client";
import Link from "next/link";

const COLS = {
  Product: [
    ["How it works", "#how-it-works"],
    ["Features", "#features"],
    ["Pricing", "#pricing"],
  ],
  Company: [
    ["About", "/about"],
    ["Blog", "/blog"],
    ["Careers", "/careers"],
  ],
  Legal: [
    ["Privacy", "/privacy"],
    ["Terms", "/terms"],
    ["Cookies", "/cookies"],
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg)", borderTop: "1px solid var(--rule)" }}>
      <div className="wrap">
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "clamp(24px,5vw,64px)", padding: "clamp(48px,8vw,72px) 0 clamp(32px,5vw,56px)" }}>
          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
              <svg width="24" height="24" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                <rect width="26" height="26" rx="5" fill="var(--coral)" />
                <path d="M7 13.5L11.5 18L19 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)" }}>
                Galler<em style={{ fontStyle: "italic", color: "var(--coral)" }}>AI</em>
              </span>
            </Link>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--ink-3)", lineHeight: 1.75, maxWidth: 260 }}>
              AI-powered event galleries. Guests find their photos instantly — no searching, no shared drives.
            </p>
          </div>

          {Object.entries(COLS).map(([heading, links]) => (
            <div key={heading}>
              <div className="label" style={{ marginBottom: 18 }}>
                {heading}
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--ink-3)", transition: "color 0.15s" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--ink)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--ink-3)";
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--rule)", padding: "18px 0", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: "var(--ink-4)", letterSpacing: "0.12em" }}>© {new Date().getFullYear()} GALLERAI. ALL RIGHTS RESERVED.</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: "var(--ink-4)", letterSpacing: "0.1em" }}>BUILT FOR EVENT PHOTOGRAPHERS.</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
