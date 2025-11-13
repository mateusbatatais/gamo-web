// hooks/usePublicProfileCatalog.ts
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ViewMode } from "@/@types/catalog-state.types";

export interface UsePublicProfileCatalogProps {
  storageKey: string;
  defaultViewMode?: ViewMode;
  defaultPerPage?: number;
  defaultSort?: string; // ← ADICIONAR ESTA PROP
}

export interface UsePublicProfileCatalogReturn {
  viewMode: ViewMode;
  page: number;
  perPage: number;
  searchQuery: string;
  sort: string;
  searchParams: URLSearchParams;
  setViewMode: (mode: ViewMode) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setSearchQuery: (query: string) => void;
  setSort: (sort: string) => void;
  clearFilters: () => void;
  updateURL: (params: Record<string, string>) => void;
}

export const usePublicProfileCatalog = ({
  storageKey,
  defaultViewMode = "grid",
  defaultPerPage = 50,
  defaultSort = "name-asc",
}: UsePublicProfileCatalogProps): UsePublicProfileCatalogReturn => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Estados iniciais
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(defaultPerPage);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sort, setSort] = useState<string>(defaultSort); // ← USAR defaultSort

  // Inicializar estados após mount (client-side only)
  useEffect(() => {
    // ViewMode do localStorage
    const savedPreferences = localStorage.getItem(storageKey);
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        if (prefs.viewMode) setViewMode(prefs.viewMode);
        if (prefs.perPage) setPerPage(Number(prefs.perPage));
      } catch {
        // ignore
      }
    }

    // Estados da URL
    const urlPage = searchParams.get("page");
    if (urlPage) setPage(parseInt(urlPage));
    else setPage(1); // Reset para página 1 se não houver parâmetro

    const urlPerPage = searchParams.get("perPage");
    if (urlPerPage) setPerPage(parseInt(urlPerPage));

    const urlSearch = searchParams.get("search");
    setSearchQuery(urlSearch || ""); // ← SEMPRE atualiza, mesmo quando removido

    const urlSort = searchParams.get("sort");
    if (urlSort) setSort(urlSort);
  }, [storageKey, searchParams, defaultSort]);

  // Persistir preferências
  useEffect(() => {
    const preferences = {
      viewMode,
      perPage: perPage.toString(),
    };
    localStorage.setItem(storageKey, JSON.stringify(preferences));
  }, [viewMode, perPage, storageKey]);

  // Atualizar URL
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

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(1);
    updateURL({ sort: newSort, page: "1" });
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
    page,
    perPage,
    searchQuery,
    sort,
    searchParams, // ← ADICIONAR para acessar searchParams
    updateURL, // ← ADICIONAR função para atualizar URL

    // Setters
    setViewMode: handleViewModeChange,
    setPage: handlePageChange,
    setPerPage: handlePerPageChange,
    setSearchQuery: handleSearchChange,
    setSort: handleSortChange,

    // Utils
    clearFilters,
  };
};
