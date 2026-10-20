"use client";

import { CameraIcon, FaceIcon } from "@/components/icons";
import Button from "@/components/ui/custom-button";

export function EmptyStateScanPrompt({ onScan }: { onScan: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "var(--coral-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          color: "var(--coral)",
        }}
      >
        <FaceIcon size={40} />
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.3rem",
          fontWeight: 600,
          color: "var(--ink)",
          marginBottom: 12,
        }}
      >
        Find your photos
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.95rem",
          color: "var(--ink-2)",
          maxWidth: 400,
          margin: "0 auto 24px",
          lineHeight: 1.6,
        }}
      >
        Take a quick selfie to find all photos where you appear in this gallery. No account needed.
      </p>
      <Button onClick={onScan} variant="primary">
        <CameraIcon size={18} />
        Scan for my photos
      </Button>
    </div>
  );
}

export function EmptyStateNoPhotos() {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--bg-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          color: "var(--ink-2)",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.2rem",
          fontWeight: 600,
          color: "var(--ink)",
          marginBottom: 8,
        }}
      >
        No photos yet
      </h3>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-2)" }}>
        Photos will appear here once they&apos;re uploaded.
      </p>
    </div>
  );
}
