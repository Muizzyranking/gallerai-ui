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

export default function ApprovalsPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<MediaCard[]>([]);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const { data: event } = useQuery({ queryKey: ["event", id], queryFn: () => eventsApi.get(id) });
  const queueQuery = useQuery({
    queryKey: ["approvals", id, page],
    queryFn: () => mediaApi.pendingApproval(id, { page, page_size: PAGE_SIZE }),
  });

  // Reset pagination and accumulated items when switching events.
  // `id` is not read here, but the effect must re-run when it changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset is keyed on event id
  useEffect(() => {
    setAllItems([]);
    setPage(1);
  }, [id]);

  useEffect(() => {
    if (!queueQuery.data) return;
    const fresh = queueQuery.data.items;
    setAllItems((prev) => (page === 1 ? fresh : [...prev, ...fresh.filter((c) => !prev.some((p) => p.id === c.id))]));
  }, [queueQuery.data, page]);

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["approvals", id] });
    qc.invalidateQueries({ queryKey: ["gallery", id] });
    qc.invalidateQueries({ queryKey: ["counts", id] });
  };

  const approveMutation = useMutation({
    mutationFn: (mediaId: string) => mediaApi.approve(id, mediaId),
    onSuccess: (_r, mediaId) => {
      setAllItems((prev) => prev.filter((c) => c.id !== mediaId));
      invalidate();
      notify("Approved — face & storage pipeline started.");
    },
    onError: (err) => notify(err instanceof ApiError ? err.message : "Approve failed.", false),
  });

  const rejectMutation = useMutation({
    mutationFn: (mediaId: string) => mediaApi.reject(id, mediaId),
    onSuccess: (_r, mediaId) => {
      setAllItems((prev) => prev.filter((c) => c.id !== mediaId));
      invalidate();
      notify("Rejected — moved to bin.");
    },
    onError: (err) => notify(err instanceof ApiError ? err.message : "Reject failed.", false),
  });

  const meta = queueQuery.data?.meta;
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
        <p className="label-coral" style={{ marginBottom: 8 }}>
          Approval queue
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
          {event?.title ?? "Approvals"}
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-2)", marginTop: 8 }}>
          {meta ? `${meta.total} upload${meta.total === 1 ? "" : "s"} waiting for review` : "Loading…"}
        </p>
      </div>

      <div style={{ padding: `32px ${PAD}`, maxWidth: 1100 }}>
        {queueQuery.isLoading ? (
          <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-2)", padding: "40px 0", textAlign: "center" }}>
            Loading queue…
          </p>
        ) : allItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(16,185,129,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                color: "#10b981",
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
              All caught up
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-2)" }}>
              Attendee uploads waiting for approval will appear here.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {allItems.map((card) => (
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
                    {card.media_type === "video" ? (
                      <video
                        src={mediaApi.proxyUrl(card.urls.display)}
                        preload="metadata"
                        playsInline
                        muted
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Image
                        src={mediaApi.proxyUrl(card.urls.thumbnail)}
                        alt={card.filename}
                        fill
                        sizes="(max-width: 640px) 50vw, 220px"
                        unoptimized
                        style={{ objectFit: "cover" }}
                      />
                    )}
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
                        marginBottom: 4,
                      }}
                    >
                      {card.filename}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        color: "var(--ink-2)",
                        marginBottom: 10,
                      }}
                    >
                      {new Date(card.created_at).toLocaleString()}
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button
                        onClick={() => approveMutation.mutate(card.id)}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                        variant="primary"
                        size="sm"
                        className="flex-1"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => rejectMutation.mutate(card.id)}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                        variant="danger"
                        size="sm"
                        className="flex-1"
                      >
                        Reject
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
              background: toast.ok ? "rgba(40,160,80,0.12)" : "rgba(255,107,107,0.1)",
              border: "1px solid",
              borderColor: toast.ok ? "rgba(40,160,80,0.28)" : "rgba(255,107,107,0.28)",
              borderRadius: 7,
              fontFamily: "var(--font-body)",
              fontSize: "0.88rem",
              color: toast.ok ? "#5cc98b" : "var(--coral)",
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`.label-coral{font-family:var(--font-mono);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--coral);font-weight:600;}`}</style>
    </div>
  );
}
