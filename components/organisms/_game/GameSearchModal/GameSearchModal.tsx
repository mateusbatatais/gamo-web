// src/components/organisms/_game/GameSearchModal/GameSearchModal.tsx
"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Button } from "@/components/atoms/Button/Button";
import { Game } from "@/@types/catalog.types";
import { useApiClient } from "@/lib/api-client";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback/ImageWithFallback";
import { Autocomplete, AutocompleteItem } from "@/components/atoms/Autocomplete/AutoComplete";

interface GameSearchModalProps {
  searchTerm: string;
  onSelectGame: (game: Game) => void;
  onClose: () => void;
}

export function GameSearchModal({ searchTerm, onSelectGame, onClose }: GameSearchModalProps) {
  const t = useTranslations("GameImport.searchModal");
  const { apiFetch } = useApiClient();

  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Buscar jogos quando o termo mudar (usando o debounce interno do Autocomplete)
  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await apiFetch<{ items: Game[] }>(
          `/games?search=${encodeURIComponent(query)}&perPage=8`,
        );
        setSearchResults(results.items || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiFetch],
  );

  // Quando um item é selecionado no Autocomplete
  const handleItemSelect = (item: AutocompleteItem) => {
    const game = searchResults.find((g) => g.id === item.id);
    if (game) {
      setSelectedGame(game);
    }
  };

  // Confirmar a seleção
  const handleConfirm = () => {
    if (selectedGame) {
      onSelectGame(selectedGame);
      onClose();
    }
  };

  // Renderizar cada item do Autocomplete
  const renderGameItem = (item: AutocompleteItem) => (
    <div className="flex items-center gap-3 p-2">
      <div className="flex-shrink-0 w-12 h-12 relative">
        <ImageWithFallback
          src={item.imageUrl}
          alt={item.label}
          width={48}
          height={48}
          fallbackClassName="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded"
          imgClassName="object-cover rounded"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.label}</p>
        {item.subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>
        )}
      </div>
    </div>
  );

  // Converter jogos para items do Autocomplete
  const autocompleteItems: AutocompleteItem[] = searchResults.map((game) => ({
    id: game.id,
    label: game.name,
    imageUrl: game.imageUrl,
    subtitle: game.releaseDate ? new Date(game.releaseDate).getFullYear().toString() : undefined,
  }));

  return (
    <Dialog open={true} onClose={onClose} title={t("title")} size="md">
      <div className="space-y-6">
        {/* Autocomplete Simples */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("searchLabel")}
          </label>

          <Autocomplete
            items={autocompleteItems}
            onItemSelect={handleItemSelect}
            onSearch={handleSearch}
            loading={isLoading}
            placeholder={t("searchPlaceholder")}
            defaultValue={searchTerm}
            renderItem={renderGameItem}
          />
        </div>

        {/* Preview do Jogo Selecionado */}
        {selectedGame && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 flex-shrink-0">
                  <ImageWithFallback
                    src={selectedGame.imageUrl}
                    alt={selectedGame.name}
                    width={48}
                    height={48}
                    fallbackClassName="bg-gray-200 dark:bg-gray-700 w-12 h-12 flex items-center justify-center rounded"
                    imgClassName="object-cover rounded"
                  />
                </div>
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    {selectedGame.name}
                  </p>
                  {selectedGame.releaseDate && (
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {new Date(selectedGame.releaseDate).getFullYear()}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-green-600 dark:text-green-400 text-lg">✓</div>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={onClose} label={t("cancelButton")} />

          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedGame}
            label={t("confirmButton")}
          />
        </div>
      </div>
    </Dialog>
  );
}
