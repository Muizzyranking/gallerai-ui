"use client";
import Image from "next/image";

/** Home-screen style scan frame: selfie + sweeping scan line,
 *  corner brackets and a status pill. */
export default function ScanFrame({ src, scanning, label }: { src: string; scanning: boolean; label?: string }) {
  const corners = [
    {
      key: "tl",
      top: 10,
      left: 10,
      borderTop: "2.5px solid var(--coral)",
      borderLeft: "2.5px solid var(--coral)",
      borderTopLeftRadius: 6,
    },
    {
      key: "tr",
      top: 10,
      right: 10,
      borderTop: "2.5px solid var(--coral)",
      borderRight: "2.5px solid var(--coral)",
      borderTopRightRadius: 6,
    },
    {
      key: "bl",
      bottom: 10,
      left: 10,
      borderBottom: "2.5px solid var(--coral)",
      borderLeft: "2.5px solid var(--coral)",
      borderBottomLeftRadius: 6,
    },
    {
      key: "br",
      bottom: 10,
      right: 10,
      borderBottom: "2.5px solid var(--coral)",
      borderRight: "2.5px solid var(--coral)",
      borderBottomRightRadius: 6,
    },
  ];
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1",
        maxHeight: 260,
        borderRadius: 12,
        overflow: "hidden",
        background: "#17100b",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Image
          src={src}
          alt="Selfie being scanned"
          fill
          sizes="(max-width: 640px) 100vw, 480px"
          unoptimized
          style={{ objectFit: "cover", opacity: scanning ? 0.9 : 1 }}
        />
      </div>
      {scanning && <div className="scan-line" aria-hidden="true" />}
      {corners.map((pos) => (
        <span
          key={pos.key}
          aria-hidden="true"
          style={{ position: "absolute", width: 26, height: 26, ...pos } as React.CSSProperties}
        />
      ))}
      <span
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: "#fff",
          background: scanning ? "rgba(217,58,46,0.9)" : "rgba(20,12,8,0.65)",
          borderRadius: 6,
          padding: "5px 9px",
        }}
      >
        {label ?? (scanning ? "SCANNING" : "SELFIE")}
      </span>
    </div>
  );
}
