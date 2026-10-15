import Image from "next/image";
import Link from "next/link";
import Brand from "@/components/layout/Brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", background: "var(--paper)" }}>
      {/* Left — event mood panel */}
      <div
        style={{
          width: "46%",
          position: "sticky",
          top: 0,
          height: "100dvh",
          flexShrink: 0,
          overflow: "hidden",
          background: "var(--espresso)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
        className="auth-side"
      >
        <Image
          src="/images/concert-festival.jpg"
          alt="Guests celebrating with sparklers at an evening event"
          fill
          sizes="46vw"
          style={{ objectFit: "cover", opacity: 0.85 }}
          priority
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(24,14,10,0.55)" }} aria-hidden="true" />
        <div style={{ position: "relative", padding: "44px 48px" }}>
          <div style={{ marginBottom: 32 }}>
            <span
              style={{
                display: "inline-flex",
                background: "rgba(255,255,255,0.94)",
                borderRadius: 12,
                padding: "8px 14px 8px 10px",
              }}
            >
              <Brand />
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.9rem,3vw,2.8rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#fff",
              marginBottom: 14,
            }}
          >
            Every face.
            <br />
            Instantly found.
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.65,
              color: "rgba(255,244,234,0.88)",
              maxWidth: 360,
              marginBottom: 26,
            }}
          >
            Photos from every angle land in one gallery, and everyone finds the ones they appear in.
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Private unlisted galleries, with an optional access code",
              "Guest uploads with your approval",
              "Selfie search instead of endless scrolling",
            ].map((t) => (
              <li
                key={t}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "rgba(255,244,234,0.92)",
                  lineHeight: 1.5,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 7,
                    background: "var(--accent)",
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right — form */}
      <div
        className="auth-form"
        style={{
          flex: 1,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 32px",
          position: "relative",
        }}
      >
        <div className="auth-mobile" style={{ display: "none", position: "absolute", top: 22, left: 20 }}>
          <Brand size="sm" />
        </div>
        <div style={{ width: "100%", maxWidth: 440 }} className="fade-in">
          {children}
        </div>
        <p style={{ marginTop: 32, fontSize: "0.85rem", color: "var(--ink-3)" }}>
          <Link href="/privacy" style={{ borderBottom: "1px solid var(--line-strong)" }}>
            Privacy
          </Link>
          {" · "}
          <Link href="/terms" style={{ borderBottom: "1px solid var(--line-strong)" }}>
            Terms
          </Link>
          {" · "}
          <Link href="/faq" style={{ borderBottom: "1px solid var(--line-strong)" }}>
            FAQ
          </Link>
        </p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .auth-side { display: none !important; }
          .auth-mobile { display: block !important; }
          /* Clear the floating mobile logo so fields never choke it. */
          .auth-form { justify-content: flex-start !important; padding-top: 110px !important; }
        }
      `}</style>
    </div>
  );
}
