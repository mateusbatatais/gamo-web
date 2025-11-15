// components/organisms/PublicProfile/sections/GameGridSection.tsx
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
import { Card } from "@/components/atoms/Card/Card";

interface GameGridSectionProps {
  games: UserGame[];
  gamesMeta?: {
    totalPages: number;
  };
  isOwner: boolean | undefined;
  viewMode: ViewMode;
  currentPage: number;
  onPageChange: (page: number) => void;
  title: string;
  emptyMessage: string;
  addButtonText: string;
  addButtonLink: string;
}

export const GameGridSection: React.FC<GameGridSectionProps> = ({
  games,
  gamesMeta,
  isOwner,
  viewMode,
  currentPage,
  onPageChange,
  title,
  emptyMessage,
  addButtonText,
  addButtonLink,
}) => {
  const t = useTranslations("PublicProfile");

  return (
    <div>
      {/* Header da Seção */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
      </div>

      {/* Conteúdo */}
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
                isGame={true}
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
                <th className="p-2 text-left">Status</th>
                {isOwner && <th className="p-2 text-left">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {isOwner && (
                <tr>
                  <td colSpan={6 + (isOwner ? 1 : 0)}>
                    <EmptyCard
                      text={t("txtGame")}
                      buttonLabel={addButtonText}
                      buttonLink={addButtonLink}
                      viewMode="table"
                      isGame={true}
                    />
                  </td>
                </tr>
              )}
              {games.map((game: UserGame) => (
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
              isGame={true}
            />
          )}
          {games.map((game: UserGame) => (
            <PublicProfileGameList key={game.id} game={game} isOwner={isOwner} />
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
              buttonLabel={addButtonText}
              buttonLink={addButtonLink}
              viewMode={viewMode === "grid" ? "card" : "compact"}
              isGame={true}
            />
          )}
          {games.map((game: UserGame) =>
            viewMode === "compact" ? (
              <PublicProfileGameCompact key={game.id} game={game} isOwner={isOwner} />
            ) : (
              <PublicProfileGameCard key={game.id} game={game} isOwner={isOwner} />
            ),
          )}
        </div>
      )}

      {/* Paginação */}
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
