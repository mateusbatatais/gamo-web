// types/catalog-state.types.ts

export type ViewMode = "grid" | "list" | "table" | "compact";

export interface SortOption {
  value: string;
  label: string;
}

export interface UseCatalogStateProps {
  storageKey: string;
  defaultViewMode?: ViewMode;
  defaultSort?: string;
  defaultPerPage?: number;
}

export interface CatalogLayoutProps {
  // Header
  searchPlaceholder: string;
  searchPath: string;
  sortOptions: SortOption[];
  toggleItems?: { value: string; label: string }[];
  toggleValue?: string;
  onToggleChange?: (value: string) => void;

  // Filtros
  filterSidebar: React.ReactNode;
  filterDrawer: React.ReactNode;

  // Conteúdo
  content: React.ReactNode;
  emptyState: React.ReactNode;
  loadingState?: React.ReactNode;

  // Paginação
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };

  // Estados controlados
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sort: string;
  onSortChange: (sort: string) => void;

  // Mobile
  isFilterDrawerOpen: boolean;
  onFilterDrawerToggle: (open: boolean) => void;
}

export interface CatalogHeaderProps {
  searchPlaceholder: string;
  searchPath: string;
  sortOptions: SortOption[];
  sort: string;
  onSortChange: (sort: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onFilterToggle: () => void;
  showFilterButton?: boolean;
  toggleItems?: { value: string; label: string }[];
  toggleValue?: string;
  onToggleChange?: (value: string) => void;
}
