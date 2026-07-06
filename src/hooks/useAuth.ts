"use client";

import { useRouter } from "next/navigation";
import { ApiError, auth } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

function setSessionCookie(value: boolean) {
  if (typeof document === "undefined") return;
  if (value) {
    // biome-ignore lint/suspicious/noDocumentCookie: pass
    document.cookie = "gallerai_session=1; path=/; SameSite=Lax";
  } else {
    // biome-ignore lint/suspicious/noDocumentCookie: pass
    document.cookie = "gallerai_session=; max-age=0; path=/";
  }
}

export function useAuth() {
  const router = useRouter();
  const store = useAuthStore();

  const login = async (email: string, password: string) => {
    const tokenData = await auth.login({ email, password });
    store.setToken(tokenData.access_token);
    setSessionCookie(true);

    const user = await auth.me();
    store.setUser(user);

    return user;
  };

  const register = async (display_name: string, email: string, password: string) => {
    const tokenData = await auth.register({ display_name, email, password });
    store.setToken(tokenData.access_token);
    setSessionCookie(true);

    const user = await auth.me();
    store.setUser(user);

    return user;
  };

  const logout = () => {
    store.clearAuth();
    setSessionCookie(false);
    router.push("/login");
  };

  const refreshUser = async () => {
    try {
      const user = await auth.me();
      store.setUser(user);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) logout();
    }
  };

  return {
    user: store.user,
    token: store.token,
    isReady: store.isReady,
    isAuthed: !!store.token && !!store.user,
    login,
    register,
    logout,
    refreshUser,
  };
}
