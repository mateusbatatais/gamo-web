// components/organisms/PublicProfile/PublicProfileMarketGrid/PublicProfileMarketGrid.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { PublicProfileGameCard } from "../PublicProfileGameCard/PublicProfileGameCard";
import { PublicProfileConsoleCard } from "../PublicProfileConsoleCard/PublicProfileConsoleCard";
import { useUserGamesPublic, useUserConsolesPublic } from "@/hooks/usePublicProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { useSearchParams, useRouter } from "next/navigation";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { SortOption, SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";

interface PublicProfileMarketGridProps {
  slug: string;
  locale: string;
  isOwner?: boolean;
}

const queryClient = new QueryClient();

export const PublicProfileMarketGrid = ({
  slug,
  locale,
  isOwner = false,
}: PublicProfileMarketGridProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicProfileMarketGridContent slug={slug} locale={locale} isOwner={isOwner} />
    </QueryClientProvider>
  );
};

const PublicProfileMarketGridContent = ({
  slug,
  locale,
  isOwner,
}: PublicProfileMarketGridProps) => {
  const t = useTranslations("PublicProfile");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Obter parâmetros da URL
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "50");

  // Ordenação padrão compatível com ambas as APIs
  const defaultSort = "createdAt-desc";
  const sortParam = searchParams.get("sort");

  // Validar se o parâmetro de ordenação é compatível com ambas as APIs
  const validSortOptions = ["createdAt-asc", "createdAt-desc", "price-asc", "price-desc"];
  const sort = sortParam && validSortOptions.includes(sortParam) ? sortParam : defaultSort;

  const search = searchParams.get("search") || "";

  // Buscar itens para venda (status SELLING)
  const {
    data: gamesData,
    isLoading: gamesLoading,
    error: gamesError,
  } = useUserGamesPublic(slug, locale, "SELLING", page, perPage, sort, search);

  const {
    data: consolesData,
    isLoading: consolesLoading,
    error: consolesError,
  } = useUserConsolesPublic(slug, locale, "SELLING", page, perPage, sort, search);

  const isLoading = gamesLoading || consolesLoading;
  const error = gamesError || consolesError;

  const games = gamesData?.items || [];
  const consoles = consolesData?.items || [];
  const gamesMeta = gamesData?.meta;
  const consolesMeta = consolesData?.meta;

  // Usar a paginação do primeiro conjunto de itens (jogos) como referência
  const meta = gamesMeta || consolesMeta;

  // Opções de ordenação compatíveis com ambas as APIs (jogos e consoles)
  const SORT_OPTIONS: SortOption[] = [
    { value: "createdAt-desc", label: t("order.createdAtDesc") },
    { value: "createdAt-asc", label: t("order.createdAtAsc") },
    { value: "price-desc", label: t("order.priceDesc") },
    { value: "price-asc", label: t("order.priceAsc") },
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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

  const hasItems = (games && games.length > 0) || (consoles && consoles.length > 0);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full sm:w-auto flex-1">
          <SearchBar compact searchPath={`/user/${slug}/market`} placeholder={t("searchMarket")} />
        </div>
        <SortSelect
          options={SORT_OPTIONS}
          value={sort}
          onChange={handleSortChange}
          className="w-full sm:w-auto"
        />
      </div>

      {consoles && consoles.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("consolesForSale")}</h2>
          <div className={`grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8`}>
            {consoles.map((consoleItem) => (
              <PublicProfileConsoleCard
                key={consoleItem.id}
                consoleItem={consoleItem}
                isOwner={isOwner || false}
              />
            ))}
          </div>
        </>
      )}

      {!hasItems && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t("noMarketItems")}</p>
          </div>
        </Card>
      )}

      {games && games.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("gamesForSale")}</h2>
          <div className={`grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-6`}>
            {games.map((game) => (
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
