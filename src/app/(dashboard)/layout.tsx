"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

/* ── Nav config ────────────────────────────────────────────── */
const NAV_MAIN = [
  {
    label: "Dashboard",
    href:  "/dashboard",
    exact: true,
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="1" y="1" width="6" height="6" rx="1.2"/>
        <rect x="9" y="1" width="6" height="6" rx="1.2"/>
        <rect x="1" y="9" width="6" height="6" rx="1.2"/>
        <rect x="9" y="9" width="6" height="6" rx="1.2"/>
      </svg>
    ),
  },
  {
    label: "Create Event",
    href:  "/events/create",
    exact: true,
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6.5"/>
        <path d="M8 5v6M5 8h6"/>
      </svg>
    ),
  },
  {
    label: "Attending",
    href:  "/attending",
    exact: true,
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M11 14v-1.5a3 3 0 00-3-3H4a3 3 0 00-3 3V14"/>
        <circle cx="6" cy="5.5" r="2.5"/>
        <path d="M14 14v-1.5a3 3 0 00-2-2.83"/>
        <path d="M10.5 2.17a2.5 2.5 0 010 4.66"/>
      </svg>
    ),
  },
];

const NAV_BOTTOM = [
  {
    label: "Account",
    href:  "/account",
    exact: false,
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="5.5" r="2.5"/>
        <path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6"/>
      </svg>
    ),
  },
  {
    label: "Billing",
    href:  "/billing",
    exact: false,
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="1" y="3.5" width="14" height="10" rx="1.5"/>
        <path d="M1 7h14"/>
        <path d="M4.5 10.5h2"/>
      </svg>
    ),
  },
];

const OPEN_W      = 232;
const COLLAPSED_W = 60;

/* ── Avatar ─────────────────────────────────────────────────── */
function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "var(--coral-subtle)",
      borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,107,107,0.25)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono)", fontSize: size < 36 ? "0.58rem" : "0.7rem",
      color: "var(--coral)", letterSpacing: "0.05em", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

