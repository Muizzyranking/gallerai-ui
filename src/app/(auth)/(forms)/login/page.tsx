"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import { PasswordField, TextField } from "@/components/auth/Fields";
import SocialAuthSection from "@/components/auth/SocialAuth";
import { useAuth } from "@/hooks/useAuth";
import { useAuthForm } from "@/hooks/useAuthForm";
import { ApiError } from "@/lib/api";
import { loginSchema } from "@/lib/auth-schemas";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const { form, fieldErrors, apiError, setApiError, loading, setLoading, update, validateAll, applyServerErrors } = useAuthForm(
    loginSchema,
    { email: "", password: "" },
    (v) => ({ email: v.email.trim().toLowerCase(), password: v.password }),
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (validateAll()) return;
    setLoading(true);
    try {
      await login(form.email.trim().toLowerCase(), form.password);
      router.push(searchParams.get("next") ?? "/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.hasFieldErrors) {
        applyServerErrors(err.fieldErrors);
      } else {
        setApiError(
          err instanceof ApiError ? (err.status === 401 ? "Incorrect email or password." : err.message) : "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthHeader
        kicker="Welcome back"
        title="Sign in to GallerAI"
        subtitle={
          <>
            No account?{" "}
            <Link href="/register" className="text-link">
              Create one free
            </Link>
          </>
        }
      />

      <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <TextField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(v) => update("email", v)}
          placeholder="you@example.com"
          error={fieldErrors.email}
        />

        <PasswordField
          id="login-password"
          label="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={(v) => update("password", v)}
          placeholder="Your password"
          error={fieldErrors.password}
          labelExtra={
            <Link href="/forgot-password" style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--ink-3)" }}>
              Forgot?
            </Link>
          }
        />

        {apiError && (
          <div role="alert" className="field-error">
            {apiError}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%" }}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <SocialAuthSection />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: 320 }} />}>
      <LoginInner />
    </Suspense>
  );
}
