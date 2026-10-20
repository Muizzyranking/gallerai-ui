"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import ScanFrame from "@/components/gallery/ScanFrame";
import { CameraIcon, CheckIcon, CloseIcon, SearchIcon } from "@/components/icons";
import Button from "@/components/ui/custom-button";
import IconButton from "@/components/ui/IconButton";
import { useFaceScan } from "@/hooks/useFaceScan";
import type { ScanComplete } from "@/lib/api";

/** Selfie scan dialog — home-screen scan animation over the preview. */
export default function FaceScanModal({
  isOpen,
  onClose,
  eventId,
  accessCode,
  onScanComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  accessCode?: string;
  onScanComplete: (session: ScanComplete) => void;
}) {
  const scan = useFaceScan(eventId, accessCode);
  const { phase } = scan;

  // biome-ignore lint/correctness/useExhaustiveDependencies: does not need to reset on scan change, only on open/close
  useEffect(() => {
    if (!isOpen) scan.reset();
  }, [isOpen]);

  useEffect(() => {
    if (phase === "success" && scan.session) {
      const t = setTimeout(() => {
        onScanComplete(scan.session as ScanComplete);
        onClose();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [phase, scan.session, onScanComplete, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "var(--bg-1)",
            borderRadius: 16,
            padding: 24,
            maxWidth: 400,
            width: "100%",
            maxHeight: "calc(100dvh - 48px)",
            overflowY: "auto",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            border: "1px solid var(--rule)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 600, color: "var(--ink)" }}>
              Find your photos
            </h2>
            <IconButton label="Close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.88rem",
              color: "var(--ink-2)",
              marginBottom: 16,
              lineHeight: 1.55,
            }}
          >
            Upload a selfie to find all images where you appear in this gallery. No account needed — nothing is stored.
          </p>

          {phase === "idle" && !scan.previewUrl && (
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: 26,
                border: "2px dashed var(--rule-strong)",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.2s",
                background: "var(--bg)",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "var(--coral-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--coral)",
                }}
              >
                <CameraIcon size={24} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "var(--ink)",
                    marginBottom: 4,
                  }}
                >
                  Click to upload or take photo
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--ink-2)" }}>
                  JPG, PNG up to 10MB
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) scan.selectFile(f);
                }}
                style={{ display: "none" }}
              />
            </label>
          )}

          {scan.previewUrl && phase !== "success" && (
            <div style={{ marginBottom: 16 }}>
              <ScanFrame
                src={scan.previewUrl}
                scanning={phase === "scanning"}
                label={phase === "scanning" ? "SCANNING" : undefined}
              />
              {phase === "scanning" && scan.statusLine && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    color: "var(--ink-2)",
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  {scan.statusLine}
                </p>
              )}
              {phase === "idle" && (
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <Button onClick={() => void scan.start()} variant="primary" className="flex-1">
                    <SearchIcon size={18} />
                    Find my photos
                  </Button>
                  <Button onClick={() => scan.selectFile(null)} variant="secondary">
                    Retake
                  </Button>
                </div>
              )}
            </div>
          )}

          {phase === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: "center", padding: 16 }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  color: "#fff",
                }}
              >
                <CheckIcon size={28} />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: 6,
                }}
              >
                Found {scan.matchCount} photo{scan.matchCount === 1 ? "" : "s"}!
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--ink-2)" }}>
                Switch to "My Photos" tab to see them
              </p>
            </motion.div>
          )}

          {phase === "error" && (
            <div
              style={{
                padding: 14,
                background: "rgba(255,107,107,0.1)",
                borderRadius: 8,
                border: "1px solid rgba(255,107,107,0.3)",
                marginBottom: 12,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.88rem",
                  color: "var(--coral)",
                  textAlign: "center",
                }}
              >
                {scan.error}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
