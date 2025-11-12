// components/organisms/GameCatalogComponent/GameCatalogComponent.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import GameCard from "@/components/molecules/_game/GameCard/GameCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { EmptyState } from "@/components/atoms/EmptyState/EmptyState";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ViewToggle, ViewType } from "@/components/molecules/ViewToggle/ViewToggle";
import { SortOption, SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { useTranslations } from "next-intl";
import { GameCardSkeleton } from "@/components/molecules/_game/GameCard/GameCard.skeleton";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import GameFilterContainer from "@/components/molecules/Filter/GameFilterContainer";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { useGames } from "@/hooks/useGames";
import { Game } from "@/@types/catalog.types";
import { Drawer } from "@/components/atoms/Drawer/Drawer";
import { Button } from "@/components/atoms/Button/Button";
import { Settings2 } from "lucide-react";

interface GameCatalogComponentProps {
  page: number;
  perPage: number;
}

const GameCatalogComponent = ({ page, perPage }: GameCatalogComponentProps) => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [view, setView] = useState<ViewType>("grid");
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setItems } = useBreadcrumbs();

  const SORT_OPTIONS: SortOption[] = [
    { value: "name-asc", label: t("order.nameAsc") },
    { value: "name-desc", label: t("order.nameDesc") },
    { value: "releaseDate-asc", label: t("order.releaseDateAsc") },
    { value: "releaseDate-desc", label: t("order.releaseDateDesc") },
    { value: "score-desc", label: t("order.scoreDesc") },
  ];

  // Obter parâmetros da URL
  const searchQuery = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "score-desc";
  const genresParam = searchParams.get("genres") || "";
  const platformsParam = searchParams.get("platforms") || "";
  const [sort, setSort] = useState<string>(sortParam);
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    genresParam ? genresParam.split(",").map(Number) : [],
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>(
    platformsParam ? platformsParam.split(",").map(Number) : [],
  );

  const {
    data: games,
    isLoading,
    error,
    isPlaceholderData,
  } = useGames({
    page,
    perPage,
    sort,
    selectedGenres,
    selectedPlatforms,
    searchQuery,
  });

  // Atualizar URL quando filtros mudam
  const updateURL = useCallback(
    (updates: { genres?: number[]; platforms?: number[]; sort?: string; page?: number }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.genres !== undefined) {
        if (updates.genres.length > 0) {
          params.set("genres", updates.genres.join(","));
        } else {
          params.delete("genres");
        }
      }

      if (updates.platforms !== undefined) {
        if (updates.platforms.length > 0) {
          params.set("platforms", updates.platforms.join(","));
        } else {
          params.delete("platforms");
        }
      }

      if (updates.sort !== undefined) {
        params.set("sort", updates.sort);
      }

      if (updates.page !== undefined) {
        params.set("page", updates.page.toString());
      }

      // Resetar para página 1 ao mudar filtros
      if (
        updates.genres !== undefined ||
        updates.platforms !== undefined ||
        updates.sort !== undefined
      ) {
        params.set("page", "1");
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  // Handlers para mudanças de filtro
  const handleGenreChange = useCallback(
    (genres: number[]) => {
      setSelectedGenres(genres);
      updateURL({ genres, page: 1 });
    },
    [updateURL],
  );

  const handlePlatformChange = useCallback(
    (platforms: number[]) => {
      setSelectedPlatforms(platforms);
      updateURL({ platforms, page: 1 });
    },
    [updateURL],
  );

  const handleSortChange = useCallback(
    (newSort: string) => {
      setSort(newSort);
      localStorage.setItem("game-catalog-sort", newSort);
      updateURL({ sort: newSort, page: 1 });
    },
    [updateURL],
  );

  const clearFilters = useCallback(() => {
    setSelectedGenres([]);
    setSelectedPlatforms([]);
    updateURL({ genres: [], platforms: [] });
  }, [updateURL]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateURL({ page: newPage });
    },
    [updateURL],
  );

  // Restaurar preferências de visualização
  useEffect(() => {
    const savedView = localStorage.getItem("game-catalog-view") as ViewType | null;
    if (savedView) setView(savedView);

    const savedSort = localStorage.getItem("game-catalog-sort");
    if (savedSort) setSort(savedSort);
  }, []);

  useEffect(() => {
    setItems([
      {
        label: t("Breadcrumbs.game-catalog"),
      },
    ]);

    return () => setItems([]);
  }, [setItems, t]);

  if (isLoading && !isPlaceholderData) {
    return (
      <div className="flex flex-col lg:flex-row">
        {/* Skeleton para filtros */}
        <div className="hidden lg:block w-full lg:w-1/4 pr-4">
          <div className="sticky top-[70px]">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-1/2 mb-3" animated />
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2" rounded="sm" animated />
                      <Skeleton className="h-4 w-3/4" animated />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-6 w-1/2 mb-3" animated />
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2" rounded="sm" animated />
                      <Skeleton className="h-4 w-3/4" animated />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Skeleton className="h-10 w-full mt-4 rounded-md" animated />
          </div>
        </div>

        {/* Skeleton para conteúdo */}
        <div className="w-full">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex justify-end items-end gap-4 flex-1">
              <Skeleton className="h-10 w-32 rounded-md" animated />
              <div className="flex space-x-1">
                <Skeleton className="w-10 h-10 rounded-md" animated />
                <Skeleton className="w-10 h-10 rounded-md" animated />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-10 h-10 rounded-full" animated />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Filtros para desktop */}
      <div className="hidden lg:block w-full lg:w-1/4 pr-4">
        <div className="sticky top-[70px] overflow-y-auto h-[calc(100vh-70px)] pe-2">
          <GameFilterContainer
            onGenreChange={handleGenreChange}
            onPlatformChange={handlePlatformChange}
            selectedGenres={selectedGenres}
            selectedPlatforms={selectedPlatforms}
            clearFilters={clearFilters}
          />
        </div>
      </div>

      <div className="w-full lg:w-3/4">
        {/* Header com controles - REVISADO */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Searchbar - 100% em lg */}
          <div className="w-full lg:flex-1">
            <SearchBar compact searchPath="/game-catalog" placeholder="Buscar jogos..." />
          </div>

          {/* Grupo de controles - reorganizado por breakpoint */}
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* SortSelect - em md: 100%, em lg: normal */}
            <div className="w-full md:w-full lg:w-auto">
              <SortSelect
                options={SORT_OPTIONS}
                value={sort}
                onChange={handleSortChange}
                className="w-full lg:w-auto"
              />
            </div>

            {/* Demais controles - linha em lg, empilhados em md */}
            <div className="flex items-center gap-4 flex-wrap md:flex-nowrap justify-between lg:justify-end">
              <ViewToggle
                onViewChange={(newView) => setView(newView)}
                storageKey="game-catalog-view"
              />

              {/* Botão de filtros - visível apenas em mobile */}
              <div className="lg:hidden">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  icon={<Settings2 size={16} />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Drawer de Filtros para Mobile */}
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

        {error ? (
          <EmptyState
            title="Erro ao carregar dados"
            description={error.message}
            variant="card"
            size="lg"
            actionText="Tentar novamente"
            onAction={() => window.location.reload()}
          />
        ) : games?.items && games.items.length > 0 ? (
          <>
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-2 xl:grid-cols-3 gap-6"
                  : "flex flex-col space-y-6"
              }
            >
              {games.items.map((game: Game) => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  name={game.name}
                  imageUrl={game.imageUrl || ""}
                  parentPlatforms={game.parentPlatforms}
                  platforms={game.platforms}
                  slug={game.slug}
                  releaseDate={game.releaseDate || ""}
                  metacritic={game.metacritic}
                  developer={game.developer}
                  orientation={view === "grid" ? "vertical" : "horizontal"}
                  shortScreenshots={game.shortScreenshots}
                  isFavorite={game.isFavorite}
                />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={games.meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <EmptyState
            title="Nenhum jogo encontrado"
            description="Tente ajustar sua busca ou filtros"
            variant="card"
            size="lg"
            actionText="Limpar filtros"
            onAction={() => clearFilters()}
            actionVariant="outline"
            actionStatus="info"
          />
        )}
      </div>
    </div>
  );
};

export default GameCatalogComponent;
