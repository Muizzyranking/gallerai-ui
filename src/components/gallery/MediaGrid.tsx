"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckIcon, DownloadIcon } from "@/components/icons";
import { type MediaCard, media as mediaApi } from "@/lib/api";

/** Gallery wall: generous tiles with hover zoom and hover actions. */
export default function MediaGrid({
  items,
  selectable,
  selected,
  onToggleSelect,
  onDownload,
  onFlag,
  showFlag,
}: {
  items: MediaCard[];
  selectable: boolean;
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onDownload: (card: MediaCard) => void;
  onFlag: (card: MediaCard) => void;
  showFlag: boolean;
}) {
  return (
    <div className="gallery-wall">
      {items.map((card, i) => (
        <motion.div
          key={card.id}
          className="media-tile"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(i, 10) * 0.03 }}
          style={{
            position: "relative",
            aspectRatio: "1",
            borderRadius: 14,
            overflow: "hidden",
            background: "var(--bg-3)",
            border: "1px solid var(--rule)",
            boxShadow: "0 1px 2px rgba(34,24,19,0.06), 0 6px 20px rgba(34,24,19,0.08)",
            cursor: selectable ? "pointer" : "default",
            outline: selected.has(card.id) ? "2px solid var(--coral)" : "none",
            outlineOffset: 2,
          }}
          onClick={selectable ? () => onToggleSelect(card.id) : undefined}
          onMouseEnter={(e) => {
            const overlay = (e.currentTarget as HTMLElement).querySelector(".media-overlay") as HTMLElement;
            if (overlay) overlay.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            const overlay = (e.currentTarget as HTMLElement).querySelector(".media-overlay") as HTMLElement;
            if (overlay) overlay.style.opacity = "0";
          }}
        >
          {card.media_type === "video" ? (
            <video
              src={mediaApi.proxyUrl(card.urls.display)}
              preload="metadata"
              playsInline
              className="tile-media"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
            />
          ) : (
            <div className="tile-media" style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                src={mediaApi.proxyUrl(card.urls.thumbnail)}
                alt={card.filename}
                fill
                sizes="(max-width: 1024px) 33vw, 280px"
                unoptimized
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          {selectable && (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                width: 24,
                height: 24,
                borderRadius: 6,
                background: selected.has(card.id) ? "var(--coral)" : "rgba(0,0,0,0.55)",
                border: "1px solid rgba(255,255,255,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              {selected.has(card.id) && <CheckIcon size={14} />}
            </div>
          )}

          {card.media_type === "video" && (
            <span
              style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                padding: "3px 8px",
                borderRadius: 99,
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
              }}
            >
              VIDEO
            </span>
          )}

          <div
            className="media-overlay"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              opacity: 0,
              transition: "opacity 0.2s",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              gap: 6,
              padding: 10,
            }}
          >
            {showFlag && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFlag(card);
                }}
                style={{
                  padding: "6px 10px",
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  color: "var(--ink)",
                }}
              >
                Not me
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(card);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 10px",
                background: "rgba(255,255,255,0.95)",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "0.72rem",
                fontWeight: 500,
                color: "var(--ink)",
              }}
            >
              <DownloadIcon size={13} />
              Download
            </button>
          </div>
        </motion.div>
      ))}
      <style>{`
        .gallery-wall { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        @media (min-width: 1024px) { .gallery-wall { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; } }
        .media-tile .tile-media { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
        .media-tile:hover .tile-media { transform: scale(1.05); }
        @media (prefers-reduced-motion: reduce) {
          .media-tile .tile-media { transition: none; }
          .media-tile:hover .tile-media { transform: none; }
        }
      `}</style>
    </div>
  );
}
