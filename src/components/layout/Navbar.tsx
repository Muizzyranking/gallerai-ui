"use client";

import Link from "next/link";
import { useState } from "react";
import { nav } from "@/content/site";
import { useAuth } from "@/hooks/useAuth";
import Brand from "./Brand";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isReady, isAuthed } = useAuth();

  const firstName = user?.display_name?.split(" ")[0];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,253,249,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="wrap" style={{ height: 68, display: "flex", alignItems: "center", gap: 28 }}>
        <Brand />

        <nav
          aria-label="Primary"
          style={{ flex: 1, display: "flex", justifyContent: "center", gap: 28 }}
          className="nav-desktop"
        >
          {nav.primary.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--ink-2)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--ink-2)";
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="nav-desktop">
          {!isReady ? (
            <span style={{ width: 180, height: 42 }} aria-hidden="true" />
          ) : isAuthed ? (
            <>
              <Link
                href="/dashboard"
                style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--ink-2)", padding: "10px 12px" }}
              >
                {firstName ? `${firstName}'s events` : "Dashboard"}
              </Link>
              <Link href="/events/create" className="btn-primary" style={{ padding: "11px 20px", fontSize: "0.9rem" }}>
                New event
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--ink-2)", padding: "10px 12px" }}
              >
                Sign in
              </Link>
              <Link href="/register" className="btn-primary" style={{ padding: "11px 20px", fontSize: "0.9rem" }}>
                Create event
              </Link>
            </>
          )}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }} className="nav-mobile">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            style={{
              background: "#fff",
              border: "1.5px solid var(--line-strong)",
              borderRadius: 10,
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--ink)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="M4 4l12 12" />
                  <path d="M16 4L4 16" />
                </>
              ) : (
                <>
                  <path d="M2.5 5.5h15" />
                  <path d="M2.5 10h15" />
                  <path d="M2.5 14.5h15" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="nav-mobile" style={{ borderTop: "1px solid var(--line)", background: "#fff" }}>
          <div className="wrap" style={{ paddingTop: 8, paddingBottom: 20, display: "flex", flexDirection: "column" }}>
            {nav.primary.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  padding: "14px 4px",
                  borderBottom: "1px solid var(--line)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--ink)",
                }}
              >
                {l.label}
              </Link>
            ))}
            <div style={{ display: "flex", gap: 10, paddingTop: 16 }}>
              {isAuthed ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="btn-secondary" style={{ flex: 1 }}>
                    Dashboard
                  </Link>
                  <Link
                    href="/events/create"
                    onClick={() => setOpen(false)}
                    className="btn-primary"
                    style={{ flex: 1 }}
                  >
                    New event
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary" style={{ flex: 1 }}>
                    Sign in
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="btn-primary" style={{ flex: 1 }}>
                    Create event
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        @media (max-width: 860px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          div.nav-mobile { display: block !important; }
          div.nav-mobile .wrap { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
