// components/pages/PublicConsoleGamesPage/PublicConsoleGamesPage.tsx
"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { Card } from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useConsoleGames } from "@/components/organisms/PublicProfile/_hooks/useConsoleGames";
import { GameGridSection } from "@/components/organisms/PublicProfile/_sections/GameGridSection";
import { usePublicProfileCatalog } from "@/hooks/usePublicProfileCatalog";
import { Grid3X3, List, Table, ListChecks } from "lucide-react";
import { ViewMode } from "@/@types/catalog-state.types";
import { GridHeader } from "@/components/organisms/PublicProfile/GridHeader/GridHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";

interface PublicConsoleGamesPageProps {
  slug: string;
  consoleId: number;
  locale: string;
}

const queryClient = new QueryClient();

export const PublicConsoleGamesPage = ({
  slug,
  consoleId,
  locale,
}: PublicConsoleGamesPageProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicConsoleGamesPageContent slug={slug} consoleId={consoleId} locale={locale} />
    </QueryClientProvider>
  );
};

const PublicConsoleGamesPageContent = ({
  slug,
  consoleId,
  locale,
}: PublicConsoleGamesPageProps) => {
  const t = useTranslations("PublicProfile");
  const { user } = useAuth();
  const { setItems } = useBreadcrumbs();

  // Verificar se o usuário logado é o dono do perfil
  const isOwner = user?.slug === slug;

  // Estado do catálogo
  const catalogState = usePublicProfileCatalog({
    storageKey: "consoleGamesViewPreferences",
    defaultViewMode: "grid",
    defaultPerPage: 50,
    defaultSort: "title-asc",
  });

  // Buscar dados do console e jogos
  const {
    console: consoleData,
    games,
    gamesMeta,
    isLoading,
    error,
  } = useConsoleGames({
    slug,
    consoleId,
    locale,
    page: catalogState.page,
    perPage: catalogState.perPage,
    sort: catalogState.sort,
    searchQuery: catalogState.searchQuery,
  });

  useEffect(() => {
    if (consoleData) {
      setItems([
        { label: slug, href: `/user/${slug}` },
        { label: consoleData.consoleName || "Console", href: undefined },
      ]);
    }
    return () => setItems([]);
  }, [consoleData, slug, setItems]);

  const SORT_OPTIONS = [
    { value: "title-asc", label: t("order.titleAsc") },
    { value: "title-desc", label: t("order.titleDesc") },
    { value: "createdAt-asc", label: t("order.createdAtAsc") },
    { value: "createdAt-desc", label: t("order.createdAtDesc") },
    { value: "progress-asc", label: t("order.progressAsc") },
    { value: "progress-desc", label: t("order.progressDesc") },
    { value: "rating-asc", label: t("order.ratingAsc") },
    { value: "rating-desc", label: t("order.ratingDesc") },
  ];

  const PER_PAGE_OPTIONS = [
    { value: "20", label: "20/pg" },
    { value: "50", label: "50/pg" },
    { value: "100", label: "100/pg" },
  ];

  const VIEW_MODE_OPTIONS: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
    { value: "grid", label: t("viewMode.grid"), icon: <Grid3X3 size={16} /> },
    { value: "compact", label: t("viewMode.compact"), icon: <ListChecks size={16} /> },
    { value: "list", label: t("viewMode.list"), icon: <List size={16} /> },
    { value: "table", label: t("viewMode.table"), icon: <Table size={16} /> },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-32 w-full rounded-xl mb-6" />
        <Skeleton className="h-10 w-full rounded-md mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !consoleData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t("errorLoading")}</p>
            <Link href={`/user/${slug}`}>
              <Button variant="primary" className="mt-4">
                {t("backToProfile")}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Back Button */}
      <div className="mb-3">
        <Link href={`/user/${slug}`}>
          <Button variant="transparent" icon={<ArrowLeft size={16} />}>
            {t("backToCollection")}
          </Button>
        </Link>
      </div>

      {/* Console Header */}
      <Card className="mb-8">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 relative shrink-0 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden">
            {consoleData.photoMain || consoleData.skinImageUrl || consoleData.variantImageUrl ? (
              <Image
                src={
                  (
                    consoleData.photoMain ||
                    consoleData.skinImageUrl ||
                    consoleData.variantImageUrl ||
                    ""
                  ).startsWith("http")
                    ? consoleData.photoMain ||
                      consoleData.skinImageUrl ||
                      consoleData.variantImageUrl ||
                      ""
                    : `/${consoleData.photoMain || consoleData.skinImageUrl || consoleData.variantImageUrl || ""}`
                }
                alt={consoleData.consoleName || ""}
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-4xl">🎮</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold dark:text-white mb-2">{consoleData.consoleName}</h1>
            {consoleData.variantName && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">
                {consoleData.variantName}
              </p>
            )}
            {consoleData.skinName && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{consoleData.skinName}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {gamesMeta?.total || 0} {gamesMeta?.total === 1 ? "jogo" : "jogos"}
            </p>
          </div>
        </div>
      </Card>

      {/* Games Grid Header */}
      <GridHeader
        searchPath={`/user/${slug}/console/${consoleId}`}
        searchPlaceholder={t("searchGames")}
        sortOptions={SORT_OPTIONS}
        sortValue={catalogState.sort}
        onSortChange={catalogState.setSort}
        perPageOptions={PER_PAGE_OPTIONS}
        perPageValue={catalogState.perPage.toString()}
        onPerPageChange={(value) => catalogState.setPerPage(Number(value))}
        totalItems={gamesMeta?.total}
        viewModeOptions={VIEW_MODE_OPTIONS}
        viewModeValue={catalogState.viewMode}
        onViewModeChange={catalogState.setViewMode}
        showFilterButton={false}
      />

      {/* Games Grid */}
      <GameGridSection
        games={games}
        gamesMeta={gamesMeta}
        isOwner={isOwner}
        viewMode={catalogState.viewMode}
        currentPage={catalogState.page}
        onPageChange={catalogState.setPage}
        title=""
        emptyMessage={t("noGames")}
        addButtonText={t("txtAddGame")}
        addButtonLink="/user/collection/games/add"
      />
    </div>
  );
};
