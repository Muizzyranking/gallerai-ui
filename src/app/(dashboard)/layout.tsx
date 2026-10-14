"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VerifyEmailBanner from "@/components/dashboard/VerifyEmailBanner";
import { EventsIcon, LogoutIcon, MenuIcon, PlusIcon, UserIcon } from "@/components/icons";
import Brand from "@/components/layout/Brand";
import IconButton from "@/components/ui/IconButton";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { label: "Events", href: "/dashboard", exact: true, icon: <EventsIcon size={16} /> },
  { label: "New event", href: "/events/create", exact: true, icon: <PlusIcon size={13} /> },
  { label: "Account", href: "/account", exact: false, icon: <UserIcon size={16} /> },
];

function Avatar({ name, size = 30 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--coral-subtle)",
        color: "var(--coral)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontSize: "0.72rem",
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

/* ── Layout: slim top bar (3 entries don't need a sidebar) ─── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isReady, isAuthed, user, logout } = useAuth();

  // Reset menu state when navigating to a new page. This is important for mobile, where the menu is a dropdown.
  // `pathname` is not read here, but the effect must re-run when it changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: menu must be closed when navigating to a new page
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isReady && !isAuthed) router.replace("/login");
  }, [isReady, isAuthed, router]);

  if (!isReady) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid var(--coral)",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthed) return null;

  const isActive = (href: string, exact: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--bg)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 clamp(20px, 4vw, 44px)",
            height: 62,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Link href="/dashboard" style={{ textDecoration: "none", flexShrink: 0 }} aria-label="Dashboard">
            <Brand size="sm" link={false} />
          </Link>

          <nav className="db-nav" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem",
                    fontWeight: active ? 700 : 500,
                    color: active ? "var(--coral)" : "var(--ink-2)",
                    background: active ? "var(--coral-subtle)" : "transparent",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            {user && <Avatar name={user.display_name} />}
            <span
              className="db-user"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--ink)",
                maxWidth: 140,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.display_name}
            </span>
            <IconButton label="Sign out" variant="solid" size={32} onClick={() => void logout()}>
              <LogoutIcon size={15} />
            </IconButton>
            <span className="db-burger">
              <IconButton label="Menu" variant="solid" size={32} onClick={() => setMenuOpen((o) => !o)}>
                <MenuIcon size={16} />
              </IconButton>
            </span>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="db-menu"
              style={{ overflow: "hidden", borderTop: "1px solid var(--rule)" }}
            >
              <div
                style={{ padding: "8px clamp(20px, 4vw, 44px) 12px", display: "flex", flexDirection: "column", gap: 2 }}
              >
                {NAV.map((item) => {
                  const active = isActive(item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "11px 12px",
                        borderRadius: 8,
                        fontFamily: "var(--font-body)",
                        fontSize: "0.92rem",
                        fontWeight: active ? 700 : 500,
                        color: active ? "var(--coral)" : "var(--ink)",
                        background: active ? "var(--coral-subtle)" : "transparent",
                        textDecoration: "none",
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto" }}>
        {user && !user.is_email_confirmed && (
          <div style={{ padding: "20px clamp(20px, 4vw, 44px) 0" }}>
            <VerifyEmailBanner user={user} />
          </div>
        )}
        {children}
      </main>

      <style>{`
        .db-burger { display: none; }
        .db-menu { display: none; }
        @media (max-width: 720px) {
          .db-nav { display: none !important; }
          .db-user { display: none !important; }
          .db-burger { display: inline-flex !important; }
          .db-menu { display: block !important; }
        }
      `}</style>
    </div>
  );
}
