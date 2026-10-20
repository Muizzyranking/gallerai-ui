const BACKEND = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const ACCESS_COOKIE = "gallerai_access";
export const REFRESH_COOKIE = "gallerai_refresh";

export const ACCESS_MAX_AGE = 60 * 60; // 1 hour
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const isProd = process.env.NODE_ENV === "production";

export function cookieOpts(maxAge: number) {
  return { httpOnly: true as const, secure: isProd, sameSite: "lax" as const, path: "/", maxAge };
}

export interface TokenPair {
  access_token: string;
  refresh_token?: string | null;
}

async function doRefresh(refreshToken: string): Promise<TokenPair | null> {
  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    const json = (await res.json().catch(() => null)) as { data?: TokenPair } | null;
    const data = json?.data;
    if (!data?.access_token) return null;
    return { access_token: data.access_token, refresh_token: data.refresh_token ?? null };
  } catch {
    return null;
  }
}

const inflight = new Map<string, Promise<TokenPair | null>>();

export function refreshTokens(refreshToken: string): Promise<TokenPair | null> {
  const existing = inflight.get(refreshToken);
  if (existing) return existing;
  const task = doRefresh(refreshToken);
  const tracked = task.finally(() => {
    if (inflight.get(refreshToken) === tracked) inflight.delete(refreshToken);
  });
  inflight.set(refreshToken, tracked);
  return tracked;
}

export function backendUrl(path: string): string {
  return `${BACKEND}${path}`;
}
