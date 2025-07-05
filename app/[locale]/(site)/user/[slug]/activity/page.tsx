// app/[locale]/user/[slug]/page.tsx
import { getUserConsolesPublic } from "@/lib/api/publicProfile";
import { PublicProfileConsoleGrid } from "@/components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { Card } from "@/components/atoms/Card/Card";

interface CollectionPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

// Gerar parâmetros estáticos
export async function generateStaticParams() {
  // Em produção, você buscaria slugs reais da API
  return [{ slug: "example", locale: "pt" }];
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug, locale } = params;
  const consoles = await getUserConsolesPublic(slug, locale);

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold dark:text-white">Coleção de Consoles</h2>
      </div>
      <div className="p-4">
        <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
          <PublicProfileConsoleGrid consoles={consoles} />
        </Suspense>
      </div>
    </Card>
  );
}
