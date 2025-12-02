import React, { useState, useMemo } from "react";
import { useApiClient } from "@/lib/api-client";
import { AutoComplete, AutoCompleteItem } from "@/components/atoms/AutoComplete/AutoComplete";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback/ImageWithFallback";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PaginationMeta } from "@/@types/catalog.types";

export interface CatalogAccessoryItem {
  accessoryId: number;
  accessoryVariantId: number;
  name: string;
  imageUrl?: string | null;
  subtitle?: string | null;
}

interface CatalogAccessorySelectorProps {
  selectedItems: CatalogAccessoryItem[];
  onItemSelect: (item: CatalogAccessoryItem) => void;
  onItemRemove: (accessoryVariantId: number) => void;
  label: string;
  placeholder: string;
}

interface ApiAccessory {
  id: number; // accessoryId
  name: string;
  imageUrl: string | null;
  variants: {
    id: number; // variantId
    name: string;
    imageUrl: string | null;
  }[];
  type: string;
}

interface ApiAccessoryResponse {
  items: ApiAccessory[];
  meta: PaginationMeta;
}

export const CatalogAccessorySelector = ({
  selectedItems,
  onItemSelect,
  onItemRemove,
  label,
  placeholder,
}: CatalogAccessorySelectorProps) => {
  const { apiFetch } = useApiClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["catalogAccessories", searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];

      const response = await apiFetch<ApiAccessoryResponse>(
        `/accessories?search=${encodeURIComponent(searchQuery)}&perPage=10`,
      );

      // Flatten accessories and their variants
      const flattenedItems: CatalogAccessoryItem[] = [];

      response.items.forEach((acc) => {
        if (acc.variants && acc.variants.length > 0) {
          acc.variants.forEach((variant) => {
            flattenedItems.push({
              accessoryId: acc.id,
              accessoryVariantId: variant.id,
              name: `${acc.name} - ${variant.name}`,
              imageUrl: variant.imageUrl || acc.imageUrl,
              subtitle: acc.type,
            });
          });
        }
      });

      return flattenedItems;
    },
    enabled: searchQuery.length >= 2,
    staleTime: 60 * 1000,
  });

  const filteredItems = useMemo(() => {
    return items
      .filter(
        (item: CatalogAccessoryItem) =>
          !selectedItems.some(
            (selected) => selected.accessoryVariantId === item.accessoryVariantId,
          ),
      )
      .map((item: CatalogAccessoryItem) => ({
        id: item.accessoryVariantId, // Use variant ID as unique ID
        label: item.name,
        imageUrl: item.imageUrl,
        type: item.subtitle || undefined,
        originalItem: item,
      }));
  }, [items, selectedItems]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelect = (item: AutoCompleteItem) => {
    const selected = item.originalItem as CatalogAccessoryItem;
    if (selected) {
      onItemSelect(selected);
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
        {item.type && <p className="text-xs text-gray-500 dark:text-gray-400">{item.type}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>

      <AutoComplete
        items={filteredItems}
        onItemSelect={handleSelect}
        onSearch={handleSearch}
        loading={isLoading}
        placeholder={placeholder}
        renderItem={renderAutoCompleteItem}
      />

      {/* Selected Items List */}
      {selectedItems.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mt-2">
          {selectedItems.map((item) => (
            <div
              key={item.accessoryVariantId}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="shrink-0 w-10 h-10 relative">
                  <ImageWithFallback
                    src={item.imageUrl}
                    alt={item.name}
                    width={40}
                    height={40}
                    fallbackClassName="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded"
                    imgClassName="object-cover rounded"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  {item.subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onItemRemove(item.accessoryVariantId)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remover item"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
