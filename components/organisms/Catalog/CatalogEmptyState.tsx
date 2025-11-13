// components/catalog/CatalogEmptyState.tsx
"use client";

import { EmptyState } from "@/components/atoms/EmptyState/EmptyState";

interface CatalogEmptyStateProps {
  title: string;
  description: string;
  onClearFilters?: () => void;
  actionText?: string;
}

export const CatalogEmptyState = ({
  title,
  description,
  onClearFilters,
  actionText = "Limpar filtros",
}: CatalogEmptyStateProps) => {
  return (
    <EmptyState
      title={title}
      description={description}
      variant="card"
      size="lg"
      actionText={onClearFilters ? actionText : undefined}
      onAction={onClearFilters}
      actionVariant="outline"
      actionStatus="info"
    />
  );
};
