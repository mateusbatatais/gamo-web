// src/lib/api-client.ts
"use client";

import { useAuth } from "@/contexts/AuthContext";

export interface ApiFetchOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string | null;
}

export function useApiClient() {
  const { token } = useAuth();

  const apiFetch = async <T>(path: string, opts?: ApiFetchOptions): Promise<T> => {
    const { method = "GET", body, headers: customHeaders = {}, token: customToken } = opts || {};

    // Headers básicos (sem Content-Type por padrão)
    const headers: Record<string, string> = {
      ...customHeaders,
    };

    // Usamos o token customizado se fornecido, caso contrário usamos o token do contexto
    const authToken = customToken ?? token;
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    // Determina se o body é FormData
    const isFormData = body instanceof FormData;

    // Se não for FormData, adiciona Content-Type JSON
    if (!isFormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    // Prepara o corpo da requisição
    let requestBody: BodyInit | null = null;
    if (body != null) {
      requestBody = isFormData ? (body as FormData) : JSON.stringify(body);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${path}`, {
      method,
      headers,
      body: requestBody,
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
