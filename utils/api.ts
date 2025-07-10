// utils/api.ts
export async function apiFetch<T>(
  path: string,
  opts?: {
    token?: string | null;
    method?: string;
    body?: unknown;
  },
): Promise<T> {
  const { token, method = "GET", body } = opts || {};
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
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
    console.log("ee");
    const code = data.code;
    const rawMessage = data.message;
    const fallback = `Erro na API (${res.status})`;
    const err = new Error(rawMessage || fallback);
    // @ts-expect-error — adicionamos dinamicamente a prop "code"
    err.code = code || undefined;
    throw err;
  }

  return data as T;
}
