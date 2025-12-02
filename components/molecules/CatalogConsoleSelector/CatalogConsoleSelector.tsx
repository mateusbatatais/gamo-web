import React, { useState, useMemo } from "react";
import { useApiClient } from "@/lib/api-client";
import { AutoComplete, AutoCompleteItem } from "@/components/atoms/AutoComplete/AutoComplete";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback/ImageWithFallback";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PaginationMeta } from "@/@types/catalog.types";

export interface CatalogConsoleItem {
  consoleId: number;
  consoleVariantId: number;
  userConsoleId?: number;
  skinId?: number;
  name: string;
  imageUrl?: string | null;
  subtitle?: string | null;
  skins: { id: number; name: string; imageUrl: string | null }[];
}

interface CatalogConsoleSelectorProps {
  selectedItems: CatalogConsoleItem[];
  onItemSelect: (item: CatalogConsoleItem) => void;
  onItemRemove: (consoleVariantId: number) => void;
  onItemUpdate?: (item: CatalogConsoleItem) => void;
  label: string;
  placeholder: string;
}

interface ApiConsoleVariant {
  id: number; // variantId
  consoleId: number;
  name: string; // Variant name
  consoleName: string; // Console name
  brand: { slug: string };
  imageUrl: string | null;
  skins: { id: number; name: string; imageUrl: string | null }[];
}

interface ApiConsoleResponse {
  items: ApiConsoleVariant[];
  meta: PaginationMeta;
}

export const CatalogConsoleSelector = ({
  selectedItems,
  onItemSelect,
  onItemRemove,
  onItemUpdate,
  label,
  placeholder,
}: CatalogConsoleSelectorProps) => {
  const { apiFetch } = useApiClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["catalogConsoles", searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];

      const response = await apiFetch<ApiConsoleResponse>(
        `/consoles?search=${encodeURIComponent(searchQuery)}&perPage=10`,
      );

      return response.items.map((item) => ({
        consoleId: item.consoleId,
        consoleVariantId: item.id,
        name: `${item.consoleName} ${item.name}`.trim(),
        imageUrl: item.imageUrl,
        subtitle: item.brand?.slug,
        skins: item.skins || [],
      }));
    },
    enabled: searchQuery.length >= 2,
    staleTime: 60 * 1000,
  });

  const filteredItems = useMemo(() => {
    return items
      .filter(
        (item: CatalogConsoleItem) =>
          !selectedItems.some((selected) => selected.consoleVariantId === item.consoleVariantId),
      )
      .map((item: CatalogConsoleItem) => ({
        id: item.consoleVariantId, // Use variant ID as unique ID for AutoComplete
        label: item.name,
        imageUrl: item.imageUrl,
        type: item.subtitle || undefined,
        originalItem: item, // Store full item to retrieve on select
      }));
  }, [items, selectedItems]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelect = (item: AutoCompleteItem) => {
    const selected = item.originalItem as CatalogConsoleItem;
    if (selected) {
      // Default to first skin if available
      const itemWithSkin = {
        ...selected,
        skinId: selected.skins && selected.skins.length > 0 ? selected.skins[0].id : undefined,
      };
      onItemSelect(itemWithSkin);
    }
    setSearchQuery("");
  };

  const handleSkinChange = (item: CatalogConsoleItem, skinId: string) => {
    if (onItemUpdate) {
      const skin = item.skins.find((s) => s.id === Number(skinId));
      onItemUpdate({
        ...item,
        skinId: Number(skinId),
        imageUrl: skin?.imageUrl || item.imageUrl, // Update image if skin has one
      });
    }
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
              key={item.consoleVariantId}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 overflow-hidden flex-1">
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
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  {item.subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {item.subtitle}
                    </p>
                  )}
                  {/* Debug log */}
                  {/* {console.log("Item skins:", item.skins)} */}
                  {item.skins && item.skins.length > 0 && (
                    <div className="mt-1">
                      <select
                        value={item.skinId}
                        onChange={(e) => handleSkinChange(item, e.target.value)}
                        className="text-xs p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white max-w-full"
                      >
                        {item.skins.map((skin) => (
                          <option key={skin.id} value={skin.id}>
                            {skin.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onItemRemove(item.consoleVariantId)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
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
