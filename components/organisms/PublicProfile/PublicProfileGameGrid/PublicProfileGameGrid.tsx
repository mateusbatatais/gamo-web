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

  // Obter parâmetros da URL
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "6");
  const sort = searchParams.get("sort") || "title-asc";
  const search = searchParams.get("search") || "";

  const { data, isLoading, error } = useUserGamesPublic(
    slug,
    locale,
    "OWNED", // status fixo para coleção
    page,
    perPage,
    sort,
    search,
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
    { value: "condition-asc", label: t("order.conditionAsc") },
    { value: "condition-desc", label: t("order.conditionDesc") },
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

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

  if (!games || games.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t("noGames")}</p>
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
        <SortSelect
          options={SORT_OPTIONS}
          value={sort}
          onChange={handleSortChange}
          className="w-full sm:w-auto"
        />
      </div>

      <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("gamesCollection")}</h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {games.map((game: UserGame) => (
          <PublicProfileGameCard key={game.id} game={game} isOwner={isOwner || false} />
        ))}
      </div>

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
