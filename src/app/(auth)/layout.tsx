import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}>
      <div
        style={{
          width: "50%",
          background: "var(--bg-1)",
          borderRight: "1px solid var(--rule)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 64px",
          position: "relative",
          overflow: "hidden",
        }}
        className="auth-panel-left"
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Ruled lines */}
        {[20, 40, 60, 80].map((p) => (
          <div key={p} style={{ position: "absolute", top: `${p}%`, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.025)", pointerEvents: "none" }} />
        ))}

        {/* Logo */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <rect width="26" height="26" rx="5" fill="var(--coral)" />
            <path d="M7 13.5L11.5 18L19 8" stroke="#0D0A0A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 600, color: "var(--ink)" }}>
            Galler<em style={{ fontStyle: "italic", color: "var(--coral)" }}>AI</em>
          </span>
        </Link>

        {/* Center message */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
              fontWeight: 600,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              marginBottom: 20,
            }}
          >
            Every face.
            <br />
            <em style={{ fontStyle: "italic", color: "var(--coral)" }}>Instantly found.</em>
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--ink-2)", lineHeight: 1.75, maxWidth: 300 }}>
            AI-powered event galleries where every guest finds their photos in under 3 seconds.
          </p>
        </div>

        {/* Bottom stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--rule)", position: "relative", zIndex: 1 }}>
          {[
            { v: "50k+", l: "Events" },
            { v: "2M+", l: "Photos" },
            { v: "< 3s", l: "Match" },
          ].map((s) => (
            <div key={s.l} style={{ background: "var(--bg-1)", padding: "20px 18px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 600, color: "var(--coral)", lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--ink-3)", letterSpacing: "0.15em", marginTop: 4 }}>{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ─────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 40px",
          position: "relative",
        }}
      >
        {/* Mobile logo (shows only on small screens) */}
        <div className="auth-mobile-logo" style={{ display: "none", position: "absolute", top: 28, left: 28 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <rect width="26" height="26" rx="5" fill="var(--coral)" />
              <path d="M7 13.5L11.5 18L19 8" stroke="#0D0A0A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)" }}>
              Galler<em style={{ fontStyle: "italic", color: "var(--coral)" }}>AI</em>
            </span>
          </Link>
        </div>

        <div style={{ width: "100%", maxWidth: 420 }}>{children}</div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .auth-panel-left  { display: none !important; }
          .auth-mobile-logo { display: block !important; }
        }
      `}</style>
    </div>
  );
}
