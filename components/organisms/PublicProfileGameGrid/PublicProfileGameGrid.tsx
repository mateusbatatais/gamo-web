// components/organisms/PublicProfile/PublicProfileGameGrid/PublicProfileGameGrid.tsx
import React from "react";
import { useTranslations } from "next-intl";
import { UserGamePublic } from "@/@types/publicProfile";
import { PublicProfileGameCard } from "../PublicProfileGameCard/PublicProfileGameCard";
import { Card } from "@/components/atoms/Card/Card";

interface PublicProfileGameGridProps {
  games: UserGamePublic[];
  isOwner?: boolean;
  revalidate: () => Promise<void>;
}

export const PublicProfileGameGrid = ({
  games,
  isOwner = false,
  revalidate,
}: PublicProfileGameGridProps) => {
  const t = useTranslations("PublicProfile");

  if (games.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t("noGames")}</p>
        </div>
      </Card>
    );
  }

  const groupedGames = games.reduce(
    (acc, game) => {
      if (!acc[game.status]) {
        acc[game.status] = [];
      }
      acc[game.status].push(game);
      return acc;
    },
    {} as Record<string, UserGamePublic[]>,
  );

  const ownedGames = groupedGames["OWNED"] || [];
  const sellingGames = groupedGames["SELLING"] || [];
  const lookingForGames = groupedGames["LOOKING_FOR"] || [];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("gamesCollection")}</h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {ownedGames.map((game) => (
          <PublicProfileGameCard
            key={`owned-${game.id}`}
            game={game}
            isOwner={isOwner}
            revalidate={revalidate}
          />
        ))}
      </div>
      {sellingGames.length > 0 && (
        <h2 className="text-xl font-semibold my-6 dark:text-white">{t("status.selling")}</h2>
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {sellingGames.map((game) => (
          <PublicProfileGameCard
            key={`selling-${game.id}`}
            game={game}
            isOwner={isOwner}
            revalidate={revalidate}
          />
        ))}
      </div>
      {lookingForGames.length > 0 && (
        <h2 className="text-xl font-semibold my-6 dark:text-white">{t("status.lookingFor")}</h2>
      )}
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {lookingForGames.map((game) => (
          <PublicProfileGameCard
            key={`lookingfor-${game.id}`}
            game={game}
            isOwner={isOwner}
            revalidate={revalidate}
          />
        ))}
      </div>
    </div>
  );
};
