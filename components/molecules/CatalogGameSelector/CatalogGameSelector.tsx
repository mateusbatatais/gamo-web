import React, { useState, useMemo } from "react";
import { useApiClient } from "@/lib/api-client";
import { AutoComplete, AutoCompleteItem } from "@/components/atoms/AutoComplete/AutoComplete";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback/ImageWithFallback";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PaginationMeta } from "@/@types/catalog.types";

export interface CatalogConsoleItem {
  consoleId: number;
  userConsoleId?: number;
  consoleVariantId: number;
  skinId?: number;
  name: string;
  imageUrl?: string | null;
  subtitle?: string | null;
  skins: { id: number; name: string; imageUrl: string | null }[];
}

export interface CatalogGameItem {
  internalId: string;
  gameId: number;
  userGameId?: number;
  platformId?: number;
  name: string;
  imageUrl?: string | null;
  platforms: { id: number; name: string; slug: string }[];
}

interface CatalogGameSelectorProps {
  selectedItems: CatalogGameItem[];
  onItemSelect: (item: CatalogGameItem) => void;
  onItemRemove: (internalId: string) => void;
  label: string;
  placeholder: string;
}

interface ApiGame {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  platforms: {
    id: number;
    name: string;
    slug: string;
  }[];
}

interface ApiGameResponse {
  items: ApiGame[];
  meta: PaginationMeta;
}

export const CatalogGameSelector = ({
  selectedItems,
  onItemSelect,
  onItemRemove,
  label,
  placeholder,
}: CatalogGameSelectorProps) => {
  const { apiFetch } = useApiClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["catalogGames", searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];

      const response = await apiFetch<ApiGameResponse>(
        `/games?search=${encodeURIComponent(searchQuery)}&perPage=10`,
      );

      return response.items.map((item) => ({
        gameId: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        platforms: item.platforms.map((p) => ({ id: p.id, name: p.name, slug: p.slug })),
      }));
    },
    enabled: searchQuery.length >= 2,
    staleTime: 60 * 1000,
  });

  const filteredItems = useMemo(() => {
    return items.map((item) => ({
      id: item.gameId,
      label: item.name,
      imageUrl: item.imageUrl,
      originalItem: item,
    }));
  }, [items]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelect = (item: AutoCompleteItem) => {
    const selected = item.originalItem as Omit<CatalogGameItem, "internalId">;
    if (selected) {
      // Generate a temporary internalId, the parent component should ideally handle this or overwrite it
      const itemWithPlatform = {
        ...selected,
        internalId: Math.random().toString(36).substr(2, 9),
        platformId: selected.platforms.length > 0 ? selected.platforms[0].id : undefined,
      };
      onItemSelect(itemWithPlatform as CatalogGameItem);
    }
    setSearchQuery("");
  };

  const renderAutoCompleteItem = (item: AutoCompleteItem) => (
    <div className="flex items-center gap-3 p-2">
      <div className="shrink-0 w-10 h-10 relative">
        <ImageWithFallback
          src={item.imageUrl}
          alt={item.label}
          width={40}
          height={40}
          fallbackClassName="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded"
          imgClassName="object-cover rounded"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.label}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <AutoComplete
        label={label}
        items={filteredItems}
        onItemSelect={handleSelect}
        onSearch={handleSearch}
        loading={isLoading}
        placeholder={placeholder}
        renderItem={renderAutoCompleteItem}
      />

      {/* Selected Items List */}
      {selectedItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {selectedItems.map((item) => (
            <div
              key={item.internalId}
              className="relative flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 group"
            >
              <button
                type="button"
                onClick={() => onItemRemove(item.internalId)}
                className="absolute top-2 right-2 p-1 bg-white/80 dark:bg-black/50 rounded-full text-gray-500 hover:text-red-500 transition-colors z-10 md:opacity-0 md:group-hover:opacity-100"
                title="Remover item"
              >
                <X size={16} />
              </button>

              <div className="w-full aspect-3/4 relative mb-2 rounded overflow-hidden">
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.name}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  fallbackClassName="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"
                  imgClassName="object-cover"
                />
              </div>

              <div className="w-full text-center">
                <p
                  className="text-sm font-medium text-gray-900 dark:text-white truncate w-full"
                  title={item.name}
                >
                  {item.name}
                </p>
                {item.platforms.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.platforms.find((p) => p.id === item.platformId)?.name ||
                      item.platforms[0].name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
