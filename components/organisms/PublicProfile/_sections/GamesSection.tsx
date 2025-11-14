// components/organisms/PublicProfile/sections/GamesSection.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { UserGame } from "@/@types/collection.types";
import { ViewMode } from "@/@types/catalog-state.types";
import { PublicProfileGameCard } from "../PublicProfileGameCard/PublicProfileGameCard";
import { PublicProfileGameList } from "../PublicProfileGameCard/PublicProfileGameList";
import { PublicProfileGameTable } from "../PublicProfileGameCard/PublicProfileGameTable";
import { PublicProfileGameCompact } from "../PublicProfileGameCard/PublicProfileGameCompact";
import { EmptyCard } from "../EmptyCard/EmptyCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { Button } from "@/components/atoms/Button/Button";
import { Settings2 } from "lucide-react";
import { Card } from "@/components/atoms/Card/Card";

interface GamesSectionProps {
  games: UserGame[];
  gamesMeta?: {
    totalPages: number;
  };
  isOwner: boolean | undefined;
  type: string;
  viewMode: ViewMode;
  currentPage: number;
  onPageChange: (page: number) => void;
  onFilterOpen: () => void;
}

export const GamesSection: React.FC<GamesSectionProps> = ({
  games,
  gamesMeta,
  isOwner,
  type,
  viewMode,
  currentPage,
  onPageChange,
  onFilterOpen,
}) => {
  const t = useTranslations("PublicProfile");

  // Se não há games e não é o dono, não renderiza nada
  if (games.length === 0 && !isOwner) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">
          {type === "selling" ? t("gamesForSale") : t("gamesLookingFor")}
        </h2>
        <Button variant="outline" size="sm" onClick={onFilterOpen} icon={<Settings2 size={16} />} />
      </div>

      {games.length === 0 ? (
        <Card>
          <div className="py-12">
            <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
              {type === "selling" ? t("noGamesForSale") : t("noGamesLookingFor")}
            </p>
            {isOwner && (
              <EmptyCard
                text={t("txtGame")}
                buttonLabel={type === "selling" ? t("txtSellGame") : t("txtLookForGame")}
                buttonLink="/user/collection/games/add/"
                viewMode="list"
              />
            )}
          </div>
        </Card>
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="p-2 text-left">Jogo</th>
                <th className="p-2 text-left">Plataforma</th>
                <th className="p-2 text-left">Preço</th>
                <th className="p-2 text-left">Condição</th>
                <th className="p-2 text-left">Aceita Troca</th>
                <th className="p-2 text-left">Mídia</th>
                {isOwner && <th className="p-2 text-left">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {isOwner && (
                <tr>
                  <td colSpan={6 + (isOwner ? 1 : 0)}>
                    <EmptyCard
                      text={t("txtGame")}
                      buttonLabel={type === "selling" ? t("txtSellGame") : t("txtLookForGame")}
                      buttonLink="/user/collection/games/add/"
                      viewMode="table"
                      space={false}
                    />
                  </td>
                </tr>
              )}
              {games.map((game) => (
                <PublicProfileGameTable
                  type="trade"
                  key={`game-${game.id}`}
                  game={game}
                  isOwner={isOwner}
                  isMarketGrid={true}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {isOwner && (
            <EmptyCard
              text={t("txtGame")}
              buttonLabel={type === "selling" ? t("txtSellGame") : t("txtLookForGame")}
              buttonLink="/user/collection/games/add/"
              viewMode="list"
            />
          )}
          {games.map((game) => (
            <PublicProfileGameList key={game.id} game={game} isOwner={isOwner} type="trade" />
          ))}
        </div>
      ) : (
        <div
          className={`grid ${
            viewMode === "grid"
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
          } gap-6`}
        >
          {isOwner && (
            <EmptyCard
              text={t("txtGame")}
              buttonLabel={type === "selling" ? t("txtSellGame") : t("txtLookForGame")}
              buttonLink="/user/collection/games/add/"
              viewMode={viewMode === "grid" ? "card" : "compact"}
            />
          )}
          {games.map((game) =>
            viewMode === "compact" ? (
              <PublicProfileGameCompact key={game.id} game={game} isOwner={isOwner} type="trade" />
            ) : (
              <PublicProfileGameCard key={game.id} game={game} isOwner={isOwner} type="trade" />
            ),
          )}
        </div>
      )}

      {gamesMeta && gamesMeta.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={gamesMeta.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
