// contexts/AuthContext.tsx
"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

interface AuthUser {
  userId: number;
  name: string;
  slug: string;
  role: string;
  email: string;
  profileImage: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  initialized: boolean;
  login: (newToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initialized, setInitialized] = useState(false);
  const locale = useLocale();
  const router = useRouter();

  // Ao montar, verificamos se já existe token em localStorage
  useEffect(() => {
    const stored = localStorage.getItem("gamo_token");
    if (stored) {
      setToken(stored);
      try {
        const decoded = jwtDecode<AuthUser>(stored);
        setUser(decoded);
      } catch {
        // Se o decode falhar, removemos qualquer valor inválido
        localStorage.removeItem("gamo_token");
        setToken(null);
        setUser(null);
      }
    }
    setInitialized(true);
  }, []);

  // Função para login: grava token em localStorage e atualiza estado imediatamente
  function login(newToken: string) {
    localStorage.setItem("gamo_token", newToken);
    setToken(newToken);
    try {
      const decoded = jwtDecode<AuthUser>(newToken);
      setUser(decoded);
    } catch {
      setUser(null);
    }
  }

  // Função para logout: limpa token e usuário, e redireciona para login
  function logout() {
    localStorage.removeItem("gamo_token");
    setToken(null);
    setUser(null);
    router.push(`/${locale}/login`);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        initialized,
        login,
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
