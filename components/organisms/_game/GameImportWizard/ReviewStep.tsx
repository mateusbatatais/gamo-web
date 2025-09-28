// src/components/organisms/_game/GameImportWizard/ReviewStep.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button/Button";
import { ParsedGame } from "@/hooks/useFileParser";
import { GameImportCard } from "../GameImportCard/GameImportCard";

interface ReviewStepProps {
  parsedGames: ParsedGame[];
  onConfirm: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function ReviewStep({ parsedGames, onConfirm, onBack, isLoading }: ReviewStepProps) {
  const t = useTranslations("GameImport");
  const [selectedGames, setSelectedGames] = useState<Set<number>>(new Set());

  const toggleGameSelection = (index: number) => {
    const newSelected = new Set(selectedGames);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedGames(newSelected);
  };

  const selectAll = () => {
    if (selectedGames.size === parsedGames.length) {
      setSelectedGames(new Set());
    } else {
      setSelectedGames(new Set(parsedGames.map((_, index) => index)));
    }
  };

  const selectedCount = selectedGames.size;
  const totalCount = parsedGames.length;

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("review.title")}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t("review.gamesFound", { count: totalCount })}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t("review.selectedCount", { count: selectedCount, total: totalCount })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("review.selectAllHint")}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={selectAll}
              label={selectedCount === totalCount ? t("review.deselectAll") : t("review.selectAll")}
            />
          </div>
        </div>
      </Card>

      {/* Lista de Jogos */}
      <div className="space-y-3">
        {parsedGames.map((game, index) => (
          <GameImportCard
            key={index}
            game={game}
            index={index}
            isSelected={selectedGames.has(index)}
            onSelect={() => toggleGameSelection(index)}
          />
        ))}
      </div>

      {/* Ações */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="outline" onClick={onBack} label={t("review.actions.back")} />

        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("review.readyToImport", { count: selectedCount })}
          </span>
          <Button
            type="button"
            onClick={onConfirm}
            loading={isLoading}
            disabled={selectedCount === 0}
            label={t("review.actions.confirm")}
          />
        </div>
      </div>

      {/* Dicas */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {t("review.tips.title")}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {t("review.tips.description")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
