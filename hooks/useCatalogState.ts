// hooks/useCatalogState.ts - CORRIGIDO
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { UseCatalogStateProps, ViewMode } from "@/@types/catalog-state.types";

export const useCatalogState = ({
  storageKey,
  defaultViewMode = "grid",
  defaultSort = "name-asc",
  defaultPerPage = 20,
}: UseCatalogStateProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Estados iniciais - usar função para evitar SSR issues
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [sort, setSort] = useState<string>(defaultSort);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(defaultPerPage);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Inicializar estados após mount (client-side only)
  useEffect(() => {
    // ViewMode do localStorage
    const savedView = localStorage.getItem(`${storageKey}-view`);
    if (savedView) {
      setViewMode(savedView as ViewMode);
    }

    // Sort do localStorage ou URL
    const savedSort = localStorage.getItem(`${storageKey}-sort`);
    const urlSort = searchParams.get("sort");
    if (savedSort) {
      setSort(savedSort);
    } else if (urlSort) {
      setSort(urlSort);
    }

    // Page da URL
    const urlPage = searchParams.get("page");
    if (urlPage) {
      setPage(parseInt(urlPage));
    } else {
      setPage(1); // Reset para página 1 se não houver parâmetro
    }

    // PerPage da URL
    const urlPerPage = searchParams.get("perPage");
    if (urlPerPage) {
      setPerPage(parseInt(urlPerPage));
    }

    // Search da URL - SEMPRE atualiza, mesmo quando é removido
    const urlSearch = searchParams.get("search");
    setSearchQuery(urlSearch || ""); // ← Esta linha é a correção
  }, [storageKey, searchParams]);

  // Persistir preferências no localStorage
  useEffect(() => {
    localStorage.setItem(`${storageKey}-view`, viewMode);
  }, [viewMode, storageKey]);

  useEffect(() => {
    localStorage.setItem(`${storageKey}-sort`, sort);
  }, [sort, storageKey]);

  // Atualizar URL quando estados mudam
  const updateURL = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Handlers
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    updateURL({ sort: newSort, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateURL({ page: newPage.toString() });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
    updateURL({ perPage: newPerPage.toString(), page: "1" });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    updateURL({ search: query, page: "1" });
  };

  const handleFilterDrawerToggle = (open: boolean) => {
    setIsFilterDrawerOpen(open);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPage(1);

    const params = new URLSearchParams();
    params.set("sort", sort);
    params.set("page", "1");
    params.set("perPage", perPage.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return {
    // Estados
    viewMode,
    sort,
    page,
    perPage,
    searchQuery,
    isFilterDrawerOpen,

    // Setters
    setViewMode: handleViewModeChange,
    setSort: handleSortChange,
    setPage: handlePageChange,
    setPerPage: handlePerPageChange,
    setSearchQuery: handleSearchChange,
    setFilterDrawerOpen: handleFilterDrawerToggle,

    // Utils
    clearFilters,
    updateURL,
  };
};
