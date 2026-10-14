"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { auth, type User } from "@/lib/api";
import { getGoogleIdToken } from "@/lib/google";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const me = await auth.me();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsReady(true));
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<User | null> => {
    const result = await auth.login({ email, password });
    const current = result.user ?? (await refreshUser());
    if (current) setUser(current);
    return current;
  };

  const loginWithGoogle = async (): Promise<User | null> => {
    const idToken = await getGoogleIdToken();
    const result = await auth.googleSignIn(idToken);
    const current = result.user ?? (await refreshUser());
    if (current) setUser(current);
    return current;
  };

  const register = async (display_name: string, email: string, password: string): Promise<string> => {
    const result = await auth.register({ display_name, email, password });
    return result.message;
  };

  const logout = async () => {
    try {
      await auth.logout();
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return {
    user,
    isReady,
    isAuthed: !!user,
    login,
    loginWithGoogle,
    register,
    logout,
    refreshUser,
  };
}
