"use client";

// hooks/useConsoleDetails.ts
import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";
import { ConsoleVariantDetail } from "@/@types/console";

export default function useConsoleDetails(slug: string, locale: string) {
  const [data, setData] = useState<ConsoleVariantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiFetch<ConsoleVariantDetail>(`/consoles/${slug}?locale=${locale}`);
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, locale]);

  return { data, loading, error };
}
