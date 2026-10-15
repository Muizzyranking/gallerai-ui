"use client";

export type GalleryTab = "all" | "mine" | "photos" | "videos";

export function TabButton({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "12px 20px",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        fontSize: "0.95rem",
        fontWeight: active ? 600 : 400,
        color: active ? "var(--ink)" : "var(--ink-2)",
        borderBottom: `2px solid ${active ? "var(--coral)" : "transparent"}`,
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {children}
      {count !== undefined && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            padding: "2px 8px",
            borderRadius: 99,
            background: active ? "var(--coral-subtle)" : "var(--bg-2)",
            color: active ? "var(--coral)" : "var(--ink-2)",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/** Single tab row: All / My Photos / Photos / Videos. */
export default function GalleryTabs({
  tab,
  onTab,
  total,
  mineCount,
  images,
  videos,
  scanned,
}: {
  tab: GalleryTab;
  onTab: (t: GalleryTab) => void;
  total?: number;
  mineCount?: number;
  images?: number;
  videos?: number;
  scanned: boolean;
}) {
  return (
    <div className="gallery-tabs">
      <TabButton active={tab === "all"} onClick={() => onTab("all")} count={total}>
        All
      </TabButton>
      <TabButton active={tab === "mine"} onClick={() => onTab("mine")} count={scanned ? mineCount : undefined}>
        My Photos
      </TabButton>
      <TabButton active={tab === "photos"} onClick={() => onTab("photos")} count={images}>
        Photos
      </TabButton>
      <TabButton active={tab === "videos"} onClick={() => onTab("videos")} count={videos}>
        Videos
      </TabButton>
      <style>{`
        .gallery-tabs {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: nowrap;
          overflow-x: auto;
          max-width: 100%;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .gallery-tabs::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
