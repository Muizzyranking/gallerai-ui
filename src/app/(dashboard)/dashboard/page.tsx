"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { accessModeLabel, type Event, events as eventsApi, isPrivateMode } from "@/lib/api";

/* ── Helpers ─────────────────────────────────────────────── */
function fmtDate(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ── Empty state ─────────────────────────────────────────── */
function EmptyState({ tab }: { tab: "mine" | "attending" }) {
  return (
    <div style={{ padding: "80px 0", textAlign: "center" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--coral-subtle)",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "rgba(255,107,107,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        {tab === "mine" ? (
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="var(--coral)" strokeWidth="1.5" strokeLinecap="round">
            <rect x="3" y="3" width="20" height="20" rx="3" />
            <path d="M13 9v8M9 13h8" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="var(--coral)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M20 23v-2a5 5 0 00-5-5H7a5 5 0 00-5 5v2" />
            <circle cx="11" cy="9" r="4" />
            <path d="M26 23v-2a5 5 0 00-4-4.9M17 4.1a4 4 0 010 7.8" />
          </svg>
        )}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.8rem",
          fontWeight: 600,
          color: "var(--ink)",
          marginBottom: 10,
        }}
      >
        {tab === "mine" ? "No events yet" : "Not attending any events"}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.95rem",
          color: "var(--ink-2)",
          marginBottom: 28,
          lineHeight: 1.6,
        }}
      >
        {tab === "mine" ? "Create your first event and start sharing photos." : "When an organiser adds you as a member, events appear here."}
      </p>
      {tab === "mine" && (
        <Link href="/events/create" className="btn-primary" style={{ display: "inline-flex" }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6.5 1v11M1 6.5h11" />
          </svg>
          Create event
        </Link>
      )}
    </div>
  );
}

/* ── Access badge ────────────────────────────────────────── */
function AccessBadge({ event }: { event: Event }) {
  const priv = isPrivateMode(event.access_mode);
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        background: "rgba(0,0,0,0.62)",
        borderRadius: 99,
        padding: "3px 10px",
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      {priv ? (
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
          <rect x="1" y="4.5" width="8" height="5" rx="1" />
          <path d="M3 4.5V3a2 2 0 014 0v1.5" />
        </svg>
      ) : (
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="5" cy="5" r="4" />
          <path d="M1 5h8M5 1c-1.5 1.5-2 2.5-2 4s.5 2.5 2 4M5 1c1.5 1.5 2 2.5 2 4s-.5 2.5-2 4" />
        </svg>
      )}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.5rem",
          color: "#fff",
          letterSpacing: "0.1em",
        }}
      >
        {accessModeLabel(event.access_mode).toUpperCase()}
      </span>
    </div>
  );
}

/* ── Organiser card ──────────────────────────────────────── */
function OrganizerCard({ event, onDelete }: { event: Event; onDelete: (id: string) => void }) {
  const router = useRouter();
  const [menu, setMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={() => router.push(`/events/${event.id}/settings`)}
      style={{
        background: "var(--bg-1)",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "var(--rule)",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.15s",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--rule-strong)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}
    >
      {/* Cover strip */}
      <div
        style={{
          height: 110,
          flexShrink: 0,
          position: "relative",
          background: event.cover_photo_url
            ? `url(${event.cover_photo_url}) center/cover no-repeat`
            : "linear-gradient(135deg, var(--bg-3) 0%, var(--bg-2) 100%)",
        }}
      >
        <AccessBadge event={event} />

        {/* Kebab menu */}
        <div style={{ position: "absolute", top: 8, right: 8 }} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenu((m) => !m);
            }}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.55)",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
              <circle cx="6.5" cy="2" r="1.2" />
              <circle cx="6.5" cy="6.5" r="1.2" />
              <circle cx="6.5" cy="11" r="1.2" />
            </svg>
          </button>

          {menu && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setMenu(false)} />
              <div
                style={{
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
                }}
              >
                {[
                  { label: "Edit settings", href: `/events/${event.id}/settings` },
                  { label: "Upload photos", href: `/events/${event.id}/upload` },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenu(false)}
                    style={{
                      display: "block",
                      padding: "11px 16px",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.88rem",
                      color: "var(--ink)",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {item.label}
                  </Link>
                ))}
                <div style={{ height: 1, background: "var(--rule)" }} />
                <button
                  onClick={() => {
                    setMenu(false);
                    onDelete(event.id);
                  }}
                  style={{
                    width: "100%",
                    padding: "11px 16px",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem",
                    color: "#ff6b6b",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,107,107,0.08)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  Delete event
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Card body */}
      <div
        style={{
          padding: "14px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          flex: 1,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.15rem",
            fontWeight: 600,
            color: "var(--ink)",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {event.title}
        </h3>

        {event.description && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.88rem",
              color: "var(--ink-2)",
              lineHeight: 1.5,
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.description}
          </p>
        )}

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: "auto",
            paddingTop: 10,
          }}
        >
          {fmtDate(event.event_date) ? (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "var(--ink-2)",
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fmtDate(event.event_date)}
            </span>
          ) : (
            <div style={{ flex: 1 }} />
          )}

          <Link
            href={`/events/${event.id}/upload`}
            onClick={(e) => e.stopPropagation()}
            style={{
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
              transition: "all 0.14s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--ink)";
              el.style.borderColor = "var(--ink-3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--ink-2)";
              el.style.borderColor = "var(--rule-strong)";
            }}
          >
            Upload
          </Link>

          <Link
            href={`/events/${event.id}`}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            style={{
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
              transition: "border-color 0.14s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--coral)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,107,107,0.3)")}
          >
            View ↗
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Attending card ──────────────────────────────────────── */
function AttendingCard({ event }: { event: Event }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      style={{
        background: "var(--bg-1)",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "var(--rule)",
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.15s",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--rule-strong)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}
    >
      {/* Cover */}
      <div
        style={{
          height: 110,
          flexShrink: 0,
          position: "relative",
          background: event.cover_photo_url
            ? `url(${event.cover_photo_url}) center/cover no-repeat`
            : "linear-gradient(135deg, var(--bg-3) 0%, var(--bg-2) 100%)",
        }}
      >
        {/* Member badge */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "rgba(0,0,0,0.62)",
            borderRadius: 99,
            padding: "3px 10px",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="5" cy="3.5" r="2" />
            <path d="M1 9c0-2.21 1.79-4 4-4s4 1.79 4 4" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5rem",
              color: "#fff",
              letterSpacing: "0.1em",
            }}
          >
            MEMBER
          </span>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "14px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          flex: 1,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.15rem",
            fontWeight: 600,
            color: "var(--ink)",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {event.title}
        </h3>

        {event.description && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.88rem",
              color: "var(--ink-2)",
              lineHeight: 1.5,
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.description}
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: "auto",
            paddingTop: 10,
          }}
        >
          {fmtDate(event.event_date) ? (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "var(--ink-2)",
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fmtDate(event.event_date)}
            </span>
          ) : (
            <div style={{ flex: 1 }} />
          )}
          <Link
            href={`/events/${event.id}`}
            target="_blank"
            style={{
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
              transition: "border-color 0.14s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--coral)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,107,107,0.3)")}
          >
            View gallery ↗
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Delete modal ────────────────────────────────────────── */
function DeleteModal({ onConfirm, onCancel, loading }: { onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
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
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "var(--rule-strong)",
          borderRadius: 12,
          padding: 32,
          maxWidth: 420,
          width: "100%",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.8rem",
            color: "var(--ink)",
            marginBottom: 10,
          }}
        >
          Delete this event?
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.95rem",
            color: "var(--ink-2)",
            lineHeight: 1.65,
            marginBottom: 28,
          }}
        >
          This permanently deletes the event and all its photos. It cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} className="btn-ghost" style={{ padding: "10px 22px" }}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "10px 22px",
              background: "#c0392b",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              fontWeight: 700,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Deleting…" : "Delete event"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Spinner ─────────────────────────────────────────────── */
