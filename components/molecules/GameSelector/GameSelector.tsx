import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { AutoComplete, AutoCompleteItem } from "@/components/atoms/AutoComplete/AutoComplete";
import { useApiClient } from "@/lib/api-client";
import { Game } from "@/@types/catalog.types";
import { GameItem } from "../GameItem/GameItem";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback/ImageWithFallback";

export interface SelectedGameVariant {
  variantId: number;
  quantity: number;
  name: string;
  imageUrl?: string | null;
  slug: string;
}

interface GameSelectorProps {
  consoleId: number;
  selectedVariants: Record<number, SelectedGameVariant>;
  onQuantityChange: (variantId: number, newQuantity: number) => void;
  onRemoveGame: (variantId: number) => void;
  onAddGame: (game: SelectedGameVariant) => void;
}

export const GameSelector = ({
  consoleId,
  selectedVariants,
  onQuantityChange,
  onRemoveGame,
  onAddGame,
}: GameSelectorProps) => {
  const t = useTranslations("SimpleConsoleForm");
  const { apiFetch } = useApiClient();
  const [isLoading, setIsLoading] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState<AutoCompleteItem[]>([]);
  const [searchResults, setSearchResults] = useState<Game[]>([]);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setAutocompleteItems([]);
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await apiFetch<{ items: Game[] }>(
          `/games?platforms=${consoleId}&search=${encodeURIComponent(query)}&perPage=10`,
        );

        setSearchResults(results.items);

        const items = results.items.map((game) => ({
          id: game.id,
          label: game.name,
          imageUrl: game.imageUrl,
          type: game.releaseDate ? new Date(game.releaseDate).getFullYear().toString() : undefined,
        }));
        setAutocompleteItems(items);
      } catch (error) {
        console.error("Search error:", error);
        setAutocompleteItems([]);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiFetch, consoleId],
  );

  const handleItemSelect = (item: AutoCompleteItem) => {
    const game = searchResults.find((g) => g.id === item.id);

    if (game) {
      onAddGame({
        variantId: game.id,
        quantity: 1,
        name: game.name,
        imageUrl: game.imageUrl,
        slug: game.slug,
      });
    }
  };

  const selectedGamesList = Object.values(selectedVariants);

  const renderAutoCompleteItem = (item: AutoCompleteItem) => (
    <div className="flex items-center gap-3 p-2">
      <div className="shrink-0 w-8 h-8 relative">
        <ImageWithFallback
          src={item.imageUrl}
          alt={item.label}
          width={32}
          height={32}
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
    <div className="space-y-4">
      <div className="space-y-2">
        <AutoComplete
          items={autocompleteItems}
          onItemSelect={handleItemSelect}
          onSearch={handleSearch}
          loading={isLoading}
          placeholder={t("searchGames")}
          renderItem={renderAutoCompleteItem}
        />
      </div>

      {selectedGamesList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {selectedGamesList.map((game) => (
            <div key={game.variantId} className="relative group">
              <GameItem
                id={game.variantId}
                name={game.name}
                imageUrl={game.imageUrl}
                quantity={game.quantity}
                onQuantityChange={(newQuantity) => onQuantityChange(game.variantId, newQuantity)}
              />
              <button
                type="button"
                onClick={() => onRemoveGame(game.variantId)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-10"
                title={t("removeGame")}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">{t("noGamesSelected")}</p>
      )}
    </div>
  );
};