/* ── Single nav link ─────────────────────────────────────────── */
function NavLink({
  item, active, collapsed, onClick,
}: {
  item: typeof NAV_MAIN[0]; active: boolean; collapsed: boolean; onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      style={{
        display: "flex", alignItems: "center",
        gap: 10,
        padding: collapsed ? "9px 0" : "9px 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 7,
        fontFamily: "var(--font-body)", fontSize: "0.8rem",
        fontWeight: active ? 600 : 400,
        color: active ? "var(--ink)" : "var(--ink-3)",
        background: active ? "var(--bg-3)" : "transparent",
        borderWidth: 1, borderStyle: "solid",
        borderColor: active ? "var(--rule-strong)" : "transparent",
        transition: "all 0.14s", textDecoration: "none",
        whiteSpace: "nowrap", overflow: "hidden",
        position: "relative",
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {/* Active coral bar */}
      {active && (
        <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 2, borderRadius: 2, background: "var(--coral)" }}/>
      )}
      <span style={{ flexShrink: 0, color: active ? "var(--coral)" : "inherit", display: "flex" }}>
        {item.icon(active)}
      </span>
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────── */
function Sidebar({
  collapsed, onToggleCollapse, pathname, onNavClick,
}: {
  collapsed: boolean; onToggleCollapse: () => void;
  pathname: string; onNavClick?: () => void;
}) {
  const { user, logout } = useAuth();

  const isActive = (item: typeof NAV_MAIN[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div style={{
      width:       collapsed ? COLLAPSED_W : OPEN_W,
      height:      "100vh",
      position:    "sticky",
      top:         0,
      background:  "var(--bg-1)",
      borderRightWidth: 1, borderRightStyle: "solid", borderRightColor: "var(--rule)",
      display:     "flex",
      flexDirection: "column",
      transition:  "width 0.2s ease",
      overflow:    "hidden",
      flexShrink:  0,
    }}>

      {/* ── Logo row ── */}
      <div style={{
        height: 60, display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        padding: collapsed ? 0 : "0 12px 0 16px",
        borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--rule)",
        flexShrink: 0,
      }}>
        {!collapsed && (
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
              <rect width="26" height="26" rx="5" fill="var(--coral)"/>
              <path d="M7 13.5L11.5 18L19 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>
              Galler<em style={{ fontStyle: "italic", color: "var(--coral)" }}>AI</em>
            </span>
          </Link>
        )}
        <button
          onClick={onToggleCollapse}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: 6, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-3)")}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {collapsed
              ? <path d="M2 7h10M6 3l4 4-4 4"/>
              : <path d="M12 7H2M8 3L4 7l4 4"/>
            }
          </svg>
        </button>
      </div>

      {/* ── Main nav ── */}
      <nav style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        padding: collapsed ? "10px 6px" : "10px 10px",
        display: "flex", flexDirection: "column", gap: 2,
      }}>
        {NAV_MAIN.map(item => (
          <NavLink key={item.href} item={item} active={isActive(item)} collapsed={collapsed} onClick={onNavClick}/>
        ))}

        {/* Divider */}
        <div style={{ height: 1, background: "var(--rule)", margin: "10px 0" }}/>

        {NAV_BOTTOM.map(item => (
          <NavLink key={item.href} item={item} active={isActive(item)} collapsed={collapsed} onClick={onNavClick}/>
        ))}
      </nav>

      {/* ── Footer: theme + user + logout ── */}
      <div style={{
        borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: "var(--rule)",
        padding: collapsed ? "10px 6px" : "12px 14px",
        display: "flex", flexDirection: "column", gap: 10, flexShrink: 0,
      }}>

        {/* Theme toggle row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 10,
        }}>
          <ThemeToggle />
          {!collapsed && (
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.76rem", color: "var(--ink-3)" }}>
              Theme
            </span>
          )}
        </div>

        {/* User row */}
        {!collapsed ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {user && <Avatar name={user.display_name} size={30} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.display_name}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.54rem", color: "var(--ink-3)", letterSpacing: "0.06em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>
                {user?.email}
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: 4, display: "flex", borderRadius: 4, flexShrink: 0, transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--coral)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-3)")}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 13H2a1 1 0 01-1-1V3a1 1 0 011-1h4M10 10l3-2.5L10 5M14 7.5H6"/>
              </svg>
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {user && <Avatar name={user.display_name} size={30} />}
            <button
              onClick={logout}
              title="Sign out"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: 4, display: "flex", borderRadius: 4, transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--coral)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-3)")}
            >
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 13H2a1 1 0 01-1-1V3a1 1 0 011-1h4M10 10l3-2.5L10 5M14 7.5H6"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Layout ─────────────────────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname              = usePathname();
  const router                = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer,    setDrawer]    = useState(false);
  const { isReady, isAuthed }     = useAuth();

  useEffect(() => { setDrawer(false); }, [pathname]);

  useEffect(() => {
    if (isReady && !isAuthed) router.replace("/login");
  }, [isReady, isAuthed, router]);

  if (!isReady) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
          <path d="M9 1v3M9 14v3M1 9h3M14 9h3M3.22 3.22l2.12 2.12M12.66 12.66l2.12 2.12M3.22 14.78l2.12-2.12M12.66 5.34l2.12-2.12"/>
        </svg>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthed) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>

      {/* Desktop sidebar */}
      <div className="db-sidebar">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(c => !c)}
          pathname={pathname}
        />
      </div>

      {/* Mobile topbar */}
      <div className="db-topbar" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: 54,
        background: "var(--bg-1)",
        borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--rule)",
        display: "flex", alignItems: "center", padding: "0 16px", gap: 12,
      }}>
        <button
          onClick={() => setDrawer(true)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", padding: 4, display: "flex" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 4h14M2 9h14M2 14h14"/>
          </svg>
        </button>

        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
            <rect width="26" height="26" rx="5" fill="var(--coral)"/>
            <path d="M7 13.5L11.5 18L19 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, color: "var(--ink)" }}>
            Galler<em style={{ fontStyle: "italic", color: "var(--coral)" }}>AI</em>
          </span>
        </Link>

        {/* Theme toggle in mobile topbar */}
        <div style={{ marginLeft: "auto" }}>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setDrawer(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 60 }}
            />
            <motion.div
              key="drawer"
              initial={{ x: -OPEN_W }} animate={{ x: 0 }} exit={{ x: -OPEN_W }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 70, width: OPEN_W }}
            >
              <Sidebar
                collapsed={false}
                onToggleCollapse={() => setDrawer(false)}
                pathname={pathname}
                onNavClick={() => setDrawer(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="db-main" style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>

      <style>{`
        .db-sidebar { display: flex !important; }
        .db-topbar  { display: none  !important; }
        .db-main    { padding-top: 0; }
        @media (max-width: 768px) {
          .db-sidebar { display: none !important; }
          .db-topbar  { display: flex !important; }
          .db-main    { padding-top: 54px; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
