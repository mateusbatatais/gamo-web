"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { PublicUserProfile, UserConsolePublic } from "@/@types/publicProfile";

interface PublicProfileData {
  profile: PublicUserProfile | null;
  consoles: UserConsolePublic[];
  loading: boolean;
  error: string | null;
}

export default function usePublicProfile(slug: string, locale: string) {
  const [state, setState] = useState<PublicProfileData>({
    profile: null,
    consoles: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const [profile, consoles] = await Promise.all([
          apiFetch<PublicUserProfile>(`/public/profile/${slug}?locale=${locale}`),
          apiFetch<UserConsolePublic[]>(`/public/profile/${slug}/consoles?locale=${locale}`),
        ]);

        setState({
          profile,
          consoles,
          loading: false,
          error: null,
        });
      } catch {
        setState({
          profile: null,
          consoles: [],
          loading: false,
          error: "Failed to load profile data",
        });
      }
    };

    fetchData();
  }, [slug, locale]);

  return state;
}
