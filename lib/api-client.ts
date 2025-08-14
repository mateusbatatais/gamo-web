"use client";

import { useAuth } from "@/contexts/AuthContext";

export function useApiClient() {
  const { token } = useAuth();

  const apiFetch = async <T>(
    path: string,
    opts?: {
      method?: string;
      body?: unknown;
      headers?: Record<string, string>;
    },
  ): Promise<T> => {
    const { method = "GET", body, headers: customHeaders = {} } = opts || {};
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${path}`, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
      mode: "cors",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      const code = data.code;
      const rawMessage = data.message;
      const fallback = `Erro na API (${res.status})`;
      const err = new Error(rawMessage || fallback);
      Object.assign(err, { code: code || undefined });
      throw err;
    }

    return data as T;
  };

  return { apiFetch };
}
