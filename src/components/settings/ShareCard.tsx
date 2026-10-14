"use client";

import { useState } from "react";
import { SectionCard } from "@/components/dashboard/primitives";
import { CopyIcon } from "@/components/icons";
import Button from "@/components/ui/custom-button";

/** Share link + access code with copy feedback. */
export default function ShareCard({
  eventId,
  accessCode,
  isPrivate,
}: {
  eventId: string;
  accessCode?: string | null;
  isPrivate: boolean;
}) {
  const [copied, setCopied] = useState<"link" | "code" | null>(null);
  const link = typeof window !== "undefined" ? `${window.location.origin}/events/${eventId}` : `/events/${eventId}`;

  const copy = (text: string, which: "link" | "code") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(which);
      setTimeout(() => setCopied((c) => (c === which ? null : c)), 2000);
    });
  };

  return (
    <SectionCard title="Share link">
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div
          style={{
            flex: 1,
            background: "var(--bg-2)",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "var(--rule-strong)",
            borderRadius: 6,
            padding: "12px 16px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
            color: "var(--ink-2)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {link}
        </div>
        <Button onClick={() => copy(link, "link")} variant="secondary">
          <CopyIcon size={14} />
          {copied === "link" ? "Copied" : "Copy"}
        </Button>
      </div>
      {isPrivate && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12 }}>
          <div
            style={{
              flex: 1,
              background: "var(--bg-2)",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "var(--rule-strong)",
              borderRadius: 6,
              padding: "12px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              letterSpacing: "0.15em",
              color: "var(--ink)",
            }}
          >
            {accessCode ?? "Code generates on save"}
          </div>
          {accessCode && (
            <Button onClick={() => copy(accessCode, "code")} variant="secondary">
              <CopyIcon size={14} />
              {copied === "code" ? "Copied" : "Copy code"}
            </Button>
          )}
        </div>
      )}
    </SectionCard>
  );
}
