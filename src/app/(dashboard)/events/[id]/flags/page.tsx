"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/custom-button";
import { ApiError, events as eventsApi, type FlagItem, gallery as galleryApi, media as mediaApi } from "@/lib/api";

const PAGE_SIZE = 50;

const REASON_LABELS: Record<string, string> = {
  not_me: "That's not me",
  dislike: "Dislikes this photo",
  removed: "Asked to be removed",
};

export default function FlagsPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<FlagItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const { data: event } = useQuery({ queryKey: ["event", id], queryFn: () => eventsApi.get(id) });
  const flagsQuery = useQuery({
    queryKey: ["flags", id, page],
    queryFn: () => galleryApi.flags(id, { page, page_size: PAGE_SIZE }),
  });

  // Reset pagination and accumulated items when switching events.
  // `id` is not read here, but the effect must re-run when it changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset is keyed on event id
  useEffect(() => {
    setAllItems([]);
    setPage(1);
  }, [id]);

  useEffect(() => {
    if (!flagsQuery.data) return;
    const fresh = flagsQuery.data.items;
    setAllItems((prev) => (page === 1 ? fresh : [...prev, ...fresh.filter((f) => !prev.some((p) => p.id === f.id))]));
  }, [flagsQuery.data, page]);

  const removeMutation = useMutation({
    mutationFn: (mediaId: string) => mediaApi.softDelete(id, mediaId),
    onSuccess: (_r, mediaId) => {
      setAllItems((prev) => prev.filter((f) => f.media_id !== mediaId));
      qc.invalidateQueries({ queryKey: ["gallery", id] });
      qc.invalidateQueries({ queryKey: ["counts", id] });
      setToast("Photo moved to bin. Flags never delete anything automatically — that was your call.");
      setTimeout(() => setToast(null), 4000);
    },
    onError: (err) => {
      setToast(err instanceof ApiError ? err.message : "Move to bin failed.");
      setTimeout(() => setToast(null), 3000);
    },
  });

  const meta = flagsQuery.data?.meta;
  const PAD = "clamp(20px, 4vw, 44px)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ padding: `40px ${PAD} 28px`, borderBottom: "1px solid var(--rule)" }}>
        <Link
          href="/dashboard"
          className="db-backlink"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          ← Back to dashboard
        </Link>
        <p className="label-coral" style={{ marginBottom: 8 }}>
          Flag inbox
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem,4vw,2.6rem)",
            fontWeight: 600,
            color: "var(--ink)",
            lineHeight: 1,
          }}
        >
          {event?.title ?? "Flags"}
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-2)", marginTop: 8 }}>
          {meta ? `${meta.total} report${meta.total === 1 ? "" : "s"} from attendees` : "Loading…"} · Flags are pure
          signal — they never delete media.
        </p>
      </div>

      <div style={{ padding: `32px ${PAD}`, maxWidth: 800 }}>
        {flagsQuery.isLoading ? (
          <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-2)", padding: "40px 0", textAlign: "center" }}>
            Loading inbox…
          </p>
        ) : allItems.length === 0 ? (
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
                fontSize: "1.6rem",
              }}
            >
              ✓
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: 8,
              }}
            >
              No reports
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-2)" }}>
              When attendees report a photo as "not me", it lands here.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {allItems.map((flag) => (
                <motion.div
                  key={flag.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "var(--bg-1)",
                    border: "1px solid var(--rule)",
                    borderRadius: 10,
                    padding: "16px 18px",
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "var(--ink)",
                        }}
                      >
                        {REASON_LABELS[flag.reason] ?? flag.reason}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--ink-2)" }}>
                        {new Date(flag.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--ink-2)",
                        marginBottom: flag.note ? 6 : 0,
                      }}
                    >
                      photo {flag.media_id.slice(0, 8)}…
                    </p>
                    {flag.note && (
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.88rem",
                          color: "var(--ink)",
                          lineHeight: 1.55,
                        }}
                      >
                        "{flag.note}"
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <Link
                      href={`/events/${id}`}
                      target="_blank"
                      className="btn-ghost"
                      style={{ padding: "8px 14px", fontSize: "0.8rem" }}
                    >
                      View gallery ↗
                    </Link>
                    <Button
                      onClick={() => removeMutation.mutate(flag.media_id)}
                      disabled={removeMutation.isPending}
                      variant="danger"
                      size="sm"
                    >
                      Move to bin
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            {meta && meta.page < meta.pages && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
                <Button onClick={() => setPage((p) => p + 1)} variant="secondary">
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 300,
              padding: "12px 18px",
              background: "rgba(40,160,80,0.12)",
              border: "1px solid rgba(40,160,80,0.28)",
              borderRadius: 7,
              fontFamily: "var(--font-body)",
              fontSize: "0.88rem",
              color: "#5cc98b",
              maxWidth: 380,
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`.label-coral{font-family:var(--font-mono);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--coral);font-weight:600;}`}</style>
    </div>
  );
}
