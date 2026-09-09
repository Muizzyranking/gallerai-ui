import Link from "next/link";

export default function BackToSignIn({ variant = "text" }: { variant?: "text" | "button" }) {
  return variant === "button" ? (
    <Link href="/login" className="btn-primary" style={{ width: "100%" }}>
      Back to sign in
    </Link>
  ) : (
    <Link href="/login" style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--ink-3)" }}>
      ← Back to sign in
    </Link>
  );
}
