// components/catalog/layouts/CatalogHeader.tsx - CORRIGIDO
"use client";

import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { ViewToggle } from "@/components/molecules/ViewToggle/ViewToggle";
import { Button } from "@/components/atoms/Button/Button";
import { Settings2 } from "lucide-react";
import { CatalogHeaderProps } from "@/@types/catalog-state.types";

export const CatalogHeader = ({
  searchPlaceholder,
  searchPath,
  sortOptions,
  sort,
  onSortChange,
  onViewModeChange,
  onFilterToggle,
  showFilterButton = true,
}: CatalogHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* Searchbar - 100% em lg */}
      <div className="w-full lg:flex-1">
        <SearchBar
          compact
          searchPath={searchPath}
          placeholder={searchPlaceholder}
          // O SearchBar já lida com a navegação automaticamente
          // quando o usuário digita e pressiona Enter
        />
      </div>

      {/* Resto do código igual... */}
      <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
        <div className="w-full md:w-full lg:w-auto">
          <SortSelect
            options={sortOptions}
            value={sort}
            onChange={onSortChange}
            className="w-full lg:w-auto"
          />
        </div>

        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap justify-between lg:justify-end">
          <ViewToggle onViewChange={onViewModeChange} storageKey="catalog-view" />

          {showFilterButton && (
            <div className="lg:hidden">
              <Button
                variant="secondary"
                size="sm"
                onClick={onFilterToggle}
                icon={<Settings2 size={16} />}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
