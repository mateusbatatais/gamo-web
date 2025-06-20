"use client";

// hooks/useConsoleDetails.ts
import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";

interface ConsoleVariantDetail {
  id: number;
  slug: string;
  brand: { id: number; slug: string };
  generation?: number | null;
  type: string | null;
  releaseDate: string | null;
  name: string;
  consoleName: string;
  consoleDescription: string | null;
  imageUrl: string | null;
  launchDate: string | null;
  storage: string | null;
  skins: SkinDetail[];
}

interface SkinDetail {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  editionName: string | null;
  releaseDate: string | null;
  limitedEdition: boolean | null;
  material: string | null;
  finish: string | null;
  imageUrl: string | null;
}

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
