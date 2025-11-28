"use client";

import React from "react";
import { Card } from "@/components/atoms/Card/Card";
import { UserConsole } from "@/@types/collection.types";
import { PublicProfileGameCard } from "../PublicProfileGameCard/PublicProfileGameCard";
import { PublicProfileGameCompact } from "../PublicProfileGameCard/PublicProfileGameCompact";
import { PublicProfileGameList } from "../PublicProfileGameCard/PublicProfileGameList";
import { PublicProfileGameTable } from "../PublicProfileGameCard/PublicProfileGameTable";

function hasGames(item: UserConsole): boolean {
  return Array.isArray(item.games) && item.games.length > 0;
}

function RenderGamesTitle({ item }: { item?: UserConsole }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold dark:text-white">
        Jogos
        {item?.consoleName && (
          <span className="ml-2 font-normal text-gray-500 dark:text-gray-400">
            — {item.consoleName}
          </span>
        )}
      </h3>
    </div>
  );
}

export function ConsoleGames({
  item,

  isOwner = false,
  columnIndex,
  totalColumns,
  userSlug,
}: {
  item?: UserConsole;
  sale?: boolean;
  isOwner?: boolean;
  columnIndex?: number;
  totalColumns?: number;
  userSlug?: string;
}) {
  if (!item || !hasGames(item)) {
    return (
      <Card>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Nenhum jogo cadastrado para este console.
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Seta visual */}
      {typeof columnIndex === "number" && typeof totalColumns === "number" && (
        <div
          className="absolute -top-2 w-4 h-4 bg-white dark:bg-gray-800 border-t-2 border-l-2 border-primary-500 dark:border-primary-500 transform rotate-45 z-10"
          style={{
            left: `calc((100% / ${totalColumns}) * ${columnIndex} + (100% / ${totalColumns}) / 2 - 8px)`,
          }}
        />
      )}
      <Card className="border-2 border-primary-500 dark:border-primary-500 relative z-0">
        <RenderGamesTitle item={item} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {item.games?.map((game) => (
            <PublicProfileGameCard key={game.id} game={game} isOwner={isOwner} />
          ))}
        </div>
        {item.totalGames && item.totalGames > 10 && (
          <div className="mt-4 text-center">
            <a
              href={`/user/${userSlug}/console/${item.id}`}
              className="inline-block px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Ver todos ({item.totalGames})
            </a>
          </div>
        )}
      </Card>
    </div>
  );
}

export function ConsoleGamesCompact({
  item,

  isOwner = false,
  columnIndex,
  totalColumns,
  userSlug,
}: {
  item?: UserConsole;
  sale?: boolean;
  isOwner?: boolean;
  columnIndex?: number;
  totalColumns?: number;
  userSlug?: string;
}) {
  if (!item || !hasGames(item)) {
    return null;
  }

  return (
    <div className="relative">
      {/* Seta visual */}
      {typeof columnIndex === "number" && typeof totalColumns === "number" && (
        <div
          className="absolute -top-2 w-4 h-4 bg-white dark:bg-gray-800 border-t-2 border-l-2 border-primary-500 dark:border-primary-500 transform rotate-45 z-10"
          style={{
            left: `calc((100% / ${totalColumns}) * ${columnIndex} + (100% / ${totalColumns}) / 2 - 8px)`,
          }}
        />
      )}
      <Card className="border-2 border-primary-500 dark:border-primary-500 relative z-0">
        <RenderGamesTitle item={item} />
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {item.games?.map((game) => (
            <PublicProfileGameCompact key={game.id} game={game} isOwner={isOwner} />
          ))}
        </div>
        {item.totalGames && item.totalGames > 10 && (
          <div className="mt-4 text-center">
            <a
              href={`/user/${userSlug}/console/${item.id}`}
              className="inline-block px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Ver todos ({item.totalGames})
            </a>
          </div>
        )}
      </Card>
    </div>
  );
}

export function ConsoleGamesList({
  item,

  isOwner = false,
  userSlug,
}: {
  item?: UserConsole;
  sale?: boolean;
  isOwner?: boolean;
  userSlug?: string;
}) {
  if (!item || !hasGames(item)) {
    return null;
  }

  return (
    <div className="relative">
      <Card className="border-2 border-primary-500 dark:border-primary-500 relative z-0">
        <RenderGamesTitle item={item} />
        <div className="space-y-3">
          {item.games?.map((game) => (
            <PublicProfileGameList key={game.id} game={game} isOwner={isOwner} />
          ))}
        </div>
        {item.totalGames && item.totalGames > 10 && (
          <div className="mt-4 text-center">
            <a
              href={`/user/${userSlug}/console/${item.id}`}
              className="inline-block px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Ver todos ({item.totalGames})
            </a>
          </div>
        )}
      </Card>
    </div>
  );
}

export function ConsoleGamesTable({
  item,

  isOwner = false,
  userSlug,
}: {
  item?: UserConsole;
  sale?: boolean;
  isOwner?: boolean;
  userSlug?: string;
}) {
  if (!item || !hasGames(item)) {
    return null;
  }

  return (
    <div className="relative">
      <Card className="border-2 border-primary-500 dark:border-primary-500 relative z-0 p-0">
        <div className="p-4">
          <RenderGamesTitle item={item} />
        </div>
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
              {item.games?.map((game) => (
                <PublicProfileGameTable key={game.id} game={game} isOwner={isOwner} />
              ))}
            </tbody>
          </table>
        </div>
        {item.totalGames && item.totalGames > 10 && (
          <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
            <a
              href={`/user/${userSlug}/console/${item.id}`}
              className="inline-block px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Ver todos ({item.totalGames})
            </a>
          </div>
        )}
      </Card>
    </div>
  );
}
