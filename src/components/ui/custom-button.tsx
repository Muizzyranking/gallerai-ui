export default function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
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
    padding: "12px 24px",
    borderRadius: 8,
    fontFamily: "var(--font-body)",
    fontSize: "0.9rem",
    fontWeight: 500,
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
    },
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
          if (variant === "primary") el.style.background = "#e55a5a";
          if (variant === "secondary") el.style.background = "var(--bg-3)";
          if (variant === "ghost") el.style.color = "var(--ink)";
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        if (variant === "primary") el.style.background = "var(--coral)";
        if (variant === "secondary") el.style.background = "var(--bg-2)";
        if (variant === "ghost") el.style.color = "var(--ink-2)";
      }}
    >
      {children}
    </button>
  );
}
