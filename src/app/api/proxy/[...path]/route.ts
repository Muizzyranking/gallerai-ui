import { type NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  backendUrl,
  cookieOpts,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
  refreshTokens,
} from "@/lib/auth-server";

const PASS_HEADERS = [
  "content-type",
  "content-length",
  "content-disposition",
  "cache-control",
  "etag",
  "last-modified",
  "accept-ranges",
  "content-range",
];

function passthrough(res: Response): NextResponse {
  const headers = new Headers();
  for (const key of PASS_HEADERS) {
    const value = res.headers.get(key);
    if (value) headers.set(key, value);
  }
  // SSE streams must not be buffered.
  if (res.headers.get("content-type")?.includes("text/event-stream")) {
    headers.set("cache-control", "no-cache");
    headers.set("x-accel-buffering", "no");
  }
  const out = new NextResponse(res.body, { status: res.status, headers });
  // Forward backend cookies (event_access_{eventId} for private events,
  // refreshed pairs, etc.) so the browser stores them on our origin.
  const setCookies: string[] =
    typeof (res.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie === "function"
      ? (res.headers as Headers & { getSetCookie: () => string[] }).getSetCookie()
      : res.headers.get("set-cookie")
        ? [res.headers.get("set-cookie") as string]
        : [];
  for (const c of setCookies) out.headers.append("set-cookie", c);
  return out;
}

function sessionExpired(): NextResponse {
  const res = NextResponse.json({ message: "Session expired. Please sign in again.", data: null }, { status: 401 });
  res.cookies.delete(ACCESS_COOKIE);
  res.cookies.delete(REFRESH_COOKIE);
  return res;
}

async function handleProxy(req: NextRequest, params: { path?: string[] }) {
  const backendPath = `/${(params.path ?? []).join("/")}`;

  // Not an open proxy: only backend API/health paths are forwardable.
  if (!backendPath.startsWith("/api/") && !backendPath.startsWith("/health")) {
    return NextResponse.json({ message: "Not found", data: null }, { status: 404 });
  }

  const url = `${backendUrl(backendPath)}${req.nextUrl.search}`;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

  let body: ArrayBuffer | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const buf = await req.arrayBuffer().catch(() => null);
    if (buf && buf.byteLength > 0) body = buf;
  }

  const forward = (accessToken?: string) => {
    const headers = new Headers();
    const contentType = req.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    headers.set("accept", req.headers.get("accept") ?? "application/json");
    // Forward browser cookies (event_access_{eventId} for private events).
    const cookie = req.headers.get("cookie");
    if (cookie) headers.set("cookie", cookie);
    if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
    return fetch(url, { method: req.method, headers, body });
  };

  // Attach the organiser session whenever present — harmless on public
  // event-access routes, required on organiser routes.
  const attached = req.cookies.get(ACCESS_COOKIE)?.value;
  let res: Response;
  try {
    res = await forward(attached);
  } catch {
    return NextResponse.json({ message: "Could not reach the server. Please try again.", data: null }, { status: 502 });
  }

  // Only treat 401 as "session expired" when a session existed. Anonymous
  // attendee requests (bad passcode, expired scan token) pass through.
  if (res.status === 401 && attached && refreshToken) {
    const pair = await refreshTokens(refreshToken);
    if (!pair) return sessionExpired();
    try {
      res = await forward(pair.access_token);
    } catch {
      return NextResponse.json(
        { message: "Could not reach the server. Please try again.", data: null },
        { status: 502 },
      );
    }
    if (res.status === 401) return sessionExpired();
    const out = passthrough(res);
    out.cookies.set(ACCESS_COOKIE, pair.access_token, cookieOpts(ACCESS_MAX_AGE));
    if (pair.refresh_token) out.cookies.set(REFRESH_COOKIE, pair.refresh_token, cookieOpts(REFRESH_MAX_AGE));
    return out;
  }

  return passthrough(res);
}

type Ctx = { params: Promise<{ path?: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return handleProxy(req, await ctx.params);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return handleProxy(req, await ctx.params);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return handleProxy(req, await ctx.params);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return handleProxy(req, await ctx.params);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return handleProxy(req, await ctx.params);
}
