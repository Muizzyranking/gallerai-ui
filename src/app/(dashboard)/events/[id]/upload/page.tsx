"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PageHeader, PageSpinner } from "@/components/dashboard/primitives";
import { CheckIcon, SettingsIcon, UploadIcon } from "@/components/icons";
import Button from "@/components/ui/custom-button";
import DropZone from "@/components/upload/DropZone";
import QueueGrid from "@/components/upload/QueueGrid";
import { UploadProgressOverlay } from "@/components/upload/UploadProgressOverlay";
import { useChunkedUpload } from "@/hooks/useChunkedUpload";
import { ApiError, events as eventsApi, media as mediaApi } from "@/lib/api";
import { UPLOAD_CHUNK_SIZE, useUploadProgress } from "@/lib/uploads";

export default function UploadPage() {
  const params = useParams();
  const eventId = params.id as string;
  const qc = useQueryClient();
  const up = useChunkedUpload();
  const [resultMsg, setResultMsg] = useState("");

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventsApi.get(eventId),
  });

  const { data: counts } = useQuery({
    queryKey: ["counts", eventId],
    queryFn: () => mediaApi.counts(eventId),
    refetchInterval: up.uploading ? 3000 : false,
  });

  const liveProgress = useUploadProgress(eventId);

  const triageQuery = useQuery({
    queryKey: ["manage", eventId],
    queryFn: () => mediaApi.manage(eventId, { page: 1, page_size: 50 }),
    retry: false,
    refetchInterval: up.uploading ? 5000 : false,
  });
  const attention = (triageQuery.data?.items ?? []).filter((c) => c.status === "failed" || c.error_message);

  if (eventLoading) return <PageSpinner />;

  const completedCount = up.files.filter((f) => f.status === "complete").length;

  const handleUpload = async () => {
    setResultMsg("");
    try {
      const result = await up.upload(eventId, false);
      if (!result) return;
      setResultMsg(
        `${result.accepted} file${result.accepted === 1 ? "" : "s"} accepted${result.skipped > 0 ? `, ${result.skipped} duplicate${result.skipped === 1 ? "" : "s"} skipped` : ""}. Face recognition and thumbnails are processing in the background.`,
      );
      qc.invalidateQueries({ queryKey: ["counts", eventId] });
      qc.invalidateQueries({ queryKey: ["manage", eventId] });
      qc.invalidateQueries({ queryKey: ["gallery", eventId] });
    } catch (err) {
      setResultMsg(err instanceof ApiError ? err.message : "Upload failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <PageHeader
        eyebrow="Upload Photos"
        title={event?.title ?? "Upload"}
        backHref={`/events/${eventId}/settings`}
        backLabel="Back to event settings"
        actions={
          <Link
            href={`/events/${eventId}/settings`}
            className="btn-ghost"
            style={{ padding: "10px 18px", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <SettingsIcon size={16} />
            Event Settings
          </Link>
        }
      />
      <p
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "0 clamp(20px,4vw,44px)",
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          color: "var(--ink-2)",
        }}
      >
        {counts
          ? `${counts.total} files in gallery (${counts.images} photos · ${counts.videos} videos)`
          : "Loading gallery…"}
      </p>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "28px clamp(20px,4vw,44px) 64px" }}>
        <div style={{ marginBottom: 32 }}>
          <DropZone onFiles={up.handleFiles} disabled={up.uploading} />
        </div>

        {up.rejected.length > 0 && (
          <div
            style={{
              marginBottom: 24,
              padding: 14,
              background: "rgba(255,107,107,0.08)",
              borderRadius: 10,
              border: "1px solid rgba(255,107,107,0.25)",
            }}
          >
            {up.rejected.map((r) => (
              <p
                key={r.id}
                style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--coral)", lineHeight: 1.7 }}
              >
                {r.name} — {r.reason}
              </p>
            ))}
          </div>
        )}

        {attention.length > 0 && (
          <div
            style={{
              marginBottom: 24,
              padding: 16,
              background: "rgba(255,107,107,0.06)",
              border: "1px solid rgba(255,107,107,0.25)",
              borderRadius: 10,
            }}
          >
            <h4
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--ink)",
                margin: "0 0 4px",
              }}
            >
              Needs attention ({attention.length})
            </h4>
            <p
              style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--ink-2)", margin: "0 0 12px" }}
            >
              These files failed processing. Re-upload them to retry.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {attention.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    background: "var(--bg-1)",
                    border: "1px solid var(--rule)",
                    borderRadius: 8,
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.82rem",
                        color: "var(--ink)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.filename}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        color: "var(--ink-2)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.error_message || `status: ${c.status} · storage: ${c.storage_status}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {up.files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ marginBottom: 24 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 600, color: "var(--ink)" }}>
                  Queue ({up.files.length})
                </h3>
                {up.pendingCount > 0 && (
                  <Button onClick={up.clear} variant="ghost">
                    Clear all
                  </Button>
                )}
              </div>

              <QueueGrid files={up.files} onRemove={up.removeFile} />

              {up.pendingCount > 0 && (
                <div style={{ marginTop: 24 }}>
                  <Button
                    onClick={() => void handleUpload()}
                    disabled={up.uploading}
                    variant="primary"
                    className="w-full"
                  >
                    {up.uploading ? (
                      <>
                        <UploadIcon size={18} />
                        {up.chunkLabel || `Uploading ${up.pendingCount} files...`}
                      </>
                    ) : (
                      <>
                        <UploadIcon size={18} />
                        Upload {up.pendingCount} file{up.pendingCount !== 1 ? "s" : ""}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {completedCount > 0 && up.pendingCount === 0 && up.files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: 20,
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                color: "#fff",
              }}
            >
              <CheckIcon size={24} />
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: 8,
              }}
            >
              Upload complete!
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-2)", marginBottom: 16 }}>
              {resultMsg ||
                `${completedCount} file${completedCount !== 1 ? "s" : ""} uploaded. Face recognition is processing in the background.`}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Button
                onClick={() => {
                  up.clear();
                  setResultMsg("");
                }}
                variant="secondary"
              >
                Upload more
              </Button>
              <Link href={`/events/${eventId}/settings`} className="btn-primary" style={{ padding: "12px 24px" }}>
                Back to settings
              </Link>
            </div>
          </motion.div>
        )}

        <div
          style={{
            marginTop: 48,
            padding: 24,
            background: "var(--bg-1)",
            border: "1px solid var(--rule)",
            borderRadius: 10,
          }}
        >
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--ink)",
              marginBottom: 12,
            }}
          >
            Tips for best results
          </h4>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "var(--ink-2)",
              lineHeight: 1.8,
            }}
          >
            <li>Large uploads are sent in batches of {UPLOAD_CHUNK_SIZE} — 1000 files just works</li>
            <li>Upload high-resolution photos for better face recognition accuracy</li>
            <li>Duplicates are skipped automatically, never errored</li>
            <li>Processing continues in the background — watch the live progress card</li>
          </ul>
        </div>
      </div>

      <UploadProgressOverlay
        progress={liveProgress}
        active={up.uploading}
        label={up.chunkLabel}
        resetKey={up.uploadCount}
      />
    </div>
  );
}
