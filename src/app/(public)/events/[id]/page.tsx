"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { EmptyStateNoPhotos, EmptyStateScanPrompt } from "@/components/gallery/EmptyStates";
import FaceScanModal from "@/components/gallery/FaceScanModal";
import FlagModal from "@/components/gallery/FlagModal";
import GalleryTabs, { type GalleryTab } from "@/components/gallery/GalleryTabs";
import MediaGrid from "@/components/gallery/MediaGrid";
import PasscodeGate from "@/components/gallery/PasscodeGate";
import UploadModal from "@/components/gallery/UploadModal";
import { DownloadIcon, FaceIcon, UploadIcon } from "@/components/icons";
import Brand from "@/components/layout/Brand";
import Button from "@/components/ui/custom-button";
import { useGalleryAccess } from "@/hooks/useGalleryAccess";
import {
  ApiError,
  downloads as downloadsApi,
  gallery as galleryApi,
  type MediaCard,
  type MediaTypeFilter,
  media as mediaApi,
  type ScanComplete,
} from "@/lib/api";

const PAGE_SIZE = 50;
const tokenKey = (eventId: string) => `scan_token_${eventId}`;

function headerDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function EventGalleryPage() {
  const params = useParams();
  const eventId = params.id as string;
  const access = useGalleryAccess(eventId);
  const { eventInfo, accessCode } = access;

  const [tab, setTab] = useState<GalleryTab>("all");
  const [scanOpen, setScanOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [flagCard, setFlagCard] = useState<MediaCard | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [scanToken, setScanToken] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);

  useEffect(() => {
    try {
      setScanToken(sessionStorage.getItem(tokenKey(eventId)));
    } catch {
      // ignore
    }
  }, [eventId]);

  const mine = tab === "mine";
  const type: MediaTypeFilter = tab === "photos" ? "image" : tab === "videos" ? "video" : "all";

  const galleryQuery = useInfiniteQuery({
    queryKey: ["gallery", eventId, tab, mine ? (scanToken ?? "none") : (accessCode ?? "")],
    queryFn: ({ pageParam }) =>
      mine
        ? galleryApi.anonymous(eventId, scanToken ?? "", { type, page: pageParam, page_size: PAGE_SIZE })
        : galleryApi.full(eventId, { type, page: pageParam, page_size: PAGE_SIZE, access_code: accessCode }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.meta.page < last.meta.pages ? last.meta.page + 1 : undefined),
    enabled: !access.needsCode && (!mine || !!scanToken),
    retry: false,
  });

  const items = galleryQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const counts = access.counts;
  const totalAll = counts?.total ?? galleryQuery.data?.pages[0]?.meta.total ?? 0;
  const mineCount = mine ? (galleryQuery.data?.pages[0]?.meta.total ?? items.length) : undefined;
  const tokenExpired = mine && galleryQuery.error instanceof ApiError && galleryQuery.error.status === 404;

  const handleScanComplete = useCallback(
    (session: ScanComplete) => {
      try {
        sessionStorage.setItem(tokenKey(eventId), session.scan_token);
      } catch {
        // ignore
      }
      setScanToken(session.scan_token);
      setTab("mine");
    },
    [eventId],
  );

  const switchTab = (t: GalleryTab) => {
    setTab(t);
    setSelected(new Set());
    setSelectMode(false);
  };

  const handleZip = async (mode: "all" | "selection" | "scan") => {
    setZipping(true);
    try {
      await downloadsApi.zip(eventId, {
        mode,
        media_ids: mode === "selection" ? [...selected] : undefined,
        scan_token: mode === "scan" ? scanToken : null,
        media_type: tab === "photos" ? "image" : tab === "videos" ? "video" : "all",
      });
    } finally {
      setZipping(false);
    }
  };

  if (access.needsCode) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <PasscodeGate
          onVerified={access.verify}
          initialError={access.codeRejected ? "Invalid access code. Try again." : undefined}
        />
      </div>
    );
  }

  if (access.notFound) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          padding: 20,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--ink)", marginBottom: 8 }}>
            Event not found
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-2)" }}>
            This event may have been removed or the link is wrong.
          </p>
        </div>
      </div>
    );
  }

  const title = eventInfo?.title ?? "Event gallery";
  const coverUrl =
    eventInfo?.cover_photo_url && !eventInfo.cover_photo_url.startsWith("http")
      ? mediaApi.proxyUrl(eventInfo.cover_photo_url)
      : (eventInfo?.cover_photo_url ?? null);
  const settings = access.settings;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Slim gallery top bar */}
      <div
        style={{
          borderBottom: "1px solid var(--rule)",
          background: "color-mix(in srgb, var(--paper) 88%, transparent)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "10px clamp(20px, 5vw, 60px)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Brand size="sm" />
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              color: "var(--ink-2)",
              whiteSpace: "nowrap",
            }}
          >
            {totalAll > 0 ? `${totalAll} ${totalAll === 1 ? "PHOTO" : "PHOTOS"}` : "GALLERY"}
          </span>
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          position: "relative",
          minHeight: coverUrl ? 340 : 220,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(28px, 5vw, 60px) clamp(20px, 5vw, 60px)",
          overflow: "hidden",
          background: coverUrl ? "#1d130d" : "var(--bg-2)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        {coverUrl && (
          <>
            <img
              src={coverUrl}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(20,12,8,0.25) 0%, rgba(20,12,8,0.35) 45%, rgba(20,12,8,0.82) 100%)",
              }}
            />
          </>
        )}
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {headerDate(eventInfo?.event_date ?? null) && (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: coverUrl ? "rgba(255,244,234,0.85)" : "var(--accent-ink)",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  marginBottom: 12,
                }}
              >
                {headerDate(eventInfo?.event_date ?? null)}
              </div>
            )}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: coverUrl ? "#fff" : "var(--ink)",
                marginBottom: 12,
                lineHeight: 1.05,
                textWrap: "balance",
              }}
            >
              {title}
            </h1>
            {eventInfo?.description && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1.05rem",
                  color: coverUrl ? "rgba(255,244,234,0.88)" : "var(--ink-2)",
                  maxWidth: 620,
                  lineHeight: 1.65,
                  marginBottom: 16,
                }}
              >
                {eventInfo.description}
              </p>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                `${counts?.total ?? totalAll} photos`,
                `${counts?.images ?? 0} images`,
                `${counts?.videos ?? 0} videos`,
              ].map((stat) => (
                <span
                  key={stat}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "6px 12px",
                    borderRadius: 99,
                    background: coverUrl ? "rgba(255,255,255,0.14)" : "var(--accent-soft)",
                    color: coverUrl ? "#fff" : "var(--accent-ink)",
                    border: coverUrl ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent",
                    backdropFilter: coverUrl ? "blur(6px)" : undefined,
                  }}
                >
                  {stat}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--bg)",
          borderBottom: "1px solid var(--rule)",
          padding: "0 clamp(20px, 5vw, 60px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            padding: "16px 0",
          }}
        >
          <GalleryTabs
            tab={tab}
            onTab={switchTab}
            total={totalAll}
            mineCount={mineCount}
            images={counts?.images}
            videos={counts?.videos}
            scanned={!!scanToken}
          />

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            {settings.downloads_enabled && items.length > 0 && (
              <Button onClick={() => setSelectMode((s) => !s)} variant="secondary">
                {selectMode ? `Done (${selected.size})` : "Select"}
              </Button>
            )}
            {selectMode && selected.size > 0 && (
              <Button onClick={() => void handleZip("selection")} disabled={zipping} variant="secondary">
                <DownloadIcon size={18} />
                {zipping ? "Preparing…" : `Download ${selected.size} as zip`}
              </Button>
            )}
            {!selectMode && settings.downloads_enabled && items.length > 0 && (
              <Button onClick={() => void handleZip(mine ? "scan" : "all")} disabled={zipping} variant="secondary">
                <DownloadIcon size={18} />
                {zipping ? "Preparing…" : mine ? "Download my photos" : "Download all"}
              </Button>
            )}
            <Button onClick={() => setScanOpen(true)} variant="secondary">
              <FaceIcon size={18} />
              {scanToken ? "Scan again" : "Find my photos"}
            </Button>
            {settings.allow_attendee_uploads && (
              <Button onClick={() => setUploadOpen(true)} variant="primary">
                <UploadIcon size={18} />
                Upload
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px clamp(20px, 5vw, 60px) 72px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
            }}
          >
            {mine ? "Your photos" : tab === "photos" ? "Photos" : tab === "videos" ? "Videos" : "The gallery"}
          </h2>
          {items.length > 0 && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "var(--ink-3)",
              }}
            >
              {items.length} SHOWN
              {galleryQuery.hasNextPage ? " · MORE BELOW" : ""}
            </span>
          )}
        </div>
        <AnimatePresence mode="wait">
          {galleryQuery.isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", justifyContent: "center", padding: 80 }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: "3px solid var(--coral)",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </motion.div>
          ) : mine && !scanToken ? (
            <motion.div key="scan-prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyStateScanPrompt onScan={() => setScanOpen(true)} />
            </motion.div>
          ) : tokenExpired ? (
            <motion.div
              key="expired"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: 60 }}
            >
              <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-2)", marginBottom: 20 }}>
                Your scan expired (links last 2 hours). Scan again to see your photos.
              </p>
              <Button onClick={() => setScanOpen(true)} variant="primary">
                Scan again
              </Button>
            </motion.div>
          ) : items.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyStateNoPhotos />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MediaGrid
                items={items}
                selectable={selectMode}
                selected={selected}
                onToggleSelect={(id) =>
                  setSelected((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                  })
                }
                onDownload={(card) => window.open(mediaApi.proxyUrl(card.urls.download), "_blank")}
                onFlag={setFlagCard}
                showFlag={mine}
              />
              {galleryQuery.hasNextPage && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
                  <Button
                    onClick={() => void galleryQuery.fetchNextPage()}
                    disabled={galleryQuery.isFetchingNextPage}
                    variant="secondary"
                  >
                    {galleryQuery.isFetchingNextPage ? "Loading…" : "Load more"}
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FaceScanModal
        isOpen={scanOpen}
        onClose={() => setScanOpen(false)}
        eventId={eventId}
        accessCode={accessCode}
        onScanComplete={handleScanComplete}
      />
      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} eventId={eventId} accessCode={accessCode} />
      <FlagModal
        isOpen={!!flagCard}
        onClose={() => setFlagCard(null)}
        eventId={eventId}
        card={flagCard}
        scanToken={scanToken}
      />

      <footer
        style={{
          borderTop: "1px solid var(--rule)",
          background: "var(--paper)",
          padding: "44px clamp(20px, 5vw, 60px) 48px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            textAlign: "center",
          }}
        >
          <Brand size="sm" />
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--ink-2)" }}>
            {title} · {totalAll} {totalAll === 1 ? "photo" : "photos"} · Powered by AI face recognition
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--ink-3)" }}>
            Want a gallery like this for your event?{" "}
            <a href="/register" style={{ color: "var(--accent-ink)", fontWeight: 600 }}>
              Create your event
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
