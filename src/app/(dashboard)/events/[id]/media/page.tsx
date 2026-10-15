"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ConfirmModal, PageHeader, PageSpinner, Toast } from "@/components/dashboard/primitives";
import Button from "@/components/ui/custom-button";
import { ApiError, events as eventsApi, type MediaTypeFilter, media as mediaApi } from "@/lib/api";

const TABS: { value: MediaTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "image", label: "Photos" },
  { value: "video", label: "Videos" },
];

const PAGE_SIZE = 30;

export default function OrganizerMediaPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [tab, setTab] = useState<MediaTypeFilter>("all");
  const [page, setPage] = useState(1);
  const [delId, setDelId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const notify = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const { data: event } = useQuery({
    queryKey: ["event", id],
    queryFn: () => eventsApi.get(id),
  });

  const { data: counts } = useQuery({
    queryKey: ["event-media-counts", id],
    queryFn: () => eventsApi.organizerCounts(id),
    retry: false,
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["event-media", id, tab, page],
    queryFn: () => eventsApi.organizerMedia(id, { type: tab, page, page_size: PAGE_SIZE }),
  });

  const deleteMutation = useMutation({
    mutationFn: (mediaId: string) => mediaApi.softDelete(id, mediaId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["event-media", id] });
      qc.invalidateQueries({ queryKey: ["event-media-counts", id] });
      qc.invalidateQueries({ queryKey: ["bin", id] });
      setDelId(null);
      notify("Moved to bin. Restore it from the bin anytime.", "success");
    },
    onError: (err) => {
      setDelId(null);
      notify(err instanceof ApiError ? err.message : "Delete failed.", "error");
    },
  });

  const items = data?.items ?? [];
  const meta = data?.meta;
  const pages = meta?.pages ?? 1;

  const switchTab = (t: MediaTypeFilter) => {
    setTab(t);
    setPage(1);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <PageHeader
        eyebrow="Media library"
        title={event?.title ?? "Event media"}
        backHref="/dashboard"
        backLabel="Back to dashboard"
        actions={
          <>
            <Link href={`/events/${id}/upload`} className="btn-ghost" style={{ padding: "10px 18px" }}>
              Upload photos
            </Link>
            <Link href={`/events/${id}`} target="_blank" className="btn-primary" style={{ padding: "10px 18px" }}>
              View gallery ↗
            </Link>
          </>
        }
      />

      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "24px clamp(20px, 4vw, 44px) 64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {TABS.map((t) => (
              <Button
                key={t.value}
                variant={tab === t.value ? "secondary" : "ghost"}
                onClick={() => switchTab(t.value)}
              >
                {t.label}
                {counts !== undefined &&
                  ` (${t.value === "all" ? counts.total : t.value === "image" ? counts.images : counts.videos})`}
              </Button>
            ))}
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              color: "var(--ink-2)",
              marginLeft: "auto",
            }}
          >
            {meta ? `${meta.total} ${meta.total === 1 ? "ITEM" : "ITEMS"}` : ""}
          </span>
        </div>

        {isLoading ? (
          <PageSpinner />
        ) : isError ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-2)", marginBottom: 16 }}>
              {error instanceof ApiError ? error.message : "Could not load media."}
            </p>
            <Button variant="secondary" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.4rem",
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: 8,
              }}
            >
              No media here yet
            </p>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-2)", marginBottom: 24 }}>
              {tab === "all" ? "Upload photos to fill this event." : `No ${tab === "image" ? "photos" : "videos"} yet.`}
            </p>
            <Link href={`/events/${id}/upload`} className="btn-primary" style={{ display: "inline-flex" }}>
              Upload photos
            </Link>
          </div>
        ) : (
          <>
            <div
              key={`${tab}-${page}`}
              className="event-grid-calm"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}
            >
              {items.map((m) => (
                <figure
                  key={m.id}
                  style={{
                    margin: 0,
                    background: "var(--bg-2)",
                    border: "1px solid var(--rule)",
                    borderRadius: 10,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ position: "relative", aspectRatio: "1/1", background: "var(--bg-3)" }}>
                    {m.media_type === "video" ? (
                      // biome-ignore lint/a11y/useMediaCaption: preview only, no audio track to caption
                      <video
                        src={mediaApi.proxyUrl(m.urls.display)}
                        preload="metadata"
                        playsInline
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      // Backend-proxied thumbnails are dynamic remote URLs, so
                      // next/image (build-time domains) does not apply here.
                      // biome-ignore lint/performance/noImgElement: proxied backend thumbnail, lazy-loaded
                      <img
                        src={mediaApi.proxyUrl(m.urls.thumbnail)}
                        alt={m.filename}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    )}
                  </div>
                  <figcaption
                    style={{
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        color: "var(--ink-2)",
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={m.filename}
                    >
                      {m.filename}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDelId(m.id)}
                      aria-label={`Move ${m.filename} to bin`}
                      style={{
                        background: "none",
                        border: "1px solid var(--rule-strong)",
                        borderRadius: 6,
                        cursor: "pointer",
                        color: "var(--ink-2)",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        padding: "4px 10px",
                        flexShrink: 0,
                      }}
                    >
                      Delete
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>

            {pages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 24 }}>
                <Button variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                  ← Prev
                </Button>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--ink-2)" }}>
                  Page {page} of {pages}
                </span>
                <Button variant="ghost" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages}>
                  Next →
                </Button>
              </div>
            )}

            <p style={{ textAlign: "center", marginTop: 28 }}>
              <Link
                href={`/events/${id}/bin`}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--ink-2)",
                }}
              >
                Deleted items live in the bin — restore or permanently remove them there →
              </Link>
            </p>
          </>
        )}
      </div>

      {delId && (
        <ConfirmModal
          title="Move to bin?"
          body="This removes the item from the gallery. You can restore it from the bin anytime."
          confirmLabel="Move to bin"
          loading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(delId)}
          onCancel={() => setDelId(null)}
        />
      )}
      <Toast msg={toast?.msg ?? ""} type={toast?.type ?? "success"} />
    </div>
  );
}
