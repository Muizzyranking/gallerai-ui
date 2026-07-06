"use client";

import { useEffect, useState } from "react";

const applyTheme = (dark: boolean) => {
  if (dark) {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
};

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("gallerai-theme");
    if (stored) {
      const dark = stored === "dark";
      setIsDark(dark);
      applyTheme(dark);
    } else {
      const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(sysDark);
      applyTheme(sysDark);
    }
  }, []);

  if (!mounted) return <div style={{ width: 34, height: 34 }} />;

  const toggle = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    applyTheme(nextDark);
    localStorage.setItem("gallerai-theme", nextDark ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        background: "none",
        border: "1px solid var(--rule-strong)",
        borderRadius: "50%",
        width: 34,
        height: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "var(--ink-2)",
        flexShrink: 0,
        transition: "border-color 0.2s, color 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = "var(--ink)";
        el.style.borderColor = "var(--ink-3)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = "var(--ink-2)";
        el.style.borderColor = "var(--rule-strong)";
      }}
    >
      {isDark ? (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
          <circle cx="7.5" cy="7.5" r="2.5" />
          <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.93 2.93l1.06 1.06M11.01 11.01l1.06 1.06M2.93 12.07l1.06-1.06M11.01 3.99l1.06-1.06" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M13.5 8.5a5.5 5.5 0 1 1-5.5-5.5 4.25 4.25 0 0 0 5.5 5.5z" />
        </svg>
      )}
    </button>
  );
}
