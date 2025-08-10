// app/[locale]/user/[slug]/games/page.tsx
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { getServerSession } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { PublicProfileGameGrid } from "@/components/organisms/PublicProfileGameGrid/PublicProfileGameGrid";
import { getUserGamesPublic } from "@/lib/api/publicProfile";

interface GamesPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function GamesPage({ params }: GamesPageProps) {
  const { slug, locale } = await params;

  const games = await getUserGamesPublic(slug, locale);
  const session = await getServerSession();
  const isOwner = session?.slug === slug;

  const revalidate = async () => {
    "use server";
    revalidateTag(`user-games-${slug}`);
  };

  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <PublicProfileGameGrid games={games} isOwner={isOwner} revalidate={revalidate} />
    </Suspense>
  );
}
