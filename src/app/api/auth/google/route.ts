import { type NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  backendUrl,
  cookieOpts,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
} from "@/lib/auth-server";

/** Google sign-in: exchanges the client-side ID token at the backend,
 *  which verifies it, creates/gets the account, and returns our session
 *  tokens. Stored in httpOnly cookies exactly like password login. */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { id_token?: string };
  if (!body.id_token) {
    return NextResponse.json({ message: "Missing Google credential. Please try again.", data: null }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(backendUrl("/api/v1/auth/google"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: body.id_token }),
    });
  } catch {
    return NextResponse.json({ message: "Could not reach the server. Please try again.", data: null }, { status: 502 });
  }

  const json = (await res.json().catch(() => null)) as {
    message?: string;
    data?: { access_token?: string; refresh_token?: string } | null;
    errors?: unknown;
  } | null;

  if (!res.ok) {
    return NextResponse.json(
      { message: json?.message ?? "Google sign-in failed", data: null, errors: json?.errors ?? null },
      { status: res.status },
    );
  }

  const tokens = json?.data;
  if (!tokens?.access_token) {
    return NextResponse.json({ message: "Google sign-in failed. Please try again.", data: null }, { status: 500 });
  }

  let user: unknown = null;
  try {
    const meRes = await fetch(backendUrl("/api/v1/auth/me"), {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (meRes.ok) {
      const meJson = (await meRes.json().catch(() => null)) as { data?: unknown } | null;
      user = meJson?.data ?? null;
    }
  } catch {
    user = null;
  }

  const out = NextResponse.json({ message: json?.message ?? "Login successful", data: user }, { status: res.status });
  out.cookies.set(ACCESS_COOKIE, tokens.access_token, cookieOpts(ACCESS_MAX_AGE));
  if (tokens.refresh_token) out.cookies.set(REFRESH_COOKIE, tokens.refresh_token, cookieOpts(REFRESH_MAX_AGE));
  return out;
}
