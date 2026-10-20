"use client";

import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/icons";
import Button from "@/components/ui/custom-button";
import IconButton from "@/components/ui/IconButton";
import { type FlagReason, gallery as galleryApi, type MediaCard } from "@/lib/api";

const FLAG_REASONS: { value: FlagReason; label: string }[] = [
  { value: "not_me", label: "That's not me" },
  { value: "dislike", label: "I don't like this photo" },
  { value: "removed", label: "Please remove me from this" },
];

/** "Not me" report dialog — pure signal, never deletes. */
export default function FlagModal({
  isOpen,
  onClose,
  eventId,
  card,
  scanToken,
}: {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  card: MediaCard | null;
  scanToken?: string | null;
}) {
  const [reason, setReason] = useState<FlagReason>("not_me");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const flagMutation = useMutation({
    mutationFn: () => {
      if (!card) throw new Error("No card selected");
      return galleryApi.flag(eventId, {
        media_id: card.id,
        reason,
        scan_token: scanToken ?? null,
        note: note.trim() || null,
      });
    },
    onSuccess: () => setDone(true),
  });

  useEffect(() => {
    if (isOpen) {
      setReason("not_me");
      setNote("");
      setDone(false);
    }
  }, [isOpen]);

  if (!isOpen || !card) return null;

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
          zIndex: 110,
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
            padding: 28,
            maxWidth: 420,
            width: "100%",
            border: "1px solid var(--rule)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3
              style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}
            >
              Report this photo
            </h3>
            <IconButton label="Close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
          {done ? (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "var(--ink-2)", lineHeight: 1.6 }}>
              Thanks — the organizer has been notified. This doesn&apos;t delete the photo.
            </p>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {FLAG_REASONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReason(r.value)}
                    style={{
                      padding: "11px 14px",
                      borderRadius: 8,
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      color: "var(--ink)",
                      border: "1px solid",
                      borderColor: reason === r.value ? "rgba(255,107,107,0.5)" : "var(--rule-strong)",
                      background: reason === r.value ? "var(--coral-subtle)" : "var(--bg-2)",
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Anything else? (optional)"
                style={{
                  width: "100%",
                  background: "var(--bg-2)",
                  border: "1px solid var(--rule-strong)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.88rem",
                  color: "var(--ink)",
                  outline: "none",
                  resize: "vertical",
                  marginBottom: 16,
                }}
              />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Button onClick={onClose} variant="ghost">
                  Cancel
                </Button>
                <Button onClick={() => flagMutation.mutate()} disabled={flagMutation.isPending} variant="primary">
                  {flagMutation.isPending ? "Sending…" : "Send report"}
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
