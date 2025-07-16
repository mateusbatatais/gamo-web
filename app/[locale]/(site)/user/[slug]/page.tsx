// app/[locale]/user/[slug]/page.tsx
import { getUserConsolesPublic } from "@/lib/api/publicProfile";
import { PublicProfileConsoleGrid } from "@/components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { revalidateTag } from "next/cache";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug, locale } = await params;

  const consoles = await getUserConsolesPublic(slug, locale);

  // Função para revalidar os dados
  const revalidate = async () => {
    "use server";
    revalidateTag(`user-consoles-${slug}`);
  };

  // const isOwner = user?.slug === (await params).slug;
  const isOwner = true; // Placeholder, replace with actual logic to determine if the user is the owner
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <PublicProfileConsoleGrid consoles={consoles} isOwner={isOwner} revalidate={revalidate} />
    </Suspense>
  );
}
