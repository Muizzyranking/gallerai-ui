"use client";

import { useEffect, useRef, useState } from "react";

/* Shared trigger + popup styling (theme-aware, matches text inputs). */
const triggerStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  background: "var(--bg-2)",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "var(--rule-strong)",
  borderRadius: 6,
  padding: "13px 16px",
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  color: "var(--ink)",
  cursor: "pointer",
  transition: "border-color 0.18s",
  textAlign: "left",
};

const popupStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 8px)",
  left: 0,
  zIndex: 60,
  background: "var(--bg-1)",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "var(--rule-strong)",
  borderRadius: 12,
  boxShadow: "0 18px 44px rgba(0,0,0,0.4)",
  padding: 14,
  minWidth: 272,
};

function useDismiss(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return ref;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseISO(value: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]) - 1;
  const d = Number(match[3]);
  if (m < 0 || m > 11 || d < 1 || d > 31) return null;
  return { y, m, d };
}

function formatDateLabel(value: string): string {
  const p = parseISO(value);
  if (!p) return "";
  return new Date(p.y, p.m, p.d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ── DatePicker ────────────────────────────────────────────── */
export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const ref = useDismiss(open, () => setOpen(false));

  const openPicker = () => {
    const p = parseISO(value);
    setView(p ? { y: p.y, m: p.m } : { y: now.getFullYear(), m: now.getMonth() });
    setOpen(true);
  };

  const selected = parseISO(value);
  const todayISO = toISO(now.getFullYear(), now.getMonth(), now.getDate());
  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const move = (delta: number) => {
    const next = new Date(view.y, view.m + delta, 1);
    setView({ y: next.getFullYear(), m: next.getMonth() });
  };

  const label = formatDateLabel(value);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPicker())}
        style={{ ...triggerStyle, borderColor: open ? "rgba(255,107,107,0.55)" : "var(--rule-strong)" }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: label ? "var(--ink)" : "var(--ink-3)",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{ flexShrink: 0 }}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {label || placeholder}
        </span>
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            flexShrink: 0,
            color: "var(--ink-3)",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div style={popupStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <button type="button" onClick={() => move(-1)} aria-label="Previous month" style={navBtnStyle}>
              ‹
            </button>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 700, color: "var(--ink)" }}>
              {MONTHS[view.m]} {view.y}
            </span>
            <button type="button" onClick={() => move(1)} aria-label="Next month" style={navBtnStyle}>
              ›
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
            {WEEKDAYS.map((w) => (
              <span
                key={w}
                style={{
                  textAlign: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--ink-3)",
                  padding: "4px 0",
                }}
              >
                {w}
              </span>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {Array.from({ length: firstWeekday }).map((a) => (
              <span key={`b-${a}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const iso = toISO(view.y, view.m, d);
              const isSelected = selected != null && iso === value;
              const isToday = iso === todayISO;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    margin: "0 auto",
                    borderRadius: "50%",
                    border: isToday && !isSelected ? "1px solid var(--coral)" : "1px solid transparent",
                    background: isSelected ? "var(--coral)" : "transparent",
                    color: isSelected ? "#fff" : "var(--ink)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--bg-3)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 12,
              paddingTop: 10,
              borderTop: "1px solid var(--rule)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                onChange(todayISO);
                setOpen(false);
              }}
              style={footerBtnStyle}
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                style={footerBtnStyle}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 8,
  border: "1px solid var(--rule-strong)",
  background: "var(--bg-2)",
  color: "var(--ink)",
  fontSize: "1.1rem",
  lineHeight: 1,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const footerBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-body)",
  fontSize: "0.82rem",
  fontWeight: 600,
  color: "var(--coral)",
  padding: "4px 2px",
};

/* ── TimePicker ────────────────────────────────────────────── */
function formatTimeLabel(hhmm: string): string {
  const match = /^(\d{2}):(\d{2})$/.exec(hhmm);
  if (!match) return "";
  let h = Number(match[1]);
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${match[2]} ${suffix}`;
}

const TIME_OPTIONS: string[] = Array.from({ length: 48 }).map((_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

export function TimePicker({
  value,
  onChange,
  placeholder = "Pick a time",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  const label = formatTimeLabel(value);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ ...triggerStyle, borderColor: open ? "rgba(255,107,107,0.55)" : "var(--rule-strong)" }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: label ? "var(--ink)" : "var(--ink-3)",
          }}
        >
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{ flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {label || placeholder}
        </span>
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            flexShrink: 0,
            color: "var(--ink-3)",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div style={{ ...popupStyle, minWidth: 200, padding: 8 }}>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              style={{ ...timeOptionStyle, color: "var(--ink-2)", fontStyle: "italic" }}
            >
              No specific time
            </button>
          )}
          <div style={{ maxHeight: 232, overflowY: "auto" }}>
            {TIME_OPTIONS.map((t) => {
              const isSelected = t === value;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    onChange(t);
                    setOpen(false);
                  }}
                  style={{
                    ...timeOptionStyle,
                    background: isSelected ? "var(--coral-subtle)" : "transparent",
                    color: isSelected ? "var(--coral)" : "var(--ink)",
                    fontWeight: isSelected ? 700 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--bg-3)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {formatTimeLabel(t)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const timeOptionStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "9px 12px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-body)",
  fontSize: "0.88rem",
};
