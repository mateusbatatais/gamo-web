// app/[locale]/user/[slug]/layout.tsx
import { ReactNode } from "react";
import { PublicProfileHeader } from "@/components/organisms/PublicProfile/PublicProfileHeader/PublicProfileHeader";
import { getPublicProfile } from "@/lib/api/publicProfile";
import { ProfileStats } from "@/components/organisms/PublicProfile/ProfileStats/ProfileStats";
import { ProfileNavigation } from "@/components/organisms/PublicProfile/ProfileNavigation/ProfileNavigation";
import { notFound } from "next/navigation";
import { ProfileBio } from "@/components/organisms/PublicProfile/ProfileBio/ProfileBio";
import { FavoriteItem } from "@/components/organisms/PublicProfile/FavoriteItem/FavoriteItem";
import { FavoriteGames } from "@/components/organisms/PublicProfile/FavoriteGames/FavoriteGames";
import { getTranslations } from "next-intl/server";

interface PublicProfileLayoutProps {
  children: ReactNode;
  params: {
    slug: string;
    locale: string;
  };
}

export default async function PublicProfileLayout({ children, params }: PublicProfileLayoutProps) {
  const { slug, locale } = await params;

  try {
    const profile = await getPublicProfile(slug, locale);

    // Dados mockados para demonstração
    const stats = {
      totalGames: 1319,
      playedThisYear: 50,
      backlog: 196,
      achievements: 324,
    };

    const favoriteGames = [
      { title: "The Witcher 3: Wild Hunt", rating: 5 },
      { title: "Red Dead Redemption 2", rating: 5 },
      { title: "Portal 2", rating: 5 },
      { title: "Half-Life 2", rating: 5 },
      { title: "Dark Souls", rating: 5 },
    ];

    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PublicProfileHeader profile={profile} />

        <div className="mt-6 mb-8">
          <ProfileStats stats={stats} />
        </div>
        <span className="hidden md:block">
          <ProfileNavigation slug={slug} />
        </span>

        <div className="flex flex-col lg:flex-row gap-8 mt-6">
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
          <span className="md:hidden">
            <ProfileNavigation slug={slug} />
          </span>
          <div className="w-full lg:w-3/4">{children}</div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching public profile data:", error);
    notFound();
  }
}

export async function generateMetadata({ params }: PublicProfileLayoutProps) {
  const { slug, locale } = await params;

  try {
    const profile = await getPublicProfile(slug, locale);
    const t = await getTranslations({ locale, namespace: "common" });

    const userPhoto = profile.profileImage;
    const userName = profile.name || slug;

    return {
      title: `${userName} - ${t("siteName")}`,
      description: profile.description || t("siteDescription"),
      openGraph: {
        title: `${userName} - ${t("siteName")}`,
        description: profile.description || t("siteDescription"),
        url: `https://gamo.games/${locale}/user/${slug}`,
        images: [
          {
            url: userPhoto,
            width: 800,
            height: 600,
            alt: `Foto de perfil de ${userName}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${userName} - ${t("siteName")}`,
        description: profile.description || t("siteDescription"),
        images: userPhoto,
      },
    };
  } catch {
    return {
      title: "Perfil de Usuário",
      description: "Perfil de usuário na plataforma Gamo Games",
    };
  }
}
