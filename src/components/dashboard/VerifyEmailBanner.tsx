"use client";

import Link from "next/link";
import { useState } from "react";
import type { User } from "@/lib/api";
import { auth } from "@/lib/api";

/** Persistent notice for signed-in users whose email isn't confirmed yet.
 *  Renders nothing once confirmed. Resend uses pending_email when set. */
export default function VerifyEmailBanner({ user }: { user: User | null }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!user || user.is_email_confirmed) return null;

  const email = user.pending_email ?? user.email;

  const resend = async () => {
    setSending(true);
    setFailed(false);
    try {
      await auth.resendEmailVerification({ email });
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 16px",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--marigold-soft)",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#ecd9a8",
        borderRadius: "var(--r-card)",
        padding: "14px 18px",
        marginBottom: 20,
      }}
    >
      <p style={{ fontSize: "0.92rem", lineHeight: 1.55, color: "#6b5420", margin: 0 }}>
        <strong style={{ color: "#4d3d12" }}>Please verify your email.</strong> We sent a confirmation link to {email}.{" "}
        <Link
          href="/resend-verification"
          style={{ color: "#4d3d12", fontWeight: 700, borderBottom: "1.5px solid #c9a44a" }}
        >
          Open verification help
        </Link>
      </p>
      <button
        type="button"
        onClick={resend}
        disabled={sending || sent}
        className="btn-secondary"
        style={{ padding: "9px 18px", fontSize: "0.84rem", flexShrink: 0, opacity: sending || sent ? 0.65 : 1 }}
      >
        {sending ? "Sending…" : sent ? "Email sent — check inbox" : "Resend email"}
      </button>
      {failed && (
        <span role="alert" style={{ width: "100%", fontSize: "0.85rem", color: "#a3261e" }}>
          Couldn't send right now. Please try again in a moment.
        </span>
      )}
    </div>
  );
}
