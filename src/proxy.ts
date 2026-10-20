import { type NextRequest, NextResponse } from "next/server";

/**
 * Auth state is derived from the presence of the httpOnly session cookies
 * (`gallerai_access` / `gallerai_refresh`) set by /api/auth/login. The edge
 * only checks presence — real validation happens server-side in routes.
 *
 *  - Any path starting with a protected prefix requires a session cookie,
 *    otherwise the visitor goes to /login?next=<original-url>.
 *  - Auth pages bounce signed-in visitors to `next` or /dashboard.
 *
 * /confirm-email is intentionally open in both states: signed-out users
 * land on login after confirming; signed-in users continue to dashboard.
 */

const SESSION_COOKIES = ["gallerai_access", "gallerai_refresh"];

/** App-private area — everything under these prefixes needs a session. */
const PROTECTED_PREFIXES = ["/dashboard", "/account", "/events/create"];

/** /events/[id]/settings, /upload, /bin, /approvals and /flags are organiser-only,
 *  while /events/[id] itself stays a public gallery. */
const PROTECTED_SUFFIX = /\/(settings|upload|bin|approvals|flags)$/;

const AUTH_PAGES = new Set(["/login", "/register", "/forgot-password"]);

function isProtected(pathname: string): boolean {
  if (PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;
  return pathname.startsWith("/events/") && PROTECTED_SUFFIX.test(pathname);
}

function safeNext(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export default function proxy(req: NextRequest) {
  const hasSession = SESSION_COOKIES.some((c) => req.cookies.has(c));
  const { pathname, search } = req.nextUrl;

  if (isProtected(pathname) && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (AUTH_PAGES.has(pathname) && hasSession) {
    const url = req.nextUrl.clone();
    const next = safeNext(req.nextUrl.searchParams.get("next")) ?? "/dashboard";
    url.pathname = next;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/dashboard/:path*",
    "/account/:path*",
    "/events/create",
    "/events/:path*/settings",
    "/events/:path*/upload",
    "/events/:path*/bin",
    "/events/:path*/approvals",
    "/events/:path*/flags",
  ],
};
