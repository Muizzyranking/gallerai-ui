import Link from "next/link";
import { footer, site } from "@/content/site";
import Brand from "./Brand";

export default function Footer() {
  return (
    <footer style={{ background: "var(--espresso)", color: "#f5e9da" }}>
      <div className="wrap">
        <div
          style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: "clamp(28px,5vw,56px)", padding: "64px 0 40px" }}
          className="footer-grid"
        >
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <Brand dark link={false} />
              </div>
            </div>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#cbb69f", maxWidth: 300 }}>{footer.tagline}</p>
            <p style={{ marginTop: 18, fontSize: "0.9rem", color: "#e8d5bd" }}>
              <a href={`mailto:${site.contactEmail}`} style={{ borderBottom: "1px solid rgba(255,255,255,0.3)" }}>
                {site.contactEmail}
              </a>
            </p>
          </div>

          {footer.columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#a68d72",
                  marginBottom: 16,
                }}
              >
                {col.heading}
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} style={{ fontSize: "0.95rem", fontWeight: 500, color: "#f0e2cf" }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.14)",
            padding: "20px 0 26px",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.08em", color: "#a68d72" }}>{footer.bottom}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.08em", color: "#a68d72" }}>
            WEDDINGS · GRADUATIONS · CONCERTS · PARTIES · CONFERENCES
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid > div:first-child { grid-column: 1 / -1; }
        }
        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
