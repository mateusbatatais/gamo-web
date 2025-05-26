// contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode"; // <- IMPORT CORRETO
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

interface AuthUser {
  userId: number;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  initialized: boolean; // novo
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [user, setUser] = useState<AuthUser | null>(null);
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("gamo_token");
    if (stored) {
      setToken(stored);
      setUser(jwtDecode<AuthUser>(stored));
    } else {
      setToken(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("gamo_token");
    setToken(null);
    setUser(null);
    router.push(`/${locale}/login`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: token ?? null,
        initialized: token !== undefined,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
