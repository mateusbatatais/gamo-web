// app/[locale]/user/[slug]/page.tsx
import { getUserConsolesPublic } from "@/lib/api/publicProfile";
import { PublicProfileConsoleGrid } from "@/components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { revalidateTag } from "next/cache";
import { getServerSession } from "@/lib/auth";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug, locale } = await params;

  const consoles = await getUserConsolesPublic(slug, locale);
  const session = await getServerSession();
  const isOwner = session?.slug === slug;

  const revalidate = async () => {
    "use server";
    revalidateTag(`user-consoles-${slug}`);
  };

  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <PublicProfileConsoleGrid consoles={consoles} isOwner={isOwner} revalidate={revalidate} />
    </Suspense>
  );
}
