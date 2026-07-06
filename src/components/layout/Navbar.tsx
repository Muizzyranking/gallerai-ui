"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const linkStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "0.72rem",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--ink-3)",
    transition: "color 0.2s",
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 64,
        transition: "background 0.35s, border-color 0.35s",
        background: scrolled ? "rgba(10,10,15,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--rule)" : "1px solid transparent",
      }}
    >
      {/* Light mode overrides */}
      <style>{`
        html[data-theme="light"] header {
          background: ${scrolled ? "rgba(245,240,232,0.9)" : "transparent"} !important;
        }
      `}</style>

      <div className="wrap" style={{ height: "100%", display: "flex", alignItems: "center", gap: 32 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <rect width="26" height="26" rx="5" fill="var(--coral)" />
            <path d="M7 13.5L11.5 18L19 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 600, color: "var(--ink)" }}>
            Galler<em style={{ fontStyle: "italic", color: "var(--coral)" }}>AI</em>
          </span>
        </Link>

        {/* Desktop center nav */}
        <nav style={{ flex: 1, display: "flex", justifyContent: "center", gap: 36 }} className="nav-desktop">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--ink-3)";
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }} className="nav-desktop">
          <ThemeToggle />
          <Link
            href="/login"
            style={{ ...linkStyle, color: "var(--ink-2)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--ink-2)";
            }}
          >
            Sign in
          </Link>
          <Link href="/register" className="btn-primary" style={{ padding: "9px 20px", fontSize: "0.68rem" }}>
            Get started
          </Link>
        </div>

        {/* Mobile right */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }} className="nav-mobile">
          <ThemeToggle />
          <button type="button" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <>
                  <path d="M3 3l14 14" />
                  <path d="M17 3L3 17" />
                </>
              ) : (
                <>
                  <path d="M2 5h16" />
                  <path d="M2 10h16" />
                  <path d="M2 15h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: "hidden", background: "var(--bg-1)", borderTop: "1px solid var(--rule)" }}
          >
            <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 0 }}>
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "14px 0",
                    borderBottom: "1px solid var(--rule)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    color: "var(--ink-2)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {l.label}
                </Link>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 20 }}>
                <Link href="/login" style={{ textAlign: "center", padding: "12px", fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--ink-2)" }}>
                  Sign in
                </Link>
                <Link href="/register" className="btn-primary" style={{ justifyContent: "center" }}>
                  Get started free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile  { display: none  !important; }
        @media (max-width: 768px) {
          .nav-desktop { display: none  !important; }
          .nav-mobile  { display: flex  !important; }
        }
      `}</style>
    </header>
  );
}
