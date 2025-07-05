// app/[locale]/user/[slug]/page.tsx
import { notFound } from "next/navigation";
import { PublicProfileConsoleGrid } from "@/components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid";
import { PublicProfileHeader } from "@/components/organisms/PublicProfile/PublicProfileHeader/PublicProfileHeader";
import { getPublicProfile, getUserConsolesPublic } from "@/lib/api/publicProfile";
import { ProfileStats } from "@/components/organisms/PublicProfile/ProfileStats/ProfileStats";
import { ProfileNavigation } from "@/components/organisms/PublicProfile/ProfileNavigation/ProfileNavigation";
import { ProfileBio } from "@/components/organisms/PublicProfile/ProfileBio/ProfileBio";
import { ProfileRecentlyPlayed } from "@/components/organisms/PublicProfile/ProfileRecentlyPlayed/ProfileRecentlyPlayed";
import { ProfileReviews } from "@/components/organisms/PublicProfile/ProfileReviews/ProfileReviews";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { FavoriteGames } from "@/components/organisms/PublicProfile/FavoriteGames/FavoriteGames";
import { FavoriteItem } from "@/components/organisms/PublicProfile/FavoriteItem/FavoriteItem";

interface PublicProfilePageProps {
  params: {
    slug: string;
    locale: string;
  };
  searchParams?: {
    section?: string;
  };
}

export default async function PublicProfilePage({ params, searchParams }: PublicProfilePageProps) {
  const { slug, locale } = params;
  const activeSection = searchParams?.section || "collection";

  try {
    const [profile, consoles] = await Promise.all([
      getPublicProfile(slug, locale),
      getUserConsolesPublic(slug, locale),
    ]);

    // Dados mockados para demonstração
    const stats = {
      totalGames: 1319,
      playedThisYear: 50,
      backlog: 196,
      achievements: 324,
    };

    const recentlyPlayed = [
      { title: "The Last of Us Part II", platform: "PS5", date: "Jun 04", hours: 12 },
      { title: "Cyberpunk 2077", platform: "PC", date: "Jun 03", hours: 28 },
      { title: "Elden Ring", platform: "Xbox Series X", date: "Jun 03", hours: 45 },
      { title: "Hollow Knight", platform: "Switch", date: "Jun 01", hours: 15 },
      { title: "God of War Ragnarök", platform: "PS5", date: "May 26", hours: 22 },
    ];

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

    const favoriteGames = [
      { title: "The Witcher 3: Wild Hunt", rating: 5 },
      { title: "Red Dead Redemption 2", rating: 5 },
      { title: "Portal 2", rating: 5 },
      { title: "Half-Life 2", rating: 5 },
      { title: "Dark Souls", rating: 5 },
    ];

    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Cabeçalho */}
        <PublicProfileHeader profile={profile} />

        {/* Estatísticas */}
        <div className="mt-6 mb-8">
          <ProfileStats stats={stats} />
        </div>

        {/* Conteúdo principal com layout flexível */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar esquerda */}
          <div className="w-full lg:w-1/4 space-y-6">
            <ProfileBio bio={profile.description || ""} />

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Favoritos</h3>
              <div className="space-y-3">
                <FavoriteItem title="Série favorita" value="The Legend of Zelda" icon="🎮" />
                <FavoriteItem title="Gênero favorito" value="RPG de Ação" icon="⚔️" />
                <FavoriteItem title="Plataforma favorita" value="Nintendo Switch" icon="🎮" />
              </div>
            </div>

            <FavoriteGames games={favoriteGames} />
          </div>

          {/* Conteúdo principal */}
          <div className="w-full lg:w-3/4">
            <ProfileNavigation activeSection={activeSection} />

            <Suspense fallback={<ProfileSkeleton />}>
              <div className="mt-6">
                {activeSection === "collection" && <PublicProfileConsoleGrid consoles={consoles} />}

                {activeSection === "activity" && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <ProfileRecentlyPlayed items={recentlyPlayed} />
                    <ProfileReviews reviews={reviews} />
                  </div>
                )}

                {activeSection === "reviews" && <ProfileReviews reviews={reviews} />}

                {activeSection === "games" && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Games list coming soon
                    </p>
                  </div>
                )}
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching public profile data:", error);
    notFound();
  }
}

const ProfileSkeleton = () => (
  <div className="mt-6 space-y-4">
    <Skeleton className="h-32 w-full rounded-xl" />
    <Skeleton className="h-32 w-full rounded-xl" />
    <Skeleton className="h-32 w-full rounded-xl" />
  </div>
);
