// components/organisms/PublicProfile/PublicProfileGameGrid/PublicProfileGameGrid.tsx
"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { PublicProfileGameCard } from "../PublicProfileGameCard/PublicProfileGameCard";
import { PublicProfileGameCompact } from "../PublicProfileGameCard/PublicProfileGameCompact";
import { PublicProfileGameList } from "../PublicProfileGameCard/PublicProfileGameList";
import { PublicProfileGameTable } from "../PublicProfileGameCard/PublicProfileGameTable";
import { useUserGamesPublic } from "@/hooks/usePublicProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { UserGame } from "@/@types/collection.types";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { SortOption, SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { Drawer } from "@/components/atoms/Drawer/Drawer";
import { Settings2, Grid3X3, List, Table, ListChecks } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { Select } from "@/components/atoms/Select/Select";
import { Dropdown } from "@/components/molecules/Dropdown/Dropdown";
import { EmptyCard } from "../EmptyCard/EmptyCard";
import { usePublicProfileCatalog } from "@/hooks/usePublicProfileCatalog";
import { useGameFilters } from "@/hooks/useGameFilters";
import GameFilterContainer from "@/components/molecules/Filter/GameFilterContainer";
import { useState } from "react";
import { ViewMode } from "@/@types/catalog-state.types";

interface PublicProfileGameGridProps {
  slug: string;
  locale: string;
  isOwner?: boolean;
}

const queryClient = new QueryClient();

export const PublicProfileGameGrid = ({
  slug,
  locale,
  isOwner = false,
}: PublicProfileGameGridProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicProfileGameGridContent slug={slug} locale={locale} isOwner={isOwner} />
    </QueryClientProvider>
  );
};

const PublicProfileGameGridContent = ({ slug, locale, isOwner }: PublicProfileGameGridProps) => {
  const t = useTranslations("PublicProfile");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Estado do catálogo
  const catalogState = usePublicProfileCatalog({
    storageKey: "userGamesViewPreferences",
    defaultViewMode: "grid",
    defaultPerPage: 50,
    defaultSort: "title-asc", // ← VALOR VÁLIDO para games
  });

  // Filtros de games
  const gameFilters = useGameFilters();

  // Buscar dados
  const { data, isLoading, error } = useUserGamesPublic(
    slug,
    locale,
    "OWNED",
    catalogState.page,
    catalogState.perPage,
    catalogState.sort,
    catalogState.searchQuery,
    gameFilters.selectedGenres,
    gameFilters.selectedPlatforms,
  );

  const games = data?.items || [];
  const meta = data?.meta;

  // Opções de ordenação
  const SORT_OPTIONS: SortOption[] = [
    { value: "title-asc", label: t("order.titleAsc") },
    { value: "title-desc", label: t("order.titleDesc") },
    { value: "createdAt-asc", label: t("order.createdAtAsc") },
    { value: "createdAt-desc", label: t("order.createdAtDesc") },
    { value: "progress-asc", label: t("order.progressAsc") },
    { value: "progress-desc", label: t("order.progressDesc") },
    { value: "rating-asc", label: t("order.ratingAsc") },
    { value: "rating-desc", label: t("order.ratingDesc") },
  ];

  // Opções de itens por página
  const PER_PAGE_OPTIONS = [
    { value: "20", label: "20/pg" },
    { value: "50", label: "50/pg" },
    { value: "100", label: "100/pg" },
  ];

  // Opções de modo de visualização
  const VIEW_MODE_OPTIONS = [
    { value: "grid", label: t("viewMode.grid"), icon: <Grid3X3 size={16} /> },
    { value: "compact", label: t("viewMode.compact"), icon: <ListChecks size={16} /> },
    { value: "list", label: t("viewMode.list"), icon: <List size={16} /> },
    { value: "table", label: t("viewMode.table"), icon: <Table size={16} /> },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t("errorLoading")}</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="w-full lg:flex-1">
          <SearchBar compact searchPath={`/user/${slug}/games`} placeholder={t("searchGames")} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
          <div className="w-full md:w-full lg:w-auto">
            <SortSelect
              options={SORT_OPTIONS}
              value={catalogState.sort}
              onChange={catalogState.setSort}
              className="w-full lg:w-auto"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap md:flex-nowrap justify-start lg:justify-end">
            <Select
              options={PER_PAGE_OPTIONS}
              value={catalogState.perPage.toString()}
              onChange={(e) => catalogState.setPerPage(Number(e.target.value))}
              className="min-w-25"
              size="sm"
            />
            <Dropdown
              items={VIEW_MODE_OPTIONS.map((option) => ({
                id: option.value,
                label: option.label,
                icon: option.icon,
                onClick: () => catalogState.setViewMode(option.value as ViewMode),
              }))}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  icon={
                    VIEW_MODE_OPTIONS.find((option) => option.value === catalogState.viewMode)?.icon
                  }
                />
              }
              menuClassName="min-w-40"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterDrawerOpen(true)}
              icon={<Settings2 size={16} />}
            />
          </div>
        </div>
      </div>

      {/* Drawer de Filtros */}
      <Drawer
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filtrar Jogos"
        anchor="right"
        className="w-full max-w-md"
      >
        <GameFilterContainer
          onGenreChange={gameFilters.handleGenreChange}
          onPlatformChange={gameFilters.handlePlatformChange}
          selectedGenres={gameFilters.selectedGenres}
          selectedPlatforms={gameFilters.selectedPlatforms}
          clearFilters={gameFilters.clearFilters}
        />
      </Drawer>

      {/* Conteúdo */}
      {!games || games.length === 0 ? (
        <Card>
          <div className="py-12">
            <p className="text-center text-gray-500 dark:text-gray-400 mb-4">{t("noGames")}</p>
            {isOwner && (
              <EmptyCard
                text={t("txtGame")}
                buttonLabel={t("txtAddGame")}
                buttonLink="/user/collection/games/add/"
                viewMode="list"
                isGame={true}
              />
            )}
          </div>
        </Card>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("gamesCollection")}</h2>

          {/* Renderização por view mode */}
          {catalogState.viewMode === "table" ? (
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
                    <EmptyCard
                      text={t("txtGame")}
                      buttonLabel={t("txtAddGame")}
                      buttonLink="/user/collection/games/add/"
                      viewMode="table"
                      isGame={true}
                    />
                  )}
                  {games.map((game: UserGame) => (
                    <PublicProfileGameTable key={game.id} game={game} isOwner={isOwner} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : catalogState.viewMode === "list" ? (
            <div className="space-y-4">
              {isOwner && (
                <EmptyCard
                  text={t("txtGame")}
                  buttonLabel={t("txtAddGame")}
                  buttonLink="/user/collection/games/add/"
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
                catalogState.viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
              } gap-6`}
            >
              {isOwner && (
                <EmptyCard
                  text={t("txtGame")}
                  buttonLabel={t("txtAddGame")}
                  buttonLink="/user/collection/games/add/"
                  viewMode={catalogState.viewMode === "grid" ? "card" : "compact"}
                  isGame={true}
                />
              )}
              {games.map((game: UserGame) =>
                catalogState.viewMode === "compact" ? (
                  <PublicProfileGameCompact key={game.id} game={game} isOwner={isOwner} />
                ) : (
                  <PublicProfileGameCard key={game.id} game={game} isOwner={isOwner} />
                ),
              )}
            </div>
          )}
        </>
      )}

      {/* Paginação */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={catalogState.page}
            totalPages={meta.totalPages}
            onPageChange={catalogState.setPage}
          />
        </div>
      )}
    </div>
  );
};
