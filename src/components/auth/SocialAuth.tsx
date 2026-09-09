import GoogleIcon from "@/components/ui/GoogleIcon";

export default function SocialAuthSection() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "26px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.12em", color: "var(--ink-3)" }}>
          OR
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>
      <button type="button" className="btn-secondary" style={{ width: "100%" }}>
        <GoogleIcon />
        Continue with Google
      </button>
    </>
  );
}
