"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/custom-button";
import { ApiError, events as eventsApi, type MediaCard, media as mediaApi } from "@/lib/api";

const PAGE_SIZE = 50;

function Thumb({ card }: { card: MediaCard }) {
  if (card.media_type === "video") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "var(--bg-3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--ink-2)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
        }}
      >
        VIDEO
      </div>
    );
  }
  return (
    <Image
      src={mediaApi.proxyUrl(card.urls.thumbnail)}
      alt={card.filename}
      fill
      sizes="(max-width: 640px) 50vw, 220px"
      unoptimized
      style={{ objectFit: "cover" }}
    />
  );
}

export default function BinPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [confirmEmpty, setConfirmEmpty] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<MediaCard[]>([]);

  const { data: event } = useQuery({ queryKey: ["event", id], queryFn: () => eventsApi.get(id) });
  const { data: sidebar } = useQuery({
    queryKey: ["bin-events", id],
    queryFn: () => mediaApi.binEvents(id),
    retry: false,
  });
  const binQuery = useQuery({
    queryKey: ["bin", id, page],
    queryFn: () => mediaApi.bin(id, { page, page_size: PAGE_SIZE }),
  });

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["bin", id] });
    qc.invalidateQueries({ queryKey: ["bin-events", id] });
    qc.invalidateQueries({ queryKey: ["gallery", id] });
    qc.invalidateQueries({ queryKey: ["counts", id] });
  };

  const restoreMutation = useMutation({
    mutationFn: (mediaId: string) => mediaApi.restore(id, mediaId),
    onSuccess: (_r, mediaId) => {
      setAllItems((prev) => prev.filter((c) => c.id !== mediaId));
      invalidate();
      notify("Photo restored to gallery.");
    },
    onError: (err) => notify(err instanceof ApiError ? err.message : "Restore failed."),
  });

  const hardMutation = useMutation({
    mutationFn: (mediaId: string) => mediaApi.hardDelete(id, mediaId),
    onSuccess: (_r, mediaId) => {
      setAllItems((prev) => prev.filter((c) => c.id !== mediaId));
      invalidate();
      notify("Permanently deleted.");
    },
    onError: (err) => notify(err instanceof ApiError ? err.message : "Delete failed."),
  });

  const emptyMutation = useMutation({
    mutationFn: () => mediaApi.emptyBin(id),
    onSuccess: (r) => {
      setConfirmEmpty(false);
      setPage(1);
      invalidate();
      notify(`Bin emptied — ${r.removed} file${r.removed === 1 ? "" : "s"} removed.`);
    },
    onError: (err) => notify(err instanceof ApiError ? err.message : "Empty failed."),
  });

  const items = allItems;
  const meta = binQuery.data?.meta;

  // Reset pagination and accumulated items when switching events.
  // `id` is not read here, but the effect must re-run when it changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset is keyed on event id
  useEffect(() => {
    setAllItems([]);
    setPage(1);
  }, [id]);

  useEffect(() => {
    if (!binQuery.data) return;
    const fresh = binQuery.data.items;
    setAllItems((prev) => (page === 1 ? fresh : [...prev, ...fresh.filter((c) => !prev.some((p) => p.id === c.id))]));
  }, [binQuery.data, page]);

  const PAD = "clamp(20px, 4vw, 44px)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ padding: `40px ${PAD} 28px`, borderBottom: "1px solid var(--rule)" }}>
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontFamily: "var(--font-body)",
            fontSize: "0.88rem",
            color: "var(--ink-2)",
            textDecoration: "none",
            marginBottom: 24,
          }}
        >
          ← Back to dashboard
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <p className="label-coral" style={{ marginBottom: 8 }}>
              Recently deleted
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
              {event?.title ?? "Bin"}
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-2)", marginTop: 8 }}>
              {meta ? `${meta.total} file${meta.total === 1 ? "" : "s"} in bin` : "Loading…"}
            </p>
          </div>
          {items.length > 0 && (
            <Button onClick={() => setConfirmEmpty(true)} variant="danger" size="sm">
              Empty bin
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, padding: `32px ${PAD}`, maxWidth: 1100, alignItems: "flex-start" }}>
        {/* Sidebar */}
        {sidebar && sidebar.length > 1 && (
          <aside
            style={{
              width: 220,
              flexShrink: 0,
              background: "var(--bg-1)",
              border: "1px solid var(--rule)",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.12em",
                color: "var(--ink-2)",
                padding: "4px 8px 10px",
              }}
            >
              EVENTS WITH BIN
            </p>
            {sidebar.map((b) => (
              <Link
                key={b.event_id}
                href={`/events/${b.event_id}/bin`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "9px 10px",
                  borderRadius: 6,
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  color: "var(--ink)",
                  background: b.event_id === id ? "var(--bg-3)" : "transparent",
                  marginBottom: 2,
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.title}</span>
                <span
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--ink-2)", marginLeft: 8 }}
                >
                  {b.deleted_count}
                </span>
              </Link>
            ))}
          </aside>
        )}

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {binQuery.isLoading ? (
            <p
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-2)", padding: "40px 0", textAlign: "center" }}
            >
              Loading bin…
            </p>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: 8,
                }}
              >
                Bin is empty
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-2)" }}>
                Deleted photos and videos will show up here for easy recovery.
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                {items.map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: "var(--bg-1)",
                      border: "1px solid var(--rule)",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ aspectRatio: "1", background: "var(--bg-2)" }}>
                      <Thumb card={card} />
                    </div>
                    <div style={{ padding: 12 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.82rem",
                          color: "var(--ink)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginBottom: 10,
                        }}
                      >
                        {card.filename}
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Button
                          onClick={() => restoreMutation.mutate(card.id)}
                          disabled={restoreMutation.isPending}
                          variant="primary"
                          size="sm"
                          className="flex-1"
                        >
                          Restore
                        </Button>
                        <Button
                          onClick={() => hardMutation.mutate(card.id)}
                          disabled={hardMutation.isPending}
                          variant="danger"
                          size="sm"
                          className="flex-1"
                        >
                          Delete forever
                        </Button>
                      </div>
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
      </div>

      {confirmEmpty && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.65)",
            padding: "0 20px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--rule-strong)",
              borderRadius: 12,
              padding: 32,
              maxWidth: 420,
              width: "100%",
            }}
          >
            <h3
              style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--ink)", marginBottom: 10 }}
            >
              Empty the bin?
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.92rem",
                color: "var(--ink-2)",
                lineHeight: 1.65,
                marginBottom: 28,
              }}
            >
              This permanently deletes everything in this event's bin — storage, database rows and embeddings. It cannot
              be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Button onClick={() => setConfirmEmpty(false)} variant="ghost">
                Cancel
              </Button>
              <Button onClick={() => emptyMutation.mutate()} disabled={emptyMutation.isPending} variant="danger">
                {emptyMutation.isPending ? "Emptying…" : "Yes, empty bin"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

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
