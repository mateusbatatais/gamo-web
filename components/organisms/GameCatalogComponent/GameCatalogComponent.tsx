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
  const [view, setView] = useState<ViewType>("grid");
  const [sort, setSort] = useState<string>("releaseDate-desc");
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
  }, [locale, page, perPage, searchQuery, sort]);

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
    });

    window.location.search = params.toString();
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-6 flex justify-end gap-4">
          <Skeleton className="h-10 w-32 rounded-md" animated />
          <div className="flex space-x-1">
            <Skeleton className="w-10 h-10 rounded-md" animated />
            <Skeleton className="w-10 h-10 rounded-md" animated />
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
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full sm:w-auto flex-1"></div>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <SortSelect
            options={SORT_OPTIONS}
            value={sort}
            onChange={handleSortChange}
            className="w-full sm:w-auto"
          />
          <ViewToggle onViewChange={(newView) => setView(newView)} storageKey="game-catalog-view" />
        </div>
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
              view === "grid" ? "grid grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col space-y-6",
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
          description="Tente ajustar sua busca"
          variant="card"
          size="lg"
        />
      )}
    </div>
  );
};

export default GameCatalogComponent;
