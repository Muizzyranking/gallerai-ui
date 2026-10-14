"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const MATCHES = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop",
    alt: "Couple dancing at wedding",
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=300&auto=format&fit=crop",
    alt: "Group of friends laughing together",
  },
  {
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=300&auto=format&fit=crop",
    alt: "Friends taking photos at an event",
  },
  {
    src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=300&auto=format&fit=crop",
    alt: "Guests posing together",
  },
];

export default function FaceScanDemo() {
  const [phase, setPhase] = useState<"scanning" | "matched">("scanning");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setPhase("matched");
      return;
    }
    const t = setTimeout(
      () => setPhase((p) => (p === "scanning" ? "matched" : "scanning")),
      phase === "scanning" ? 2600 : 3400,
    );
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div
      className="card"
      style={{
        padding: 0,
        background: "var(--espresso)",
        borderColor: "var(--espresso)",
        color: "#fff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      aria-live="off"
    >
      <div style={{ position: "relative", aspectRatio: "1/1", background: "#17100b" }}>
        {phase === "scanning" ? (
          <>
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop"
              alt="Guest selfie being matched"
              fill
              sizes="300px"
              style={{ objectFit: "cover", opacity: 0.9 }}
            />
            {!reduced && <div className="scan-line" aria-hidden="true" />}
            {[
              {
                key: "tl",
                top: 10,
                left: 10,
                borderTop: "2.5px solid var(--accent)",
                borderLeft: "2.5px solid var(--accent)",
                borderTopLeftRadius: 6,
              },
              {
                key: "tr",
                top: 10,
                right: 10,
                borderTop: "2.5px solid var(--accent)",
                borderRight: "2.5px solid var(--accent)",
                borderTopRightRadius: 6,
              },
              {
                key: "bl",
                bottom: 10,
                left: 10,
                borderBottom: "2.5px solid var(--accent)",
                borderLeft: "2.5px solid var(--accent)",
                borderBottomLeftRadius: 6,
              },
              {
                key: "br",
                bottom: 10,
                right: 10,
                borderBottom: "2.5px solid var(--accent)",
                borderRight: "2.5px solid var(--accent)",
                borderBottomRightRadius: 6,
              },
            ].map((pos) => (
              <span
                key={pos.key}
                aria-hidden="true"
                style={{ position: "absolute", width: 26, height: 26, ...pos } as React.CSSProperties}
              />
            ))}
          </>
        ) : (
          <div
            className="fade-in"
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: 6,
              padding: 8,
              background: "#17100b",
            }}
          >
            {MATCHES.map((m) => (
              <div
                key={m.src}
                style={{
                  position: "relative",
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "1.5px solid rgba(62,207,142,0.55)",
                  minHeight: 0,
                }}
              >
                <Image src={m.src} alt={m.alt} fill sizes="150px" style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        )}

        {/* status overlay */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            right: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.64rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "#fff",
              background: phase === "matched" ? "rgba(30,122,90,0.9)" : "rgba(217,58,46,0.9)",
              borderRadius: 6,
              padding: "5px 9px",
            }}
          >
            {phase === "matched" ? "4 MATCHES" : "SCANNING"}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              color: "#fff",
              background: "rgba(20,12,8,0.65)",
              borderRadius: 6,
              padding: "5px 9px",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: phase === "matched" ? "#3ecf8e" : "var(--accent)",
              }}
              className={phase === "matched" ? undefined : "scan-blink"}
            />
            LIVE
          </span>
        </div>
      </div>

      {/* footer — fixed height, single line */}
      <div
        style={{
          height: 50,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {phase === "matched" ? (
          <span
            style={{
              fontSize: "0.84rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Highlight reel ready{" "}
            <span style={{ color: "#ffb3ab", borderBottom: "2px solid rgba(255,83,72,0.5)", marginLeft: 6 }}>
              Download
            </span>
          </span>
        ) : (
          <span
            style={{
              fontSize: "0.84rem",
              fontWeight: 600,
              color: "rgba(255,244,234,0.85)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Matching against 248 photos…
          </span>
        )}
      </div>
    </div>
  );
}
