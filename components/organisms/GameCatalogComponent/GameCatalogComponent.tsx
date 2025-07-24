"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";
import GameCard from "@/components/molecules/GameCard/GameCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { EmptyState } from "@/components/atoms/EmptyState/EmptyState";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { ViewToggle, ViewType } from "@/components/molecules/ViewToggle/ViewToggle";
import { SortOption, SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { useTranslations } from "next-intl";
import { GameListResponse } from "@/@types/game";
import { GameCardSkeleton } from "@/components/molecules/GameCard/GameCard.skeleton";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import GameFilterContainer from "@/components/molecules/Filter/GameFilterContainer";

interface GameCatalogComponentProps {
  locale: string;
  page: number;
  perPage: number;
}

const GameCatalogComponent = ({ locale, page, perPage }: GameCatalogComponentProps) => {
  const [games, setGames] = useState<GameListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<ViewType>("grid");
  const [sort, setSort] = useState<string>("popularity-desc");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const t = useTranslations();

  const SORT_OPTIONS: SortOption[] = [
    { value: "title-asc", label: t("order.nameAsc") },
    { value: "title-desc", label: t("order.nameDesc") },
    { value: "releaseDate-asc", label: t("order.releaseDateAsc") },
    { value: "releaseDate-desc", label: t("order.releaseDateDesc") },
    { value: "popularity-desc", label: t("order.popularityDesc") },
  ];

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const genresParam = searchParams.get("genres");
    const platformsParam = searchParams.get("platforms");

    if (genresParam) {
      setSelectedGenres(genresParam.split(","));
    }

    if (platformsParam) {
      setSelectedPlatforms(platformsParam.split(","));
    }
  }, []);

  const handleGenreChange = (genres: string[]) => {
    setSelectedGenres(genres);
    updateURL({ genres });
  };

  const handlePlatformChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms);
    updateURL({ platforms });
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedPlatforms([]);
    updateURL({ genres: [], platforms: [] });
  };

  const updateURL = (filters: { genres?: string[]; platforms?: string[] }) => {
    const params = new URLSearchParams({
      locale,
      page: "1",
      perPage: perPage.toString(),
      search: searchQuery,
      sort,
    });

    if (filters.genres && filters.genres.length > 0) {
      params.set("genres", filters.genres.join(","));
    } else {
      params.delete("genres");
    }

    if (filters.platforms && filters.platforms.length > 0) {
      params.set("platforms", filters.platforms.join(","));
    } else {
      params.delete("platforms");
    }

    window.history.pushState({}, "", `/game-catalog?${params.toString()}`);
    setLoading(true);
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          locale,
          page: page.toString(),
          perPage: perPage.toString(),
        });

        if (sort) params.append("sort", sort);
        if (searchQuery) params.append("search", searchQuery);
        if (selectedGenres.length > 0) {
          params.append("genres", selectedGenres.join(","));
        }
        if (selectedPlatforms.length > 0) {
          params.append("platforms", selectedPlatforms.join(","));
        }

        const data: GameListResponse = await apiFetch(`/games?${params.toString()}`);
        setGames(data);
        setTotalPages(data.meta.totalPages);
        setError("");
      } catch {
        setError("An error occurred while fetching games.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [locale, page, perPage, searchQuery, sort, selectedGenres, selectedPlatforms]);

  useEffect(() => {
    const savedView = localStorage.getItem("game-catalog-view") as ViewType | null;
    if (savedView) setView(savedView);
  }, []);

  useEffect(() => {
    const savedSort = localStorage.getItem("game-catalog-sort");
    if (savedSort) setSort(savedSort);
  }, []);

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    localStorage.setItem("game-catalog-sort", newSort);
    setLoading(true);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams({
      page: newPage.toString(),
      perPage: perPage.toString(),
      search: searchQuery,
      sort,
      ...(selectedGenres.length > 0 && { genres: selectedGenres.join(",") }),
      ...(selectedPlatforms.length > 0 && { platforms: selectedPlatforms.join(",") }),
    });

    window.location.search = params.toString();
  };

  if (loading) {
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
        <div className="sticky top-[70px]">
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
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="w-full sm:w-auto flex-1">
            <SearchBar compact />
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <SortSelect
              options={SORT_OPTIONS}
              value={sort}
              onChange={handleSortChange}
              className="w-full sm:w-auto"
            />
            <ViewToggle
              onViewChange={(newView) => setView(newView)}
              storageKey="game-catalog-view"
            />
          </div>
        </div>

        {/* Filtros para mobile */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between font-medium"
          >
            <span>{t("filters.label")}</span>
            <svg
              className={clsx(
                "w-5 h-5 transform transition-transform",
                showFilters ? "rotate-180" : "",
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
              <GameFilterContainer
                onGenreChange={handleGenreChange}
                onPlatformChange={handlePlatformChange}
                selectedGenres={selectedGenres}
                selectedPlatforms={selectedPlatforms}
                clearFilters={clearFilters}
              />
            </div>
          )}
        </div>

        {error ? (
          <EmptyState
            title="Erro ao carregar dados"
            description={error}
            variant="card"
            size="lg"
            actionText="Tentar novamente"
            onAction={() => window.location.reload()}
          />
        ) : games && games.items.length > 0 ? (
          <>
            <div
              className={clsx(
                view === "grid"
                  ? "grid grid-cols-2 xl:grid-cols-3 gap-6"
                  : "flex flex-col space-y-6",
              )}
            >
              {games.items.map((game) => (
                <GameCard
                  key={game.id}
                  title={game.title}
                  imageUrl={game.imageUrl || ""}
                  platforms={game.platforms}
                  slug={game.slug}
                  releaseDate={game.releaseDate}
                  developer={game.developer}
                  orientation={view === "grid" ? "vertical" : "horizontal"}
                />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
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
