"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthHeader from "@/components/auth/AuthHeader";
import { PasswordField, TextField } from "@/components/auth/Fields";
import SocialAuthSection from "@/components/auth/SocialAuth";
import { useAuth } from "@/hooks/useAuth";
import { useAuthForm } from "@/hooks/useAuthForm";
import { ApiError } from "@/lib/api";
import { registerSchema } from "@/lib/auth-schemas";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const { form, fieldErrors, apiError, setApiError, loading, setLoading, update, validateAll } = useAuthForm(
    registerSchema,
    { display_name: "", email: "", password: "" },
    (v) => ({ display_name: v.display_name.trim(), email: v.email.trim().toLowerCase(), password: v.password }),
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (validateAll()) return;
    setLoading(true);
    try {
      await register(form.display_name.trim(), form.email.trim().toLowerCase(), form.password);
      router.push("/dashboard");
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthHeader
        kicker="Create account"
        title="Start your first gallery"
        subtitle={
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-link">
              Sign in
            </Link>
          </>
        }
      />

      <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <TextField
          id="reg-name"
          label="Display name"
          autoComplete="name"
          value={form.display_name}
          onChange={(v) => update("display_name", v)}
          placeholder="Ada Okafor"
          error={fieldErrors.display_name}
        />

        <TextField
          id="reg-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(v) => update("email", v)}
          placeholder="ada@example.com"
          error={fieldErrors.email}
        />

        <PasswordField
          id="reg-password"
          label="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={(v) => update("password", v)}
          placeholder="8+ characters, uppercase, number"
          error={fieldErrors.password}
          helpText="8+ characters with an uppercase letter and a number."
        />

        <p style={{ fontSize: "0.86rem", color: "var(--ink-3)", lineHeight: 1.6 }}>
          By signing up you agree to our{" "}
          <Link href="/terms" className="text-link">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-link">
            Privacy Policy
          </Link>
          .
        </p>

        {apiError && (
          <div role="alert" className="field-error">
            {apiError}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%" }}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <SocialAuthSection />

      <div style={{ marginTop: 18, padding: "14px 16px", background: "var(--cream)", border: "1px solid var(--line)", borderRadius: "var(--r-ctl)" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.08em", color: "var(--ink-2)", textAlign: "center" }}>
          FREE PLAN · 1 EVENT · 100 PHOTOS · NO CARD NEEDED
        </p>
      </div>
    </div>
  );
}
