"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearTokens, getAccessToken, saveTokens } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { User } from "@/types/api";

interface RegisterInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  role: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

async function restoreSession(): Promise<{ token: string | null; user: User | null }> {
  const token = getAccessToken();
  if (!token) return { token: null, user: null };
  try {
    return { token, user: await endpoints.me() };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const session = await restoreSession();
    if (!session.user) clearTokens();
    setUser(session.user);
    setAccessToken(session.token);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    void (async () => {
      const session = await restoreSession();
      if (!active) return;
      if (!session.user) clearTokens();
      setUser(session.user);
      setAccessToken(session.token);
      setIsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await endpoints.login({ email, password });
    saveTokens(tokens.access_token, tokens.refresh_token);
    setAccessToken(tokens.access_token);
    const me = await endpoints.me();
    setUser(me);
    setIsLoading(false);
    return me;
  }, []);

  const register = useCallback(
    async (input: RegisterInput) => {
      await endpoints.register({ ...input, role: "OWNER" });
      return login(input.email, input.password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) await endpoints.logout();
    } catch {
      /* Client session is cleared even if the server cannot revoke the token. */
    }
    clearTokens();
    setUser(null);
    setAccessToken(null);
    router.replace("/vehiclehistory/login");
  }, [router]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      role: user?.role ?? null,
      accessToken,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, accessToken, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
