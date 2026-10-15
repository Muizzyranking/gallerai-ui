"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GlobeIcon, KebabIcon, LockSmallIcon } from "@/components/icons";
import IconButton from "@/components/ui/IconButton";
import { accessModeLabel, type Event, isPrivateMode } from "@/lib/api";

function fmtDate(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function AccessBadge({ event }: { event: Event }) {
  const priv = isPrivateMode(event.access_mode);
  const badge: React.CSSProperties = {
    background: "var(--bg-2)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--rule-strong)",
    borderRadius: 99,
    padding: "4px 11px",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: "var(--coral)",
  };
  const label: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    color: "var(--ink-2)",
    letterSpacing: "0.1em",
  };
  return (
    <div style={badge}>
      {priv ? <LockSmallIcon size={9} /> : <GlobeIcon size={9} />}
      <span style={label}>{accessModeLabel(event.access_mode).toUpperCase()}</span>
    </div>
  );
}

const MENU_ITEMS = [
  { label: "View media", href: (id: string) => `/events/${id}/media` },
  { label: "Edit settings", href: (id: string) => `/events/${id}/settings` },
  { label: "Upload photos", href: (id: string) => `/events/${id}/upload` },
];

/** Uniform event card — fixed description space keeps every card even. */
export default function EventCard({ event, onDelete }: { event: Event; onDelete: (id: string) => void }) {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape. (A `position: fixed` click-catcher
  // inside this card does NOT work: the transformed card ancestor makes
  // `fixed` resolve against the card instead of the viewport.)
  useEffect(() => {
    if (!menu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const openSettings = () => router.push(`/events/${event.id}/settings`);

  const card: React.CSSProperties = {
    background: "var(--bg-1)",
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: "var(--rule-strong)",
    borderRadius: 12,
    // NOTE: overflow must stay visible — the kebab dropdown is absolutely
    // positioned inside this card and would be clipped otherwise.
    overflow: "visible",
    position: "relative",
    // Lift above neighbouring grid cards while the menu is open.
    zIndex: menu ? 30 : undefined,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  };
  const body: React.CSSProperties = {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
  };
  const topRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  };
  const title: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "1.15rem",
    fontWeight: 600,
    color: "var(--ink)",
    lineHeight: 1.2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
  const desc: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "0.88rem",
    color: "var(--ink-2)",
    lineHeight: 1.5,
    margin: 0,
    minHeight: "3em",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
  const foot: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: "auto",
    paddingTop: 10,
  };
  const date: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "0.8rem",
    color: "var(--ink-2)",
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
  const dropdown: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    right: 0,
    zIndex: 20,
    marginTop: 4,
    minWidth: 162,
    background: "var(--bg-3)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--rule-strong)",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
  };
  const menuLink: React.CSSProperties = {
    display: "block",
    padding: "11px 16px",
    fontFamily: "var(--font-body)",
    fontSize: "0.88rem",
    color: "var(--ink)",
    textDecoration: "none",
  };

  return (
    <div
      tabIndex={0}
      aria-label={event.title + " — open settings"}
      onClick={openSettings}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openSettings();
        }
      }}
      className="event-card"
      style={card}
    >
      <div style={body}>
        <div style={topRow}>
          <AccessBadge event={event} />
          <div style={spacer} />
          <div ref={menuRef} style={relative}>
            <IconButton
              label="Event options"
              variant="solid"
              size={28}
              onClick={(e) => {
                e.stopPropagation();
                setMenu((m) => !m);
              }}
            >
              <KebabIcon size={13} />
            </IconButton>

            {menu && (
              <div role="menu" style={dropdown}>
                {MENU_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href(event.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenu(false);
                    }}
                    style={menuLink}
                  >
                    {item.label}
                  </Link>
                ))}
                <div style={divider} />
                <button
                  type="button"
                  onClick={() => {
                    setMenu(false);
                    onDelete(event.id);
                  }}
                  style={dangerBtn}
                >
                  Delete event
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 style={title}>{event.title}</h3>

        <p style={desc}>{event.description ?? ""}</p>

        <div style={foot}>
          <span style={date}>{fmtDate(event.event_date) ?? ""}</span>
          <Link
            href={`/events/${event.id}/upload`}
            onClick={(e) => e.stopPropagation()}
            style={uploadPill}
          >
            Upload
          </Link>
          <Link
            href={`/events/${event.id}`}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            style={viewPill}
          >
            View ↗
          </Link>
        </div>
      </div>
    </div>
  );
}

const spacer: React.CSSProperties = { flex: 1 };
const relative: React.CSSProperties = { position: "relative" };
const divider: React.CSSProperties = { height: 1, background: "var(--rule)" };
const dangerBtn: React.CSSProperties = {
  width: "100%",
  padding: "11px 16px",
  fontFamily: "var(--font-body)",
  fontSize: "0.88rem",
  color: "#ff6b6b",
  background: "none",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
};
const uploadPill: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.78rem",
  fontWeight: 500,
  color: "var(--ink-2)",
  padding: "5px 11px",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "var(--rule-strong)",
  borderRadius: 5,
  textDecoration: "none",
  flexShrink: 0,
};
const viewPill: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.78rem",
  fontWeight: 500,
  color: "var(--coral)",
  padding: "5px 11px",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(255,107,107,0.3)",
  borderRadius: 5,
  textDecoration: "none",
  flexShrink: 0,
};
