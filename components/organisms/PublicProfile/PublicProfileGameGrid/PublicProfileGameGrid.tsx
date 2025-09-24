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
import { useSearchParams, useRouter } from "next/navigation";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { SortOption, SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/atoms/Drawer/Drawer";
import { Settings2, Grid3X3, List, Table, ListChecks } from "lucide-react";
import GameFilterContainer from "@/components/molecules/Filter/GameFilterContainer";
import { Button } from "@/components/atoms/Button/Button";
import { Select } from "@/components/atoms/Select/Select";
import { Dropdown } from "@/components/molecules/Dropdown/Dropdown";
import { EmptyCard } from "../EmptyCard/EmptyCard";

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

type ViewMode = "grid" | "compact" | "list" | "table";

// Chave para armazenar as preferências no localStorage
const STORAGE_KEY = "userGamesViewPreferences";

const PublicProfileGameGridContent = ({ slug, locale, isOwner }: PublicProfileGameGridProps) => {
  const t = useTranslations("PublicProfile");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [localPerPage, setLocalPerPage] = useState(50);

  useEffect(() => {
    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        if (preferences.viewMode) {
          setViewMode(preferences.viewMode);
        }
        if (preferences.perPage) {
          setLocalPerPage(Number(preferences.perPage));
        }
      } catch (error) {
        console.error("Error parsing saved preferences:", error);
      }
    }
  }, []);

  useEffect(() => {
    const preferences = {
      viewMode,
      perPage: localPerPage.toString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [viewMode, localPerPage]);

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || localPerPage.toString());
  const sort = searchParams.get("sort") || "title-asc";
  const search = searchParams.get("search") || "";
  const genres = searchParams.get("genres") || "";
  const platforms = searchParams.get("platforms") || "";

  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    genres ? genres.split(",").map(Number) : [],
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>(
    platforms ? platforms.split(",").map(Number) : [],
  );

  const { data, isLoading, error } = useUserGamesPublic(
    slug,
    locale,
    "OWNED",
    page,
    perPage,
    sort,
    search,
    selectedGenres,
    selectedPlatforms,
  );

  const games = data?.items || [];
  const meta = data?.meta;

  // Opções de ordenação específicas para jogos
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

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePerPageChange = (newPerPage: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("perPage", newPerPage);
    params.set("page", "1");
    setLocalPerPage(Number(newPerPage));
    router.push(`?${params.toString()}`);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleGenreChange = (genres: number[]) => {
    setSelectedGenres(genres);
    updateURL({ genres: genres.join(",") });
  };

  const handlePlatformChange = (platforms: number[]) => {
    setSelectedPlatforms(platforms);
    updateURL({ platforms: platforms.join(",") });
  };

  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedPlatforms([]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("genres");
    params.delete("platforms");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full sm:w-auto flex-1">
          <SearchBar compact searchPath={`/user/${slug}/games`} placeholder={t("searchGames")} />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <SortSelect
            options={SORT_OPTIONS}
            value={sort}
            onChange={handleSortChange}
            className="w-full sm:w-auto"
          />
          <Select
            options={PER_PAGE_OPTIONS}
            value={perPage.toString()}
            onChange={(e) => handlePerPageChange(e.target.value)}
            className="w-20"
            size="sm"
          />
          <Dropdown
            items={VIEW_MODE_OPTIONS.map((option) => ({
              id: option.value,
              label: option.label,
              icon: option.icon,
              onClick: () => handleViewModeChange(option.value as ViewMode),
            }))}
            trigger={
              <Button
                variant="outline"
                size="sm"
                icon={VIEW_MODE_OPTIONS.find((option) => option.value === viewMode)?.icon}
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

      <Drawer
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filtrar Jogos"
        anchor="right"
        className="w-full max-w-md"
      >
        <GameFilterContainer
          onGenreChange={handleGenreChange}
          onPlatformChange={handlePlatformChange}
          selectedGenres={selectedGenres}
          selectedPlatforms={selectedPlatforms}
          clearFilters={clearFilters}
        />
      </Drawer>

      {!games || games.length === 0 ? (
        <Card>
          <div className=" py-12">
            <p className="text-center text-gray-500 dark:text-gray-400 mb-4">{t("noGames")}</p>
            {isOwner && (
              <EmptyCard
                text={t("txtGame")}
                buttonLabel={t("txtAddGame")}
                buttonLink="/user/collection/games/add/"
                viewMode="list"
              />
            )}
          </div>
        </Card>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("gamesCollection")}</h2>

          {viewMode === "table" ? (
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
                    />
                  )}
                  {games.map((game: UserGame) => (
                    <PublicProfileGameTable key={game.id} game={game} isOwner={isOwner || false} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : viewMode === "list" ? (
            // Modo Lista
            <div className="space-y-4">
              {isOwner && (
                <EmptyCard
                  text={t("txtGame")}
                  buttonLabel={t("txtAddGame")}
                  buttonLink="/user/collection/games/add/"
                  viewMode="list"
                />
              )}
              {games.map((game: UserGame) => (
                <PublicProfileGameList key={game.id} game={game} isOwner={isOwner || false} />
              ))}
            </div>
          ) : (
            // Modo Grid ou Compacto
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
              } gap-6`}
            >
              {viewMode === "compact" && (
                <>
                  {isOwner && (
                    <EmptyCard
                      text={t("txtGame")}
                      buttonLabel={t("txtAddGame")}
                      buttonLink="/user/collection/games/add/"
                      viewMode="compact"
                    />
                  )}
                  {games.map((game: UserGame) => (
                    <PublicProfileGameCompact
                      key={game.id}
                      game={game}
                      isOwner={isOwner || false}
                    />
                  ))}
                </>
              )}
              {viewMode === "grid" && (
                <>
                  {isOwner && (
                    <EmptyCard
                      text={t("txtGame")}
                      buttonLabel={t("txtAddGame")}
                      buttonLink="/user/collection/games/add/"
                      viewMode="card"
                    />
                  )}
                  {games.map((game: UserGame) => (
                    <PublicProfileGameCard key={game.id} game={game} isOwner={isOwner || false} />
                  ))}
                </>
              )}
            </div>
          )}
        </>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};
