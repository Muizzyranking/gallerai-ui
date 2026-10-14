"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleIcon from "@/components/ui/GoogleIcon";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

interface SocialAuthSectionProps {
  redirectTo?: string;
  onError?: (message: string) => void;
}

export default function SocialAuthSection({ redirectTo = "/dashboard", onError }: SocialAuthSectionProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [localError, setLocalError] = useState("");

  const onClick = async () => {
    if (connecting) return;
    setConnecting(true);
    setLocalError("");
    try {
      await loginWithGoogle();
      router.push(redirectTo);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Google sign-in failed. Please try again.";
      if (onError) onError(message);
      else setLocalError(message);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "26px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            color: "var(--ink-3)",
          }}
        >
          OR
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>
      <button
        type="button"
        onClick={onClick}
        disabled={connecting}
        className="btn-secondary"
        style={{ width: "100%", opacity: connecting ? 0.65 : 1 }}
      >
        <GoogleIcon />
        {connecting ? "Connecting to Google…" : "Continue with Google"}
      </button>
      {localError && (
        <div role="alert" className="field-error" style={{ marginTop: 12 }}>
          {localError}
        </div>
      )}
    </>
  );
}
