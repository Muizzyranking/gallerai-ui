"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      const next = searchParams.get("next") ?? "/dashboard";
      router.push(next);
    } catch (err) {
      setApiError(err instanceof ApiError ? (err.status === 401 ? "Incorrect email or password." : err.message) : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bg-2)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--rule-strong)",
    borderRadius: 4,
    padding: "13px 16px",
    fontFamily: "var(--font-body)",
    fontSize: "0.88rem",
    color: "var(--ink)",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <div className="label-coral" style={{ marginBottom: 12 }}>
          Welcome back
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 600, color: "var(--ink)", lineHeight: 1.0, letterSpacing: "-0.015em", marginBottom: 12 }}>
          Sign in to
          <br />
          <em style={{ fontStyle: "italic", color: "var(--coral)" }}>GallerAI</em>
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--ink-3)" }}>
          No account?{" "}
          <Link href="/register" style={{ color: "var(--coral)", borderBottom: "1px solid rgba(255,107,107,0.3)", paddingBottom: 1 }}>
            Create one free
          </Link>
        </p>
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Email */}
        <div>
          <div className="label" style={{ marginBottom: 8 }}>
            Email
          </div>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(255,107,107,0.5)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--rule-strong)";
            }}
          />
        </div>

        {/* Password */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div className="label">Password</div>
            <Link
              href="/forgot-password"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--ink-3)", letterSpacing: "0.1em", transition: "color 0.15s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--coral)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--ink-3)";
              }}
            >
              FORGOT?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              style={{ ...inputStyle, paddingRight: 44 }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(255,107,107,0.5)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--rule-strong)";
              }}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: 0 }}
            >
              {show ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                  <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
                  <circle cx="8" cy="8" r="2" />
                  <path d="M2 2l12 12" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                  <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
                  <circle cx="8" cy="8" r="2" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* API error */}
        {apiError && (
          <div
            style={{
              padding: "11px 14px",
              background: "rgba(255,107,107,0.08)",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "rgba(255,107,107,0.25)",
              borderRadius: 4,
              fontFamily: "var(--font-body)",
              fontSize: "0.82rem",
              color: "var(--coral)",
            }}
          >
            {apiError}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: "center", marginTop: 4, opacity: loading ? 0.7 : 1 }}>
          {loading ? (
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ animation: "spin 0.7s linear infinite" }}
                aria-hidden="true"
              >
                <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.64 2.64l1.42 1.42M9.94 9.94l1.42 1.42M2.64 11.36l1.42-1.42M9.94 4.06l1.42-1.42" />
              </svg>
              Signing in…
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "28px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--ink-4)", letterSpacing: "0.15em" }}>OR</span>
        <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
      </div>

      {/* Google OAuth placeholder */}
      <button
        type="button"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          background: "var(--bg-2)",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "var(--rule-strong)",
          borderRadius: 4,
          padding: "13px 16px",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: "0.82rem",
          color: "var(--ink-2)",
          transition: "border-color 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(255,255,255,0.18)";
          el.style.color = "var(--ink)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--rule-strong)";
          el.style.color = "var(--ink-2)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
