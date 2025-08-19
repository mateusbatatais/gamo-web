// app/[locale]/user/[slug]/games/page.tsx
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { getServerSession } from "@/lib/auth";
import { PublicProfileGameGrid } from "@/components/organisms/PublicProfile/PublicProfileGameGrid/PublicProfileGameGrid";

interface GamesPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function GamesPage({ params }: GamesPageProps) {
  const { slug, locale } = await params;
  const session = await getServerSession();
  const isOwner = session?.slug === slug;

  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <PublicProfileGameGrid slug={slug} locale={locale} isOwner={isOwner} />
    </Suspense>
  );
}
