import { Aperture } from "lucide-react";
import Link from "next/link";
import Brand from "@/components/layout/Brand";

export default function EventNotFound() {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 720,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,83,72,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Floating ghost aperture */}
      <Aperture
        aria-hidden="true"
        size={420}
        strokeWidth={0.4}
        style={{
          position: "absolute",
          right: "-6%",
          bottom: "-18%",
          color: "var(--coral)",
          opacity: 0.06,
          pointerEvents: "none",
          ["--r" as string]: "0deg",
          animation: "float-b 12s ease-in-out infinite",
        }}
      />

      <div style={{ position: "relative", textAlign: "center", maxWidth: 460 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <Brand />
        </div>

        <div
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(5rem, 14vw, 8.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            background: "linear-gradient(135deg, var(--ink) 30%, var(--coral))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 10,
          }}
        >
          404
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            marginBottom: 12,
          }}
        >
          This gallery doesn't exist
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--ink-2)", lineHeight: 1.65, marginBottom: 32 }}>
          The event may have been removed, made private, or the link might be incomplete. Check with the organiser for the correct link.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/" className="btn-primary">
            Go to GallerAI
          </Link>
          <Link href="/login" className="btn-ghost">
            Organiser sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
