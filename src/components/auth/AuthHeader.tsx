export default function AuthHeader({
  kicker,
  title,
  subtitle,
  size = "lg",
}: {
  kicker: string;
  title: string;
  subtitle: React.ReactNode;
  size?: "lg" | "md";
}) {
  const sizes =
    size === "lg"
      ? { fontSize: "2.4rem", lineHeight: 1.05, marginBottom: 32 }
      : { fontSize: "2.2rem", lineHeight: 1.08, marginBottom: 30 };

  return (
    <div style={{ marginBottom: sizes.marginBottom }}>
      <div className="kicker" style={{ marginBottom: 12 }}>
        {kicker}
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: sizes.fontSize,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          lineHeight: sizes.lineHeight,
          marginBottom: 10,
        }}
      >
        {title}
      </h1>
      <p style={{ fontSize: "1rem", color: "var(--ink-2)" }}>{subtitle}</p>
    </div>
  );
}
