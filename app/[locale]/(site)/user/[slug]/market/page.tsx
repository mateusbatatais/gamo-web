// app/[locale]/user/[slug]/market/page.tsx
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { getServerSession } from "@/lib/auth";
import { PublicProfileMarketGrid } from "@/components/organisms/PublicProfile/PublicProfileMarketGrid/PublicProfileMarketGrid";

interface MarketPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function MarketPage({ params }: MarketPageProps) {
  const { slug, locale } = await params;
  const session = await getServerSession();
  const isOwner = session?.slug === slug;

  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <PublicProfileMarketGrid slug={slug} locale={locale} isOwner={isOwner} />
    </Suspense>
  );
}
