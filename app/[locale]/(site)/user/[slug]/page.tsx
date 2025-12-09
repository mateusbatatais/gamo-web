// app/[locale]/user/[slug]/page.tsx
import { getServerSession } from "@/lib/auth";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { PublicProfileConsoleGrid } from "@/components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid";
import { PlayingNowSection } from "@/components/organisms/PublicProfile/PlayingNow/PlayingNowSection";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug, locale } = await params;
  const session = await getServerSession();
  const isOwner = session?.slug === slug;

  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <PlayingNowSection slug={slug} isOwner={isOwner} />
      <PublicProfileConsoleGrid slug={slug} locale={locale} isOwner={isOwner} />
    </Suspense>
  );
}
