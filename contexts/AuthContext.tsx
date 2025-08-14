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
  hasPassword: boolean;
  description?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  initialized: boolean;
  login: (newToken: string, redirectPath?: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void; // Novo método
}

const decodeToken = (token: string): AuthUser => {
  const decoded = jwtDecode<AuthUser>(token);
  return {
    ...decoded,
    name: decoded.name || "",
    slug: decoded.slug || "",
    role: decoded.role || "",
    email: decoded.email || "",
    profileImage: decoded.profileImage || "",
    hasPassword: decoded.hasPassword,
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setTokenCookie(token: string) {
  const maxAge = 30 * 24 * 60 * 60; // 30 dias
  document.cookie = `gamo_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
}

function removeTokenCookie() {
  document.cookie = `gamo_token=; path=/; max-age=0; SameSite=Lax; secure`;
}

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
        setUser(decodeToken(stored));
      } catch {
        localStorage.removeItem("gamo_token");
        setToken(null);
        setUser(null);
      }
    }
    setInitialized(true);
  }, []);

  // Função para login: grava token em localStorage e atualiza estado imediatamente
  function login(newToken: string, redirectPath?: string) {
    localStorage.setItem("gamo_token", newToken);
    setTokenCookie(newToken);
    setToken(newToken);
    try {
      setUser(decodeToken(newToken));
      router.push(redirectPath || `/${locale}/account`);
    } catch {
      setUser(null);
    }
  }

  // Função para logout: limpa token e usuário, e redireciona para login
  function logout() {
    localStorage.removeItem("gamo_token");
    removeTokenCookie();

    setToken(null);
    setUser(null);
    router.push(`/${locale}/login`);
  }

  // Função para atualizar os dados do usuário no contexto
  function updateUser(userData: Partial<AuthUser>) {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...userData };
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        initialized,
        login,
        logout,
        updateUser,
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
