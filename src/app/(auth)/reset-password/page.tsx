"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, CircleAlert, Eye, EyeOff, KeyRound, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import Brand from "@/components/layout/Brand";
import { ApiError, auth } from "@/lib/api";
import { type FieldErrors, resetPasswordSchema, validateFields } from "@/lib/auth-schemas";

const RULES = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

type Status = "form" | "success" | "missing-token";

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Capture the token once on first render...
  const initialToken = useRef(searchParams.get("token")).current;

  const [view, setView] = useState<Status>(initialToken ? "form" : "missing-token");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [touched, setTouched] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (!initialToken) return;
    window.history.replaceState(window.history.state ?? null, "", "/reset-password");
  }, [initialToken]);

  const matchOk = password.length > 0 && password === confirm;
  const canSubmit = !loading;

  const onPasswordChange = (value: string) => {
    setPassword(value);
    if (!touched) return;
    const errors = validateFields(resetPasswordSchema, { password: value, confirm }) ?? {};
    setFieldErrors((prev) => ({ ...prev, password: errors.password, confirm: errors.confirm }));
  };

  const onConfirmChange = (value: string) => {
    setConfirm(value);
    if (!touched) return;
    const errors = validateFields(resetPasswordSchema, { password, confirm: value }) ?? {};
    setFieldErrors((prev) => ({ ...prev, password: errors.password, confirm: errors.confirm }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setApiError("");
    const errors = validateFields(resetPasswordSchema, { password, confirm });
    setFieldErrors(errors ?? {});
    if (errors || !initialToken) return;

    setLoading(true);
    try {
      await auth.resetPassword({ token: initialToken, new_password: password });
      setView("success");
    } catch (err) {
      if (err instanceof ApiError && err.hasFieldErrors) {
        // Backend names the field `new_password` — fold it into the form's password slot.
        const mapped: FieldErrors = {};
        for (const [field, message] of Object.entries(err.fieldErrors)) {
          mapped[field === "new_password" ? "password" : field] = message;
        }
        setFieldErrors((prev) => ({ ...prev, ...mapped }));
      } else {
        setApiError(
          err instanceof ApiError && err.status === 410
            ? "This reset link has expired. Please request a new one."
            : err instanceof ApiError
              ? err.message
              : "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Success redirect to login after a beat
  useEffect(() => {
    if (view !== "success") return;
    const t = setTimeout(() => router.push("/login"), 3000);
    return () => clearTimeout(t);
  }, [view, router]);

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
          {view === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--rule)",
                borderRadius: "var(--r-card)",
                padding: "38px 32px",
                boxShadow: "var(--shadow-float)",
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.7rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "var(--ink)",
                  marginBottom: 8,
                }}
              >
                Set a new password
              </h1>
              <p style={{ fontSize: "0.9375rem", color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 28 }}>
                Choose a strong password for your account.
              </p>

              <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label htmlFor="new-password" className="auth-label">
                    New password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="new-password"
                      type={show ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => onPasswordChange(e.target.value)}
                      placeholder="Create a new password"
                      className="field-input"
                      style={{ paddingRight: 48 }}
                      aria-invalid={!!fieldErrors.password}
                      aria-describedby={fieldErrors.password ? "new-password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      aria-label={show ? "Hide password" : "Show password"}
                      style={{
                        position: "absolute",
                        right: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--ink-3)",
                        padding: 4,
                        display: "flex",
                      }}
                    >
                      {show ? (
                        <EyeOff size={18} strokeWidth={1.75} aria-hidden="true" />
                      ) : (
                        <Eye size={18} strokeWidth={1.75} aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {fieldErrors.password && touched && (
                    <p id="new-password-error" role="alert" className="field-error" style={{ marginTop: 8 }}>
                      {fieldErrors.password}
                    </p>
                  )}

                  {password.length > 0 && (
                    <ul style={{ listStyle: "none", display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
                      {RULES.map((r) => {
                        const ok = r.test(password);
                        return (
                          <li key={r.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {ok ? (
                              <Check size={14} strokeWidth={3} color="var(--coral-deep)" aria-hidden="true" />
                            ) : (
                              <X size={14} strokeWidth={2.5} color="var(--ink-4)" aria-hidden="true" />
                            )}
                            <span
                              style={{
                                fontSize: "0.8125rem",
                                fontWeight: 500,
                                color: ok ? "var(--coral-deep)" : "var(--ink-4)",
                              }}
                            >
                              {r.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm-password" className="auth-label">
                    Confirm new password
                  </label>
                  <input
                    id="confirm-password"
                    type={show ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => onConfirmChange(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="field-input"
                    aria-invalid={!!fieldErrors.confirm}
                    aria-describedby={fieldErrors.confirm ? "confirm-password-error" : undefined}
                    style={{
                      borderColor:
                        (touched && confirm.length > 0 && !matchOk) || fieldErrors.confirm
                          ? "rgba(217,58,48,0.55)"
                          : undefined,
                    }}
                  />
                  {fieldErrors.confirm && touched ? (
                    <p id="confirm-password-error" role="alert" className="field-error" style={{ marginTop: 8 }}>
                      {fieldErrors.confirm}
                    </p>
                  ) : (
                    touched &&
                    confirm.length > 0 &&
                    !matchOk && (
                      <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#d93a30", marginTop: 7 }}>
                        Passwords don&apos;t match yet.
                      </p>
                    )
                  )}
                </div>

                {apiError && (
                  <div role="alert" className="auth-error">
                    {apiError}
                    {apiError.includes("expired") && (
                      <>
                        {" "}
                        <Link href="/forgot-password" className="text-link">
                          Request a new link
                        </Link>
                      </>
                    )}
                  </div>
                )}

                <button type="submit" disabled={!canSubmit} className="btn-primary" style={{ width: "100%" }}>
                  {loading ? (
                    <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Loader2 size={17} className="spin" aria-hidden="true" />
                      Updating password...
                    </span>
                  ) : (
                    <>
                      Reset password
                      <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              <style>{`
                .spin { animation: spin 0.8s linear infinite; }
              `}</style>
            </motion.div>
          )}

          {view === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
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
                <KeyRound size={30} strokeWidth={1.75} />
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
                Password updated
              </h1>
              <p style={{ fontSize: "0.9375rem", color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 24 }}>
                Your password has been changed. Taking you to sign in...
              </p>
              <Link href="/login" className="btn-primary" style={{ width: "100%" }}>
                Sign in with new password
                <ArrowRight size={17} strokeWidth={2.25} aria-hidden="true" />
              </Link>
            </motion.div>
          )}

          {view === "missing-token" && (
            <motion.div
              key="missing"
              initial={{ opacity: 0, scale: 0.96 }}
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
                <CircleAlert size={30} strokeWidth={1.75} />
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
                Invalid reset link
              </h1>
              <p style={{ fontSize: "0.9375rem", color: "var(--ink-2)", lineHeight: 1.65, marginBottom: 24 }}>
                This page needs a valid reset token. Please use the exact link from the password reset email.
              </p>
              <Link href="/forgot-password" className="btn-primary" style={{ width: "100%" }}>
                Request a new reset email
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{ textAlign: "center", marginTop: 26, fontSize: "0.875rem", color: "var(--ink-4)" }}>
          <Link href="/login" style={{ color: "var(--ink-3)" }}>
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
      <ResetPasswordInner />
    </Suspense>
  );
}
