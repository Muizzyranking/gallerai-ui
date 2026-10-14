"use client";

import { useState } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import EmailSentNotice from "@/components/auth/EmailSentNotice";
import { TextField } from "@/components/auth/Fields";
import BackToSignIn from "@/components/ui/back_to_sign_in";
import { useAuthForm } from "@/hooks/useAuthForm";
import { auth } from "@/lib/api";
import { forgotPasswordSchema } from "@/lib/auth-schemas";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { form, fieldErrors, loading, setLoading, update, validateAll } = useAuthForm(
    forgotPasswordSchema,
    { email: "" },
    (v) => ({ email: v.email.trim().toLowerCase() }),
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateAll();
    if (errors) return;
    setLoading(true);
    try {
      await auth.forgotPassword({ email: form.email.trim().toLowerCase() });
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <div>
      <AuthHeader
        size="md"
        kicker="Password reset"
        title="Reset your password"
        subtitle={
          <>
            Remembered it?{" "}
            <a href="/login" className="text-link">
              Back to sign in
            </a>
          </>
        }
      />

      {sent ? (
        <EmailSentNotice
          variant="card"
          title="Check your inbox"
          message={
            <>
              If an account exists for{" "}
              <strong style={{ color: "var(--ink)" }}>{form.email.trim().toLowerCase()}</strong>, we sent a link to
              reset your password.
            </>
          }
        />
      ) : (
        <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <TextField
            id="forgot-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(v) => update("email", v)}
            placeholder="you@example.com"
            error={fieldErrors.email}
            helpText="We will email you a secure reset link. It expires after a short time."
          />
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%" }}>
            {loading ? "Sending link…" : "Send reset link"}
          </button>
          <BackToSignIn />
        </form>
      )}
    </div>
  );
}
