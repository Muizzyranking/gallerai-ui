"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import EventCard from "@/components/dashboard/EventCard";
import { ConfirmModal, PageHeader, PageSpinner, Toast } from "@/components/dashboard/primitives";
import { PlusIcon } from "@/components/icons";
import Button from "@/components/ui/custom-button";
import { useAuth } from "@/hooks/useAuth";
import { events as eventsApi, isPrivateMode } from "@/lib/api";

type Filter = "all" | "public" | "private";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

function EmptyState() {
  return (
    <div style={{ padding: "80px 0", textAlign: "center" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--coral-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          color: "var(--coral)",
          fontSize: "1.5rem",
          fontWeight: 600,
        }}
      >
        +
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
        No events yet
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
        Create your first event and start sharing photos.
      </p>
      <Link href="/events/create" className="btn-primary" style={{ display: "inline-flex" }}>
        <PlusIcon size={13} />
        Create event
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE — organizers only. Attendees never enter the dashboard.
   ══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [delId, setDelId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [toast, setToast] = useState("");

  const { data: myEvents = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: eventsApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      setDelId(null);
      setToast("Event deleted.");
      setTimeout(() => setToast(""), 3000);
    },
  });

  const visible = myEvents.filter((e) => filter === "all" || (filter === "private") === isPrivateMode(e.access_mode));
  const firstName = user?.display_name?.split(" ")[0];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <PageHeader
        eyebrow="Dashboard"
        title={firstName ? `${firstName}'s events` : "Your events"}
        actions={
          <Link href="/events/create" className="btn-primary" style={{ padding: "10px 18px" }}>
            <PlusIcon size={13} />
            New event
          </Link>
        }
      />

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px clamp(20px, 4vw, 44px) 64px" }}>
        {isLoading ? (
          <PageSpinner />
        ) : myEvents.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {FILTERS.map((f) => (
                  <Button
                    key={f.value}
                    variant={filter === f.value ? "secondary" : "ghost"}
                    onClick={() => setFilter(f.value)}
                  >
                    {f.label}
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
                {visible.length} {visible.length === 1 ? "EVENT" : "EVENTS"}
              </span>
            </div>

            {visible.length === 0 ? (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-2)",
                  textAlign: "center",
                  padding: "40px 0",
                }}
              >
                No {filter} events.
              </p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {visible.map((e) => (
                  <EventCard key={e.id} event={e} onDelete={setDelId} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {delId && (
        <ConfirmModal
          title="Delete this event?"
          body="This permanently deletes the event and all its photos. It cannot be undone."
          confirmLabel="Delete event"
          loading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(delId)}
          onCancel={() => setDelId(null)}
        />
      )}
      <Toast msg={toast} type="success" />
    </div>
  );
}
