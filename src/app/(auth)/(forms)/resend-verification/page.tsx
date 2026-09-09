"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import EmailSentNotice from "@/components/auth/EmailSentNotice";
import { TextField } from "@/components/auth/Fields";
import BackToSignIn from "@/components/ui/back_to_sign_in";
import { useAuthForm } from "@/hooks/useAuthForm";
import { ApiError, auth } from "@/lib/api";
import { resendVerificationSchema } from "@/lib/auth-schemas";

function ResendInner() {
  const searchParams = useSearchParams();
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");
  const { form, fieldErrors, loading, setLoading, update, validateAll, applyServerErrors } = useAuthForm(
    resendVerificationSchema,
    { email: searchParams.get("email") ?? "" },
    (v) => ({ email: v.email.trim().toLowerCase() }),
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    const errors = validateAll();
    if (errors) return;
    setLoading(true);
    try {
      await auth.resendEmailVerification({ email: form.email.trim().toLowerCase() });
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError && err.hasFieldErrors) {
        applyServerErrors(err.fieldErrors);
      } else {
        setApiError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <EmailSentNotice
        variant="standalone"
        title="Check your inbox"
        message={
          <>
            If an account exists for <strong style={{ color: "var(--ink)" }}>{form.email.trim().toLowerCase()}</strong>, a new verification
            link is on its way. Check spam too.
          </>
        }
      />
    );
  }

  return (
    <div>
      <AuthHeader
        size="md"
        kicker="Verification"
        title="Resend verification"
        subtitle="Enter the email you signed up with and we will send a fresh verification link."
      />

      <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <TextField
          id="resend-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(v) => update("email", v)}
          placeholder="you@example.com"
          error={fieldErrors.email}
        />
        {apiError && (
          <div role="alert" className="field-error">
            {apiError}
          </div>
        )}
        <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%" }}>
          {loading ? "Sending…" : "Send verification email"}
        </button>
        <BackToSignIn />
      </form>
    </div>
  );
}

export default function ResendVerificationPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: 320 }} />}>
      <ResendInner />
    </Suspense>
  );
}
