// components/organisms/PublicProfile/sections/GamesStandaloneSection.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { UserGame } from "@/@types/collection.types";
import { ViewMode } from "@/@types/catalog-state.types";
import { PublicProfileGameTable } from "../PublicProfileGameCard/PublicProfileGameTable";
import { PublicProfileGameList } from "../PublicProfileGameCard/PublicProfileGameList";
import { PublicProfileGameCompact } from "../PublicProfileGameCard/PublicProfileGameCompact";
import { PublicProfileGameCard } from "../PublicProfileGameCard/PublicProfileGameCard";
import { EmptyCard } from "../EmptyCard/EmptyCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { Select } from "@/components/atoms/Select/Select";
import { Card } from "@/components/atoms/Card/Card";
import { SortOption } from "@/@types/catalog-state.types";

interface GamesStandaloneSectionProps {
  games: UserGame[];
  gamesMeta?: {
    totalPages: number;
    total?: number;
  };
  isOwner: boolean | undefined;
  viewMode: ViewMode;
  gamesPage: number;
  gamesPerPage: number;
  gamesSort: string;
  onGamesPageChange: (page: number) => void;
  onGamesPerPageChange: (perPage: number) => void;
  onGamesSortChange: (sort: string) => void;
  sortOptions: SortOption[];
  perPageOptions: { value: string; label: string }[];
  title: string;
  emptyMessage: string;
  addButtonText: string;
  addButtonLink: string;
}

export const GamesStandaloneSection: React.FC<GamesStandaloneSectionProps> = ({
  games,
  gamesMeta,
  isOwner,
  viewMode,
  gamesPage,
  gamesPerPage,
  gamesSort,
  onGamesPageChange,
  onGamesPerPageChange,
  onGamesSortChange,
  sortOptions,
  perPageOptions,
  title,
  emptyMessage,
  addButtonText,
  addButtonLink,
}) => {
  const t = useTranslations("PublicProfile");

  // Se não há jogos e não é o dono, não renderiza nada
  if (games.length === 0 && !isOwner) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">{title}</h2>

        <div className="flex items-center gap-4">
          <SortSelect
            options={sortOptions}
            value={gamesSort}
            onChange={onGamesSortChange}
            className="w-40"
          />

          {gamesMeta?.total !== undefined && gamesMeta.total > 20 && (
            <Select
              options={perPageOptions}
              value={gamesPerPage.toString()}
              onChange={(e) => onGamesPerPageChange(Number(e.target.value))}
              className="w-20"
              size="sm"
            />
          )}
        </div>
      </div>

      {games.length === 0 ? (
        <Card>
          <div className="py-12">
            <p className="text-center text-gray-500 dark:text-gray-400 mb-4">{emptyMessage}</p>
            {isOwner && (
              <EmptyCard
                text={t("txtGame")}
                buttonLabel={addButtonText}
                buttonLink={addButtonLink}
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
                <th className="p-2 text-left">Progresso</th>
                <th className="p-2 text-left">Mídia</th>
                {isOwner && <th className="p-2 text-left">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {isOwner && (
                <tr>
                  <td colSpan={5}>
                    <EmptyCard
                      text={t("txtGame")}
                      buttonLabel={addButtonText}
                      buttonLink={addButtonLink}
                      viewMode="table"
                    />
                  </td>
                </tr>
              )}
              {games.map((game) => (
                <PublicProfileGameTable key={game.id} game={game} isOwner={isOwner} />
              ))}
            </tbody>
          </table>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {isOwner && (
            <EmptyCard
              text={t("txtGame")}
              buttonLabel={addButtonText}
              buttonLink={addButtonLink}
              viewMode="list"
            />
          )}
          {games.map((game) => (
            <PublicProfileGameList key={game.id} game={game} isOwner={isOwner} />
          ))}
        </div>
      ) : viewMode === "compact" ? (
        <div className="flex flex-wrap gap-3">
          {isOwner && (
            <div className="box-border min-w-0 flex-[0_0_calc(33.333%-.5rem)] md:flex-[0_0_calc(25%-.5625rem)] lg:flex-[0_0_calc(16.666%-.625rem)] xl:flex-[0_0_calc(12.5%-.65625rem)]">
              <EmptyCard
                text={t("txtGame")}
                buttonLabel={addButtonText}
                buttonLink={addButtonLink}
                viewMode="compact"
              />
            </div>
          )}
          {games.map((game) => (
            <div
              key={game.id}
              className="
                box-border min-w-0
                flex-[0_0_calc(33.333%-.5rem)]
                md:flex-[0_0_calc(25%-.5625rem)]
                lg:flex-[0_0_calc(16.666%-.625rem)]
                xl:flex-[0_0_calc(12.5%-.65625rem)]
              "
            >
              <PublicProfileGameCompact game={game} isOwner={isOwner} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isOwner && (
            <EmptyCard
              text={t("txtGame")}
              buttonLabel={addButtonText}
              buttonLink={addButtonLink}
              viewMode="card"
            />
          )}
          {games.map((game) => (
            <PublicProfileGameCard key={game.id} game={game} isOwner={isOwner} />
          ))}
        </div>
      )}

      {gamesMeta && gamesMeta.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={gamesPage}
            totalPages={gamesMeta.totalPages}
            onPageChange={onGamesPageChange}
          />
        </div>
      )}
    </div>
  );
};
