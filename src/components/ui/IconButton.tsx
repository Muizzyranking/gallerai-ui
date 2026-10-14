"use client";

/** Icon-only action button — the one shared place for icon buttons,
 *  so pages never hand-roll <button> styling for icons. */
export default function IconButton({
  children,
  onClick,
  label,
  variant = "ghost",
  size = 32,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  label: string;
  variant?: "ghost" | "solid" | "dark";
  size?: number;
}) {
  const styles: Record<string, React.CSSProperties> = {
    ghost: { background: "none", border: "none", color: "var(--ink-2)" },
    solid: { background: "var(--bg-3)", border: "1px solid var(--rule-strong)", color: "var(--ink-2)" },
    dark: { background: "rgba(0,0,0,0.55)", border: "none", color: "#fff" },
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        ...styles[variant],
        width: size,
        height: size,
        borderRadius: variant === "solid" ? 8 : "50%",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
