import React, { useState, useMemo } from "react";
import { useApiClient } from "@/lib/api-client";
import { AutoComplete, AutoCompleteItem } from "@/components/atoms/AutoComplete/AutoComplete";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback/ImageWithFallback";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export interface KitItem {
  id: number;
  name: string;
  imageUrl?: string | null;
  subtitle?: string | null;
}

interface KitItemSelectorProps {
  type: "GAME" | "CONSOLE" | "ACCESSORY";
  selectedItems: KitItem[];
  onItemSelect: (item: KitItem) => void;
  onItemRemove: (id: number) => void;
  label: string;
  placeholder: string;
}

// Define types for API responses
interface KitSelectorUserGame {
  id: number;
  game: { name: string; imageUrl: string | null };
  photoMain: string | null;
  platform?: { name: string };
}

interface KitSelectorUserConsole {
  id: number;
  console: { translations: { name: string }[] };
  variant: { imageUrl: string | null; translations: { name: string }[] };
  photoMain: string | null;
  skin?: { imageUrl: string | null; translations: { name: string }[] };
}

interface KitSelectorUserAccessory {
  id: number;
  accessory: { imageUrl: string | null; translations: { name: string }[] };
  variant?: { imageUrl: string | null; translations: { name: string }[] };
  photoMain: string | null;
}

type KitSelectorItem = KitSelectorUserGame | KitSelectorUserConsole | KitSelectorUserAccessory;

export const KitItemSelector = ({
  type,
  selectedItems,
  onItemSelect,
  onItemRemove,
  label,
  placeholder,
}: KitItemSelectorProps) => {
  const { apiFetch } = useApiClient();
  const [searchQuery, setSearchQuery] = useState("");

  const endpoint = useMemo(() => {
    switch (type) {
      case "GAME":
        return "/user-games";
      case "CONSOLE":
        return "/user-consoles";
      case "ACCESSORY":
        return "/user-accessories";
      default:
        return "";
    }
  }, [type]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["userItems", type],
    queryFn: async () => {
      const data = await apiFetch<KitSelectorItem[]>(endpoint);
      return data.map((item) => {
        if (type === "GAME" && "game" in item) {
          const gameItem = item as KitSelectorUserGame;
          return {
            id: gameItem.id,
            name: gameItem.game.name,
            imageUrl: gameItem.photoMain || gameItem.game.imageUrl,
            subtitle: gameItem.platform?.name,
          };
        } else if (type === "CONSOLE" && "console" in item) {
          const consoleItem = item as KitSelectorUserConsole;
          return {
            id: consoleItem.id,
            name: `${consoleItem.console.translations?.[0]?.name || "Console"} ${
              consoleItem.variant.translations?.[0]?.name || ""
            }`.trim(),
            imageUrl:
              consoleItem.photoMain || consoleItem.skin?.imageUrl || consoleItem.variant.imageUrl,
            subtitle: consoleItem.skin?.translations?.[0]?.name,
          };
        } else if (type === "ACCESSORY" && "accessory" in item) {
          const accessoryItem = item as KitSelectorUserAccessory;
          return {
            id: accessoryItem.id,
            name: accessoryItem.accessory?.translations?.[0]?.name || "Accessory",
            imageUrl:
              accessoryItem.photoMain ||
              accessoryItem.variant?.imageUrl ||
              accessoryItem.accessory?.imageUrl,
            subtitle: accessoryItem.variant?.translations?.[0]?.name,
          };
        }
        // Fallback or error case
        return {
          id: item.id,
          name: "Unknown Item",
        };
      });
    },
    staleTime: 60 * 1000,
  });

  const filteredItems = useMemo(() => {
    if (!searchQuery) return [];
    const lowerQuery = searchQuery.toLowerCase();
    return items
      .filter(
        (item: KitItem) =>
          !selectedItems.some((selected) => selected.id === item.id) &&
          (item.name.toLowerCase().includes(lowerQuery) ||
            item.subtitle?.toLowerCase().includes(lowerQuery)),
      )
      .map((item: KitItem) => ({
        id: item.id,
        label: item.name,
        imageUrl: item.imageUrl,
        type: item.subtitle || undefined,
      }));
  }, [items, searchQuery, selectedItems]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelect = (item: AutoCompleteItem) => {
    // Find the full item object from our local items list using the ID
    const selected = items.find((i: KitItem) => i.id === item.id);
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
              key={item.id}
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
                onClick={() => onItemRemove(item.id)}
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
