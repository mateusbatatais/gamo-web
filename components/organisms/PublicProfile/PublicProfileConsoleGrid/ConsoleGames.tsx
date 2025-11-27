"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/atoms/Card/Card";
import { UserConsole, UserGame } from "@/@types/collection.types";
import { isValidUrl, normalizeImageUrl } from "@/utils/validate-url";
import Link from "next/link";
import { GameActionButtons } from "../GameActionButtons/GameActionButtons";

// Minimal local type to safely access fields we actually render
interface GameLite {
  id: number;
  gameTitle?: string;
  gameSlug?: string;
  gameImageUrl?: string | null;
  price?: number | null;
  condition?: string;
  acceptsTrade?: boolean | null;
  media?: string;
}

function hasGames(item: UserConsole): item is UserConsole & { games: ReadonlyArray<GameLite> } {
  const maybe = item as unknown as { games?: unknown };
  return Array.isArray(maybe.games) && maybe.games.length > 0;
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

// Componente de imagem segura para jogos
function SafeGameImage({
  src,
  alt,
  className = "",
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const [imageError, setImageError] = React.useState(false);
  const [safeSrc, setSafeSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!src) {
      setSafeSrc(null);
      setImageError(false);
      return;
    }

    try {
      if (isValidUrl(src)) {
        setSafeSrc(src);
      } else {
        const normalized = normalizeImageUrl(src);
        setSafeSrc(normalized);
      }
      setImageError(false);
    } catch (error) {
      console.error("Invalid game image URL:", src, error);
      setSafeSrc(null);
      setImageError(true);
    }
  }, [src]);

  if (!safeSrc || imageError) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 ${className}`}
      >
        <span className="text-2xl">🎮</span>
      </div>
    );
  }

  return (
    <Image
      src={safeSrc}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw"
      className="object-cover"
      onError={() => setImageError(true)}
    />
  );
}

function GamesCard({
  game,
  sale = false,
  isOwner = false,
  compact = false,
}: {
  game: GameLite;
  sale?: boolean;
  isOwner?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group relative">
      {isOwner && (
        <div
          className={`absolute top-2 right-2 z-10 ${compact ? "opacity-0 group-hover:opacity-100" : "opacity-100"} transition-opacity`}
        >
          <GameActionButtons
            game={game as UserGame}
            isOwner={isOwner}
            compact={true}
            customClassName="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md p-1"
          />
        </div>
      )}
      <Link href={`/game/${game.gameSlug}`} target="_blank">
        <div className="aspect-3/4 bg-gray-100 dark:bg-gray-700 relative hover:opacity-90 transition-opacity">
          <SafeGameImage
            src={game.gameImageUrl}
            alt={game.gameTitle || "Jogo"}
            className="w-full h-full"
          />
        </div>
      </Link>
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <Link href={`/game/${game.gameSlug}`} target="_blank">
              <p className="font-medium dark:text-white hover:text-primary-500 line-clamp-2">
                {game.gameTitle}
              </p>
            </Link>
            {game.media && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {game.media === "PHYSICAL" ? "Físico" : "Digital"}
              </p>
            )}
          </div>
        </div>
        {/* Informações de venda quando sale=true */}
        {sale && (
          <div className="space-y-1 mt-2">
            {game.price && (
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                R$ {game.price.toFixed(2)}
              </p>
            )}
            {game.condition && (
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {game.condition}
              </p>
            )}
            {game.acceptsTrade && (
              <p className="text-xs text-blue-600 dark:text-blue-400">Aceita troca</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConsoleGames({
  item,
  sale = false,
  isOwner = false,
  columnIndex,
  totalColumns,
}: {
  item?: UserConsole;
  sale?: boolean;
  isOwner?: boolean;
  columnIndex?: number;
  totalColumns?: number;
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
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {item.games.map((game) => (
            <div key={(game as GameLite).id} className="aspect-square">
              <GamesCard game={game as GameLite} sale={sale} isOwner={isOwner} compact={false} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function ConsoleGamesCompact({
  item,
  sale = false,
  isOwner = false,
  columnIndex,
  totalColumns,
}: {
  item?: UserConsole;
  sale?: boolean;
  isOwner?: boolean;
  columnIndex?: number;
  totalColumns?: number;
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
    <div className="relative mt-3">
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
          {item.games.map((game) => (
            <div key={(game as GameLite).id} className="aspect-square">
              <GamesCard game={game as GameLite} sale={sale} isOwner={isOwner} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function ConsoleGamesList({
  item,
  sale = false,
  isOwner = false,
}: {
  item?: UserConsole;
  sale?: boolean;
  isOwner?: boolean;
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
    <div className="relative mt-3">
      {/* Seta visual para lista */}
      <div className="absolute -top-2 left-8 w-4 h-4 bg-white dark:bg-gray-800 border-t-2 border-l-2 border-primary-500 dark:border-primary-500 transform rotate-45 z-10" />
      <Card className="border-2 border-primary-500 dark:border-primary-500 relative z-0">
        <RenderGamesTitle item={item} />
        <div className="space-y-3">
          {item.games.map((game) => {
            const g = game as GameLite;
            return (
              <Card key={g.id} className="p-3!">
                <div className="flex items-center gap-3">
                  <Link href={`/game/${g.gameSlug}`} target="_blank">
                    <div className="w-14 h-20 shrink-0 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative rounded-md overflow-hidden hover:opacity-90 transition-opacity">
                      <SafeGameImage
                        src={g.gameImageUrl}
                        alt={g.gameTitle || "Jogo"}
                        className="w-full h-full"
                      />
                    </div>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/game/${g.gameSlug}`} target="_blank">
                      <p className="font-medium dark:text-white truncate hover:text-primary-500">
                        {g.gameTitle}
                      </p>
                    </Link>
                    {g.media && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {g.media === "PHYSICAL" ? "Físico" : "Digital"}
                      </p>
                    )}
                    {/* Informações de venda quando sale=true */}
                    {sale && (
                      <div className="flex gap-4 mt-1">
                        {g.price && (
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            R$ {g.price.toFixed(2)}
                          </span>
                        )}
                        {g.condition && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {g.condition}
                          </span>
                        )}
                        {g.acceptsTrade && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            Aceita troca
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {isOwner && <GameActionButtons game={g as UserGame} isOwner={isOwner} />}
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export function ConsoleGamesTable({
  item,
  sale = false,
  isOwner = false,
}: {
  item?: UserConsole;
  sale?: boolean;
  isOwner?: boolean;
  locale?: string;
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
    <div className="overflow-x-auto ps-10">
      <table className="w-full">
        <thead>
          <tr className="border-t border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <th className="p-2 text-left">Jogo</th>
            <th className="p-2 text-left">Mídia</th>
            {/* Colunas adicionais para venda */}
            {sale && (
              <>
                <th className="p-2 text-left">Preço</th>
                <th className="p-2 text-left">Condição</th>
                <th className="p-2 text-left">Aceita Troca</th>
              </>
            )}
            {isOwner && <th className="p-2 text-left">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {item.games.map((game) => {
            const g = game as GameLite;
            return (
              <tr key={g.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2">
                  <div className="flex items-center gap-3">
                    <Link href={`/game/${g.gameSlug}`} target="_blank">
                      <div className="w-10 h-14 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 hover:opacity-90 transition-opacity">
                        <SafeGameImage
                          src={g.gameImageUrl}
                          alt={g.gameTitle || "Jogo"}
                          className="w-full h-full"
                        />
                      </div>
                    </Link>
                    <Link href={`/game/${g.gameSlug}`} target="_blank">
                      <span className="font-medium dark:text-white hover:text-primary-500">
                        {g.gameTitle}
                      </span>
                    </Link>
                  </div>
                </td>
                <td className="p-2 text-sm text-gray-600 dark:text-gray-300">
                  {g.media === "PHYSICAL" ? "Físico" : "Digital"}
                </td>
                {/* Células adicionais para venda */}
                {sale && (
                  <>
                    <td className="p-2">
                      {g.price ? (
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          R$ {g.price.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                        {g.condition || "-"}
                      </span>
                    </td>
                    <td className="p-2">
                      {g.acceptsTrade ? (
                        <span className="text-xs text-blue-600 dark:text-blue-400">Sim</span>
                      ) : (
                        <span className="text-xs text-gray-400">Não</span>
                      )}
                    </td>
                  </>
                )}
                {isOwner && (
                  <td className="p-2">
                    <GameActionButtons game={g as UserGame} isOwner={isOwner} />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
