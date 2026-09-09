import BackToSignIn from "../ui/back_to_sign_in";

export default function EmailSentNotice({ title, message, variant }: { title: string; message: React.ReactNode; variant: "card" | "standalone" }) {
  const icon = (
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
        fontWeight: variant === "card" ? 700 : undefined,
      }}
    >
      ✉
    </span>
  );

  if (variant === "card") {
    return (
      <div className="card" style={{ padding: "32px 28px", textAlign: "center" }}>
        {icon}
        <h2 style={{ fontSize: "1.2rem", fontWeight: 750, marginBottom: 8 }}>{title}</h2>
        <p className="body-text">{message}</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      {icon}
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>{title}</h1>
      <p className="body-text" style={{ marginBottom: 26 }}>
        {message}
      </p>
      <BackToSignIn variant="button" />
    </div>
  );
}
