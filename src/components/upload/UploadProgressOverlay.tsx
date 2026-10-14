"use client";

import { useEffect, useState } from "react";
import type { UploadProgress } from "@/lib/api";

export function UploadProgressOverlay({
  progress,
  active,
  label,
  resetKey,
}: {
  progress: UploadProgress | null;
  active?: boolean;
  label?: string;
  resetKey?: number | string;
}) {
  const [dismissed, setDismissed] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset key needed for rerun
  useEffect(() => {
    setDismissed(false);
  }, [resetKey]);

  const completed = progress?.completed ?? 0;
  const failed = progress?.failed ?? 0;
  const total = progress?.total ?? 0;
  const done = completed + failed;
  const pct = Math.round(progress?.percent ?? 0);

  const show = !dismissed && (active || (total > 0 && done < total));
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 130,
        width: "min(340px, calc(100vw - 40px))",
        background: "var(--bg-1)",
        border: "1px solid var(--rule-strong)",
        borderRadius: 12,
        boxShadow: "0 18px 44px rgba(0,0,0,0.45)",
        padding: "14px 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.86rem", fontWeight: 600, color: "var(--ink)" }}>
          {done >= total && total > 0 ? "Processing complete" : active ? "Uploading…" : "Processing…"}
        </span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--ink-2)",
            padding: 4,
            display: "flex",
            fontSize: "1rem",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {label && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--ink-2)", margin: "0 0 8px" }}>
          {label}
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--ink-2)" }}>
          {total > 0 ? `${done}/${total} files` : "Starting…"}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--ink-2)" }}>
          {pct}%{progress?.eta_seconds != null && done < total ? ` · ~${progress.eta_seconds}s left` : ""}
        </span>
      </div>

      <div style={{ height: 6, background: "var(--bg-3)", borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: done >= total && total > 0 ? "#10b981" : "var(--coral)",
            borderRadius: 3,
            transition: "width 0.4s",
          }}
        />
      </div>

      {failed > 0 && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.76rem", color: "var(--coral)", margin: "8px 0 0" }}>
          {failed} file{failed === 1 ? "" : "s"} failed to process
        </p>
      )}
    </div>
  );
}
