import { AuthSession } from "@/lib/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthHeader } from "@/utils/api";
import { logout } from "@/actions/logout";

interface UserStore {
  user: AuthSession | null;
  token: string | null;
  setUser: (user: AuthSession | null) => void;
  setToken: (token: string | null) => void;
  setAuth: (user: AuthSession | null, token: string | null) => void;
  clearAuth: () => void;
}

const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user: AuthSession | null) => set({ user }),

      setToken: (token: string | null) => {
        set({ token });
        // Otomatis set ke axios header
        setAuthHeader(token);
      },

      setAuth: (user: AuthSession | null, token: string | null) => {
        set({ user, token });
        // Otomatis set ke axios header
        setAuthHeader(token);
      },

      clearAuth: () => {
        set({ user: null, token: null });
        setAuthHeader(null);
        logout();
      },
    }),
    {
      name: "user-auth",
      // Persist both user and token
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useUser;
