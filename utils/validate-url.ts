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
