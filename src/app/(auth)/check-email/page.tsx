"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CheckEmailInner() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div style={{ textAlign: "center" }}>
      <span
        aria-hidden="true"
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "var(--accent-soft)",
          color: "var(--accent-deep)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          fontSize: "1.6rem",
        }}
      >
        ✉
      </span>
      <h1
        style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 12 }}
      >
        Check your inbox
      </h1>
      <p className="body-text" style={{ marginBottom: 8 }}>
        Your account has been created
        {email ? (
          <>
            {" "}
            for <strong style={{ color: "var(--ink)" }}>{email}</strong>
          </>
        ) : null}
        .
      </p>
      <p className="body-text" style={{ marginBottom: 28 }}>
        We sent you a verification link. Click it to activate your account, then sign in. Check spam if it does not show up.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Link href="/login" className="btn-primary" style={{ width: "100%" }}>
          Continue to sign in
        </Link>
        <Link
          href={`/resend-verification${email ? `?email=${encodeURIComponent(email)}` : ""}`}
          className="text-link"
          style={{ fontSize: "0.92rem" }}
        >
          Didn&apos;t get it? Resend the email
        </Link>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: 320 }} />}>
      <CheckEmailInner />
    </Suspense>
  );
}
