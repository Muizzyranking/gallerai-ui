import { create } from "zustand";
import { persist } from "zustand/middleware";
import { registerTokenAccessor, type User } from "@/lib/api";

interface AuthState {
  user:    User | null;
  token:   string | null;
  isReady: boolean;

  setAuth:   (user: User, token: string) => void;
  setToken:  (token: string) => void;
  setUser:   (user: User) => void;
  clearAuth: () => void;
  setReady:  () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:    null,
      token:   null,
      isReady: false,

      setAuth:   (user, token) => set({ user, token }),
      setToken:  (token)       => set({ token }),
      setUser:   (user)        => set({ user }),
      clearAuth: ()            => set({ user: null, token: null }),
      setReady:  ()            => set({ isReady: true }),
    }),
    {
      name:       "gallerai-auth",
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => {
        state?.setReady();
      },
    },
  ),
);

registerTokenAccessor(() => useAuthStore.getState().token);

export const getToken = () => useAuthStore.getState().token;
export const getUser  = () => useAuthStore.getState().user;
