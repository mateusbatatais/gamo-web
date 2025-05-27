// utils/api.ts
export async function apiFetch<T>(
  path: string,
  opts?: {
    token?: string | null;
    method?: string;
    body?: unknown;
  }
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
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return (await res.json()) as T;
}
