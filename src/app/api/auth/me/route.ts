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

/** Current user: attaches the access cookie, refreshes once on 401,
 *  and passes the backend envelope through. */
export async function GET(req: NextRequest) {
  let access = req.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  let rotated: { access_token: string; refresh_token?: string | null } | null = null;

  if (!access && refreshToken) {
    rotated = await refreshTokens(refreshToken);
    access = rotated?.access_token;
  }

  if (!access) {
    return NextResponse.json({ message: "Not signed in", data: null }, { status: 401 });
  }

  const callMe = (token: string) =>
    fetch(backendUrl("/api/v1/auth/me"), {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });

  let res: Response;
  try {
    res = await callMe(access);
  } catch {
    return NextResponse.json({ message: "Could not reach the server. Please try again.", data: null }, { status: 502 });
  }

  if (res.status === 401 && refreshToken && !rotated) {
    rotated = await refreshTokens(refreshToken);
    if (!rotated) {
      const out = NextResponse.json({ message: "Session expired. Please sign in again.", data: null }, { status: 401 });
      out.cookies.delete(ACCESS_COOKIE);
      out.cookies.delete(REFRESH_COOKIE);
      return out;
    }
    try {
      res = await callMe(rotated.access_token);
    } catch {
      return NextResponse.json(
        { message: "Could not reach the server. Please try again.", data: null },
        { status: 502 },
      );
    }
    if (res.status === 401) {
      const out = NextResponse.json({ message: "Session expired. Please sign in again.", data: null }, { status: 401 });
      out.cookies.delete(ACCESS_COOKIE);
      out.cookies.delete(REFRESH_COOKIE);
      return out;
    }
  }

  const json = (await res.json().catch(() => null)) as { message?: string; data?: unknown } | null;
  const out = NextResponse.json(
    { message: json?.message ?? "Request processed successfully", data: json?.data ?? null },
    { status: res.status },
  );
  if (rotated) {
    out.cookies.set(ACCESS_COOKIE, rotated.access_token, cookieOpts(ACCESS_MAX_AGE));
    if (rotated.refresh_token) out.cookies.set(REFRESH_COOKIE, rotated.refresh_token, cookieOpts(REFRESH_MAX_AGE));
  }
  return out;
}
