const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchApiServer<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return res.json();
}
