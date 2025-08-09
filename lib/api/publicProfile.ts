// lib/api/publicProfile.ts
import { PublicUserProfile, UserConsolePublic, UserGamePublic } from "@/@types/publicProfile";
import { apiFetch } from "@/utils/api";

export const getPublicProfile = async (slug: string, locale: string) => {
  return apiFetch<PublicUserProfile>(`/public/profile/${slug}?locale=${locale}`);
};

export const getUserConsolesPublic = async (slug: string, locale: string) => {
  return apiFetch<UserConsolePublic[]>(`/public/profile/${slug}/consoles?locale=${locale}`);
};

export const getUserGamesPublic = async (slug: string, locale: string) => {
  return apiFetch<UserGamePublic[]>(`/public/profile/${slug}/games?locale=${locale}`);
};
