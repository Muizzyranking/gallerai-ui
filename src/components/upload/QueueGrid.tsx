"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { CheckIcon, SpinnerIcon, XIcon } from "@/components/icons";
import type { QueuedFile, QueuedFileStatus } from "@/lib/uploads";

/** Compact upload-queue tiles that stay glanceable with 1000s of files. */
export default function QueueGrid({ files, onRemove }: { files: QueuedFile[]; onRemove: (id: string) => void }) {
  const badge = (status: QueuedFileStatus) => {
    switch (status) {
      case "complete":
        return { bg: "#10b981", icon: <CheckIcon size={12} /> };
      case "error":
        return { bg: "#ef4444", icon: <XIcon size={12} /> };
      case "uploading":
        return { bg: "var(--coral)", icon: <SpinnerIcon size={12} /> };
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
      <AnimatePresence>
        {files.map((f) => {
          const b = badge(f.status);
          return (
            <motion.div
              key={f.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              title={`${f.file.name}${f.error ? ` — ${f.error}` : ""}`}
              style={{
                position: "relative",
                aspectRatio: "1",
                borderRadius: 10,
                overflow: "hidden",
                background: "var(--bg-2)",
                border: "1px solid var(--rule)",
              }}
            >
              {f.previewUrl ? (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <Image
                    src={f.previewUrl}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, 220px"
                    unoptimized
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--ink-2)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                  }}
                >
                  VIDEO
                </div>
              )}
              {b && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: b.bg,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {b.icon}
                </span>
              )}
              {(f.status === "pending" || f.status === "error") && (
                <button
                  type="button"
                  onClick={() => onRemove(f.id)}
                  aria-label={`Remove ${f.file.name}`}
                  style={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.6)",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <XIcon size={12} />
                </button>
              )}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "10px 8px 6px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.65))",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.68rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {f.file.name}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