function Spinner() {
  return (
    <div style={{ padding: "60px 0", display: "flex", justifyContent: "center" }}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="var(--coral)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ animation: "spin 0.8s linear infinite" }}
      >
        <path d="M10 1v3M10 16v3M1 10h3M16 10h3M2.93 2.93l2.12 2.12M14.95 14.95l2.12 2.12M2.93 17.07l2.12-2.12M14.95 5.05l2.12-2.12" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
type Tab = "mine" | "attending";

export default function DashboardPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("mine");
  const [delId, setDelId] = useState<string | null>(null);

  const { data: myEvents = [], isLoading: loadingMine } = useQuery({
    queryKey: ["events"],
    queryFn: eventsApi.list,
  });

  const { data: attendingEvents = [], isLoading: loadingAttending } = useQuery({
    queryKey: ["events-attending"],
    queryFn: eventsApi.attending,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      setDelId(null);
    },
  });

  const isLoading = tab === "mine" ? loadingMine : loadingAttending;
  const PAD = "clamp(20px, 4vw, 44px)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* ── Header ── */}
      <div
        style={{
          padding: `40px ${PAD} 0`,
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor: "var(--rule)",
        }}
      >
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
              Dashboard
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 600,
                color: "var(--ink)",
                lineHeight: 1,
              }}
            >
              {user?.display_name ? `${user.display_name.split(" ")[0]}'s events` : "Your events"}
            </h1>
          </div>

          <Link href="/events/create" className="btn-primary" style={{ flexShrink: 0, marginTop: 4 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6.5 1v11M1 6.5h11" />
            </svg>
            New event
          </Link>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", marginTop: 28 }}>
          {(
            [
              { key: "mine", label: "My Events", count: myEvents.length },
              { key: "attending", label: "Attending", count: attendingEvents.length },
            ] as { key: Tab; label: string; count: number }[]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "10px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "0.92rem",
                fontWeight: tab === t.key ? 600 : 400,
                color: tab === t.key ? "var(--ink)" : "var(--ink-2)",
                borderBottomWidth: 2,
                borderBottomStyle: "solid",
                borderBottomColor: tab === t.key ? "var(--coral)" : "transparent",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {t.label}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  padding: "1px 8px",
                  borderRadius: 99,
                  background: tab === t.key ? "var(--coral-subtle)" : "var(--bg-2)",
                  color: tab === t.key ? "var(--coral)" : "var(--ink-2)",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: tab === t.key ? "rgba(255,107,107,0.2)" : "var(--rule-strong)",
                }}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: `32px ${PAD}` }}>
        {isLoading && <Spinner />}

        <AnimatePresence mode="wait">
          {!isLoading && tab === "mine" && (
            <motion.div key="mine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {myEvents.length === 0 ? (
                <EmptyState tab="mine" />
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 16,
                  }}
                >
                  {myEvents.map((e, i) => (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.28 }}
                    >
                      <OrganizerCard event={e} onDelete={setDelId} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {!isLoading && tab === "attending" && (
            <motion.div key="attending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {attendingEvents.length === 0 ? (
                <EmptyState tab="attending" />
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 16,
                  }}
                >
                  {attendingEvents.map((e, i) => (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.28 }}
                    >
                      <AttendingCard event={e} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete modal */}
      {delId && <DeleteModal onConfirm={() => deleteMutation.mutate(delId)} onCancel={() => setDelId(null)} loading={deleteMutation.isPending} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
