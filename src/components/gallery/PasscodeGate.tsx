"use client";

import { useState } from "react";
import { LockSmallIcon } from "@/components/icons";
import Button from "@/components/ui/custom-button";

/** Private-event passcode gate. */
export default function PasscodeGate({
  onVerified,
  initialError,
}: {
  onVerified: (code: string) => Promise<boolean>;
  initialError?: string;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [checking, setChecking] = useState(false);

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
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
        }}
      >
        <LockSmallIcon size={26} />
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.6rem",
          fontWeight: 600,
          color: "var(--ink)",
          marginBottom: 10,
        }}
      >
        Private event
      </h2>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.95rem",
          color: "var(--ink-2)",
          marginBottom: 24,
          lineHeight: 1.6,
        }}
      >
        Enter the passcode shared by the organizer to view this gallery.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!code.trim() || checking) return;
          setChecking(true);
          setError("");
          const ok = await onVerified(code.trim());
          setChecking(false);
          if (!ok) setError("Invalid access code. Try again.");
        }}
      >
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter passcode"
          // biome-ignore lint/a11y/noAutofocus: intentional
          autoFocus
          style={{
            width: "100%",
            padding: "13px 16px",
            background: "var(--bg-1)",
            border: "1px solid var(--rule-strong)",
            borderRadius: 8,
            fontFamily: "var(--font-mono)",
            fontSize: "1rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textAlign: "center",
            color: "var(--ink)",
            outline: "none",
            marginBottom: 12,
          }}
        />
        {error && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--coral)", marginBottom: 12 }}>
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" className="w-full" disabled={checking || !code.trim()}>
          {checking ? "Checking…" : "Unlock gallery"}
        </Button>
      </form>
    </div>
  );
}
