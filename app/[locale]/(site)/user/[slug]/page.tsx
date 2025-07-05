// app/[locale]/user/[slug]/page.tsx
import { getUserConsolesPublic } from "@/lib/api/publicProfile";
import { PublicProfileConsoleGrid } from "@/components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug, locale } = await params;
  const consoles = await getUserConsolesPublic(slug, locale);

  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <PublicProfileConsoleGrid consoles={consoles} />
    </Suspense>
  );
}
