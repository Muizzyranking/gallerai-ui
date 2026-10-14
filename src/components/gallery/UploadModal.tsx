"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { CloseIcon, UploadIcon } from "@/components/icons";
import Button from "@/components/ui/custom-button";
import IconButton from "@/components/ui/IconButton";
import { UploadProgressOverlay } from "@/components/upload/UploadProgressOverlay";
import { useChunkedUpload } from "@/hooks/useChunkedUpload";
import { ApiError } from "@/lib/api";
import { pollCountsUntilStable, useUploadProgress } from "@/lib/uploads";

/** Attendee upload dialog — grid queue + single progress overlay. */
export default function UploadModal({
  isOpen,
  onClose,
  eventId,
  accessCode,
}: {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  accessCode?: string;
}) {
  const up = useChunkedUpload();
  const [doneMsg, setDoneMsg] = useState("");
  const qc = useQueryClient();
  const live = useUploadProgress(isOpen ? eventId : null, accessCode);

  if (!isOpen) return null;

  const handleUpload = async () => {
    setDoneMsg("");
    try {
      const result = await up.upload(eventId, true);
      if (!result) return;
      setDoneMsg(
        result.accepted > 0
          ? `${result.accepted} file${result.accepted === 1 ? "" : "s"} uploaded${result.skipped > 0 ? ` (${result.skipped} duplicate${result.skipped === 1 ? "" : "s"} skipped)` : ""}. Processing in the background…`
          : "Those files were already in the gallery — duplicates skipped.",
      );
      await pollCountsUntilStable(eventId, accessCode, () => qc.invalidateQueries({ queryKey: ["public", eventId] }));
      qc.invalidateQueries({ queryKey: ["public", eventId] });
      qc.invalidateQueries({ queryKey: ["gallery", eventId] });
    } catch (err) {
      setDoneMsg(err instanceof ApiError ? err.message : "Upload failed. Please try again.");
    }
  };

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
            padding: 32,
            maxWidth: 520,
            width: "100%",
            maxHeight: "80vh",
            overflow: "auto",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            border: "1px solid var(--rule)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600, color: "var(--ink)" }}>
              Upload photos
            </h2>
            <IconButton label="Close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--ink-2)", marginBottom: 24 }}>
            Share your photos and videos from this event. Uploads may require approval before appearing in the gallery.
          </p>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: 32,
              border: "2px dashed var(--rule-strong)",
              borderRadius: 12,
              cursor: "pointer",
              marginBottom: 24,
              background: "var(--bg)",
              transition: "all 0.2s",
            }}
          >
            <UploadIcon size={32} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--ink)" }}>
              Click to select photos or videos
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--ink-2)" }}>
              Images up to 10MB · Videos up to 200MB
            </span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => {
                up.handleFiles(Array.from(e.target.files || []));
                e.target.value = "";
              }}
              style={{ display: "none" }}
            />
          </label>

          {up.files.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--ink-2)", marginBottom: 12 }}
              >
                {up.files.length} file{up.files.length !== 1 ? "s" : ""} selected
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
                  gap: 8,
                  maxHeight: 260,
                  overflowY: "auto",
                }}
              >
                {up.files.map((file, i) => (
                  <div
                    key={`${file.id}-${i}`}
                    title={file.file.name}
                    style={{
                      position: "relative",
                      aspectRatio: "1",
                      borderRadius: 8,
                      overflow: "hidden",
                      background: "var(--bg-2)",
                      border: "1px solid var(--rule)",
                    }}
                  >
                    {file.previewUrl ? (
                      <div style={{ position: "relative", width: "100%", height: "100%" }}>
                        <Image
                          src={file.previewUrl}
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
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.6rem",
                          color: "var(--ink-2)",
                        }}
                      >
                        VIDEO
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => up.removeFile(file.id)}
                      aria-label={`Remove ${file.file.name}`}
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        width: 20,
                        height: 20,
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
                      <CloseIcon size={12} />
                    </button>
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: "8px 6px 4px",
                        background: "linear-gradient(transparent, rgba(0,0,0,0.65))",
                        color: "#fff",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.62rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {file.file.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {up.rejected.length > 0 && (
            <div
              style={{
                marginBottom: 24,
                padding: 12,
                background: "rgba(255,107,107,0.08)",
                borderRadius: 8,
                border: "1px solid rgba(255,107,107,0.25)",
              }}
            >
              {up.rejected.map((r) => (
                <p key={r.id} style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--coral)" }}>
                  {r.name} — {r.reason}
                </p>
              ))}
            </div>
          )}

          {doneMsg && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--ink)", marginBottom: 16 }}>
              {doneMsg}
            </p>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Button onClick={onClose} variant="ghost">
              {up.uploading ? "Close" : "Cancel"}
            </Button>
            <Button
              onClick={() => void handleUpload()}
              disabled={up.files.length === 0 || up.uploading}
              variant="primary"
            >
              {up.uploading ? "Uploading..." : `Upload ${up.files.length > 0 ? `(${up.files.length})` : ""}`}
            </Button>
          </div>
        </motion.div>
      </motion.div>
      <UploadProgressOverlay progress={live} active={up.uploading} label={up.chunkLabel} resetKey={up.uploadCount} />
    </AnimatePresence>
  );
}
