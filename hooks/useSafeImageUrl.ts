"use client";

import { isValidUrl, normalizeImageUrl } from "@/utils/validate-url";

export const useSafeImageUrl = () => {
  const getSafeImageUrl = (url: string | null | undefined): string => {
    if (!url) return "";

    if (isValidUrl(url)) {
      return url;
    }

    return normalizeImageUrl(url);
  };

  return { getSafeImageUrl };
};
