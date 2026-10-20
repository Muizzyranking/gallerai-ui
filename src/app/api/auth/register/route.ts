import { type NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/auth-server";

/** Register: forwards to the backend and passes the envelope through.
 *  No tokens are issued here — the user must confirm their email first,
 *  so no cookies are set. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  let res: Response;
  try {
    res = await fetch(backendUrl("/api/v1/auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ message: "Could not reach the server. Please try again.", data: null }, { status: 502 });
  }

  const json = (await res.json().catch(() => null)) as { message?: string; data?: unknown; errors?: unknown } | null;

  return NextResponse.json(
    {
      message: json?.message ?? "Request processed successfully",
      data: json?.data ?? null,
      errors: json?.errors ?? null,
    },
    { status: res.status },
  );
}
