// components/organisms/PublicProfile/PublicProfileGameGrid/PublicProfileGameGrid.tsx
"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { PublicProfileGameCard } from "../PublicProfileGameCard/PublicProfileGameCard";
import { useUserGamesPublic } from "@/hooks/usePublicProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { UserGame } from "@/@types/collection.types";
import { useSearchParams, useRouter } from "next/navigation";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { SortOption, SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { useState } from "react";
import { Drawer } from "@/components/atoms/Drawer/Drawer";
import { Settings2 } from "lucide-react";
import GameFilterContainer from "@/components/molecules/Filter/GameFilterContainer";
import { Button } from "@/components/atoms/Button/Button";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "50");
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
        <div className="flex items-center gap-4">
          <SortSelect
            options={SORT_OPTIONS}
            value={sort}
            onChange={handleSortChange}
            className="w-full sm:w-auto"
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
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t("noGames")}</p>
          </div>
        </Card>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("gamesCollection")}</h2>
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
            {games.map((game: UserGame) => (
              <PublicProfileGameCard key={game.id} game={game} isOwner={isOwner || false} />
            ))}
          </div>
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
