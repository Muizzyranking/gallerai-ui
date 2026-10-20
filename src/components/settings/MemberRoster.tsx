"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { InviteInput, SectionCard } from "@/components/dashboard/primitives";
import Button from "@/components/ui/custom-button";
import { ApiError, events as eventsApi } from "@/lib/api";

/** Co-organizer roster + add-by-email. Creator only (hides on 403). */
export default function MemberRoster({
  eventId,
  notify,
}: {
  eventId: string;
  notify: (msg: string, ok: boolean) => void;
}) {
  const [emails, setEmails] = useState<string[]>([]);

  const { data: members, error } = useQuery({
    queryKey: ["members", eventId],
    queryFn: () => eventsApi.listMembers(eventId),
    retry: false,
  });
  if (error instanceof ApiError && error.status === 403) return null;

  return (
    <SectionCard title="Co-organizers" desc="People who can manage this event alongside you.">
      {(!members || members.length === 0) && emails.length === 0 ? (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.88rem",
            color: "var(--ink-2)",
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          No co-organizers yet. They must already have an account.
        </p>
      ) : (
        members &&
        members.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 16 }}>
            {members.map((m) => (
              <MemberRow
                key={m.id}
                eventId={eventId}
                userId={m.user_id}
                name={m.display_name || m.email}
                sub={`${m.email} · ${m.status}`}
                notify={notify}
              />
            ))}
          </div>
        )
      )}
      <InviteInput emails={emails} onChange={setEmails} />
      {emails.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <AddButton eventId={eventId} emails={emails} onDone={() => setEmails([])} notify={notify} />
        </div>
      )}
    </SectionCard>
  );
}

function MemberRow({
  eventId,
  userId,
  name,
  sub,
  notify,
}: {
  eventId: string;
  userId: string;
  name: string;
  sub: string;
  notify: (msg: string, ok: boolean) => void;
}) {
  const qc = useQueryClient();
  const remove = useMutation({
    mutationFn: () => eventsApi.removeMember(eventId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members", eventId] });
      notify("Co-organizer removed.", true);
    },
    onError: (err) => notify(err instanceof ApiError ? err.message : "Remove failed.", false),
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "var(--coral-subtle)",
          color: "var(--coral)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-display)",
          fontSize: "0.95rem",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--ink)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.78rem",
            color: "var(--ink-2)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {sub}
        </div>
      </div>
      <button
        type="button"
        onClick={() => remove.mutate()}
        disabled={remove.isPending}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#e05555",
          padding: "6px 4px",
          flexShrink: 0,
        }}
      >
        Remove
      </button>
    </div>
  );
}

function AddButton({
  eventId,
  emails,
  onDone,
  notify,
}: {
  eventId: string;
  emails: string[];
  onDone: () => void;
  notify: (msg: string, ok: boolean) => void;
}) {
  const qc = useQueryClient();
  const add = useMutation({
    mutationFn: async () => {
      for (const email of emails) await eventsApi.addMember(eventId, { email });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members", eventId] });
      onDone();
      notify(emails.length === 1 ? "Co-organizer added." : `${emails.length} co-organizers added.`, true);
    },
    onError: (err) =>
      notify(err instanceof ApiError ? err.message : "Failed. Co-organizers need an account first.", false),
  });
  return (
    <Button onClick={() => add.mutate()} disabled={add.isPending} variant="secondary">
      {add.isPending ? "Adding…" : `Add ${emails.length} co-organizer${emails.length > 1 ? "s" : ""}`}
    </Button>
  );
}
