export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "sm";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: size === "sm" ? "8px 14px" : "12px 24px",
    borderRadius: 8,
    fontFamily: "var(--font-body)",
    fontSize: size === "sm" ? "0.8rem" : "0.9rem",
    fontWeight: size === "sm" ? 600 : 500,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    border: "none",
    opacity: disabled ? 0.6 : 1,
  };

  const variants = {
    primary: {
      ...baseStyle,
      background: "var(--coral)",
      color: "#fff",
      border: "1px solid transparent",
    },
    secondary: {
      ...baseStyle,
      background: "var(--bg-2)",
      color: "var(--ink)",
      border: "1px solid var(--rule-strong)",
    },
    ghost: {
      ...baseStyle,
      background: "transparent",
      color: "var(--ink-2)",
      // Transparent border keeps the same box as secondary so toggling
      // variants (e.g. dashboard filters) never shifts layout by 1px.
      border: "1px solid transparent",
    },
    danger: {
      ...baseStyle,
      background: "transparent",
      color: "#e05555",
      border: "1px solid rgba(200,60,60,0.35)",
    },
  };

  const hoverBg: Record<string, string> = {
    primary: "#e55a5a",
    secondary: "var(--bg-3)",
    danger: "rgba(200,60,60,0.08)",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={variants[variant]}
      className={className}
      onMouseEnter={(e) => {
        if (!disabled) {
          const el = e.currentTarget as HTMLElement;
          if (variant === "ghost") el.style.color = "var(--ink)";
          else el.style.background = hoverBg[variant] ?? variants[variant].background ?? "";
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        if (variant === "ghost") el.style.color = "var(--ink-2)";
        else el.style.background = variants[variant].background ?? "";
      }}
    >
      {children}
    </button>
  );
}
