// lib/api/publicProfile.ts
import { PublicUserProfile, UserConsolePublic } from "@/@types/publicProfile";
import { apiFetch } from "@/utils/api";

export const getPublicProfile = async (slug: string, locale: string) => {
  return apiFetch<PublicUserProfile>(`/public/profile/${slug}?locale=${locale}`);
};

export const getUserConsolesPublic = async (slug: string, locale: string) => {
  return apiFetch<UserConsolePublic[]>(`/public/profile/${slug}/consoles?locale=${locale}`);
};
