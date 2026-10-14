"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GlobeIcon, KebabIcon, LockSmallIcon } from "@/components/icons";
import IconButton from "@/components/ui/IconButton";
import { accessModeLabel, type Event, isPrivateMode } from "@/lib/api";

function fmtDate(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function AccessBadge({ event }: { event: Event }) {
  const priv = isPrivateMode(event.access_mode);
  return (
    <div
      style={{
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
      }}
    >
      {priv ? <LockSmallIcon size={9} /> : <GlobeIcon size={9} />}
      <span
        style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--ink-2)", letterSpacing: "0.1em" }}
      >
        {accessModeLabel(event.access_mode).toUpperCase()}
      </span>
    </div>
  );
}

/** Uniform event card — fixed description space keeps every card even. */
export default function EventCard({ event, onDelete }: { event: Event; onDelete: (id: string) => void }) {
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
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--rule-strong)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--rule)";
      }}
    >
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <AccessBadge event={event} />
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
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
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div style={{ height: 1, background: "var(--rule)" }} />
                  <button
                    type="button"
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
                  >
                    Delete event
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

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

        <p
          style={{
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
          }}
        >
          {event.description ?? ""}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", paddingTop: 10 }}>
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
            {fmtDate(event.event_date) ?? ""}
          </span>
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
              flexShrink: 0,
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
              flexShrink: 0,
            }}
          >
            View ↗
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
