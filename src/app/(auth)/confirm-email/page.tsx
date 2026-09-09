"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeCheck, CircleAlert, Loader2, MailWarning } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import Brand from "@/components/layout/Brand";
import { ApiError, auth } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

type Status = "verifying" | "success" | "error" | "missing-token";

const REDIRECT_DELAY_MS = 2800;

function ConfirmEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthed = useAuthStore((s) => !!s.token && !!s.user);

  // Capture the token once on first render...
  const initialToken = useRef(searchParams.get("token")).current;

  const [status, setStatus] = useState<Status>(initialToken ? "verifying" : "missing-token");
  const [errorMsg, setErrorMsg] = useState("");
  const fired = useRef(false);

  useEffect(() => {
    if (!initialToken) return;
    // ...then scrub it from the address bar immediately. replaceState also
    // rewrites the current history entry, so the token never lands in history.
    window.history.replaceState(window.history.state ?? null, "", "/confirm-email");
  }, [initialToken]);

  useEffect(() => {
    if (!initialToken || fired.current) return;
    fired.current = true;

    auth
      .registerConfirm({ token: initialToken })
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setErrorMsg(
          err instanceof ApiError && err.status === 410
            ? "This verification link has expired."
            : err instanceof ApiError
              ? err.message
              : "Something went wrong. Please try again.",
        );
      });
  }, [initialToken]);

  // Success redirect: signed-in users continue to the dashboard,
  // everyone else goes to login (no auto-login).
  useEffect(() => {
    if (status !== "success") return;
    const target = isAuthed ? "/dashboard" : "/login";
    const t = setTimeout(() => router.push(target), REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
  }, [status, isAuthed, router]);

  const target = isAuthed ? "/dashboard" : "/login";

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-22%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 720,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,83,72,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
          <Brand />
        </div>

        <AnimatePresence mode="wait">
          {status === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--rule)",
                borderRadius: "var(--r-card)",
                padding: "44px 36px",
                textAlign: "center",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <span className="confirm-spinner">
                <Loader2 size={34} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                  marginBottom: 8,
                }}
              >
                Verifying your email
              </h1>
              <p style={{ fontSize: "0.9375rem", color: "var(--ink-2)", lineHeight: 1.6 }}>One moment while we confirm your link.</p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--rule)",
                borderRadius: "var(--r-card)",
                padding: "44px 36px",
                textAlign: "center",
                boxShadow: "var(--shadow-float)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  background: "var(--coral-soft)",
                  color: "var(--coral-deep)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                <BadgeCheck size={30} strokeWidth={1.75} />
              </span>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                  marginBottom: 8,
                }}
              >
                Email verified
              </h1>
              <p style={{ fontSize: "0.9375rem", color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 24 }}>
                {isAuthed
                  ? "Your account is fully activated. Taking you to your dashboard..."
                  : "Your account is activated. Taking you to sign in..."}
              </p>

              <Link href={target} className="btn-primary" style={{ width: "100%" }}>
                {isAuthed ? "Go to dashboard" : "Continue to sign in"}
                <ArrowRight size={17} strokeWidth={2.25} aria-hidden="true" />
              </Link>
            </motion.div>
          )}

          {(status === "error" || status === "missing-token") && (
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--rule)",
                borderRadius: "var(--r-card)",
                padding: "44px 36px",
                textAlign: "center",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  background: "rgba(217,58,48,0.09)",
                  color: "#d93a30",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                {status === "missing-token" ? <CircleAlert size={30} strokeWidth={1.75} /> : <MailWarning size={30} strokeWidth={1.75} />}
              </span>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                  marginBottom: 8,
                }}
              >
                {status === "missing-token" ? "Invalid link" : "Verification failed"}
              </h1>
              <p style={{ fontSize: "0.9375rem", color: "var(--ink-2)", lineHeight: 1.65, marginBottom: 24 }}>
                {status === "missing-token"
                  ? "This page needs a verification token. Please use the exact link from the email we sent you."
                  : errorMsg || "We couldn't verify your email with this link."}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {status === "error" && (
                  <Link href="/resend-verification" className="btn-primary" style={{ width: "100%" }}>
                    Resend verification email
                    <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
                  </Link>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <Link href="/login" className="btn-ghost" style={{ flex: 1 }}>
                    Sign in
                  </Link>
                  <Link href="/register" className={status === "error" ? "btn-ghost" : "btn-primary"} style={{ flex: 1 }}>
                    Create account
                    {status !== "error" && <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .confirm-spinner {
          display: inline-flex;
          color: var(--coral);
          margin-bottom: 18px;
          animation: spin 0.9s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
      <ConfirmEmailInner />
    </Suspense>
  );
}
