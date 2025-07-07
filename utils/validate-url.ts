// utils/validate-url.ts
export function isValidUrl(url: string | null | undefined): url is string {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export const normalizeImageUrl = (url: string) => {
  if (!url) return "/default-console.webp";

  // Remove barras duplas no início
  if (url.startsWith("//")) {
    return url.slice(1);
  }

  // Garante que comece com uma barra
  if (!url.startsWith("/")) {
    return `/${url}`;
  }

  return url;
};
