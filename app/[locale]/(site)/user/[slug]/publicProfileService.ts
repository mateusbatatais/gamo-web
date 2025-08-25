// src/services/publicProfileService.ts

import { PublicUserProfile } from "@/@types/auth.types";

export async function fetchPublicProfile(slug: string, locale: string): Promise<PublicUserProfile> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/public/profile/${slug}?locale=${locale}`,
    {
      next: { tags: [`profile-${slug}`] },
    },
  );

  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}
