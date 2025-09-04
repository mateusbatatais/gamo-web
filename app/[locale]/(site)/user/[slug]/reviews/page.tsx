// app/[locale]/user/[slug]/reviews/page.tsx
import { ProfileReviews } from "@/components/organisms/PublicProfile/ProfileReviews/ProfileReviews";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

export default async function ReviewsPage() {
  // Dados mockados - substituir por chamada à API
  const reviews = [
    {
      title: "Dungeon of the Endless",
      platform: "Windows PC",
      status: "Abandoned",
      content:
        "Apesar da minha falta de apreço especial por roguelikes, sempre experimento pra saber qual é, vai que, apesar de não ter geralmente a paciência pra tentar diversas runs até conseguir. Dungeon of the Endless é um competente representante do gênero que mais parece uma versão bem adaptada de um jogo de tabuleiro com elementos de estratégia e RPG, algo que poderia ser bem similar à...",
      rating: 3,
      date: "Jun 15, 2025",
    },
  ];

  return (
    <>
      <div className="p-4 border-b dark:border-gray-700 mb-4">
        <h2 className="text-xl font-bold dark:text-white">Reviews Recentes</h2>
      </div>
      <div>
        <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
          <ProfileReviews reviews={reviews} />
        </Suspense>
      </div>
    </>
  );
}
