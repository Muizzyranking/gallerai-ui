import { type NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, backendUrl, REFRESH_COOKIE } from "@/lib/auth-server";

/** Logout: terminates the backend session, then clears session cookies. */
export async function POST(req: NextRequest) {
  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  const body = await req.json().catch(() => ({}) as { all_sessions?: boolean });

  if (access || refreshToken) {
    try {
      await fetch(backendUrl("/api/v1/auth/logout"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(access ? { Authorization: `Bearer ${access}` } : {}),
        },
        body: JSON.stringify({ refresh_token: refreshToken ?? undefined, all_sessions: body.all_sessions ?? false }),
      });
    } catch {
      // Clearing local cookies is what matters to the client.
    }
  }

  const out = NextResponse.json({ message: "Signed out successfully", data: null });
  out.cookies.delete(ACCESS_COOKIE);
  out.cookies.delete(REFRESH_COOKIE);
  return out;
}
