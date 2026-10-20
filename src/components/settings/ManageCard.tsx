"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { SectionCard } from "@/components/dashboard/primitives";
import { ClockIcon, FlagIcon, ImageIcon, TrashIcon } from "@/components/icons";
import { gallery as galleryApi, media as mediaApi } from "@/lib/api";

/** Quick links to approvals / bin / flags with live count badges. */
export default function ManageCard({ eventId }: { eventId: string }) {
  const { data: approvals } = useQuery({
    queryKey: ["approvals", eventId, 1],
    queryFn: () => mediaApi.pendingApproval(eventId, { page: 1, page_size: 1 }),
    retry: false,
  });
  const { data: bin } = useQuery({
    queryKey: ["bin", eventId, 1],
    queryFn: () => mediaApi.bin(eventId, { page: 1, page_size: 1 }),
    retry: false,
  });
  const { data: flags } = useQuery({
    queryKey: ["flags", eventId, 1],
    queryFn: () => galleryApi.flags(eventId, { page: 1, page_size: 1 }),
    retry: false,
  });

  const items = [
    {
      label: "Media library",
      href: `/events/${eventId}/media`,
      count: undefined,
      icon: <ImageIcon size={18} />,
    },
    {
      label: "Approvals",
      href: `/events/${eventId}/approvals`,
      count: approvals?.meta.total,
      icon: <ClockIcon size={18} />,
    },
    { label: "Bin", href: `/events/${eventId}/bin`, count: bin?.meta.total, icon: <TrashIcon size={18} /> },
    { label: "Flags", href: `/events/${eventId}/flags`, count: flags?.meta.total, icon: <FlagIcon size={18} /> },
  ];

  return (
    <SectionCard
      title="Manage"
      desc="Browse the media library, review uploads, recover deletes, and read attendee reports."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 15px",
              borderRadius: 8,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "var(--rule-strong)",
              background: "var(--bg-2)",
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              fontSize: "0.88rem",
              fontWeight: 500,
              color: "var(--ink)",
            }}
          >
            <span style={{ color: "var(--coral)", display: "flex", flexShrink: 0 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {(item.count ?? 0) > 0 && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  padding: "2px 9px",
                  borderRadius: 99,
                  background: "var(--coral-subtle)",
                  color: "var(--coral)",
                }}
              >
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </SectionCard>
  );
}
