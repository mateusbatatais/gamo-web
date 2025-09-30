// src/components/organisms/_game/GameImportCard/GameImportCard.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { ParsedGame } from "@/hooks/useFileParser";
import { Badge } from "@/components/atoms/Badge/Badge";

interface GameImportCardProps {
  game: ParsedGame;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function GameImportCard({ game, index, isSelected, onSelect }: GameImportCardProps) {
  const t = useTranslations("GameImport");

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig = {
      OWNED: {
        color: "soft" as const,
        label: t("status.owned"),
      },
      SELLING: {
        color: "outline" as const,
        label: t("status.selling"),
      },
      LOOKING_FOR: {
        color: "solid" as const,
        label: t("status.lookingFor"),
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <Badge status="primary" variant={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getMediaBadge = (media?: string) => {
    if (!media) return null;

    return (
      <Badge status="secondary" variant="soft">
        {media === "DIGITAL" ? t("media.digital") : t("media.physical")}
      </Badge>
    );
  };

  return (
    <Card
      className={`p-4 transition-all duration-200 ${
        isSelected
          ? "ring-2 ring-primary-500 dark:ring-primary-400 bg-primary-50 dark:bg-primary-900/20"
          : ""
      }`}
    >
      <div className="flex items-start space-x-4">
        <Checkbox
          checked={isSelected}
          onChange={onSelect}
          aria-label={`Selecionar ${game.gameName}`}
        />

        <div className="flex-1 min-w-0">
          {/* Header com nome e badges */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {game.gameName}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(game.status)}
                {getMediaBadge(game.media)}
                {game.platform && (
                  <>
                    <Badge status="secondary" variant="outline">
                      {game.platform}
                    </Badge>
                  </>
                )}
                {game.price && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">R$ {game.price}</span>
                )}
              </div>
            </div>

            <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
              #{index + 1}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {game.progress !== undefined && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t("details.progress")}: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {game.progress}/10
                </span>
              </div>
            )}

            {game.rating !== undefined && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t("details.rating")}: </span>
                <span className="font-medium text-gray-900 dark:text-white">{game.rating}/10</span>
              </div>
            )}

            {game.hasBox && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t("details.hasBox")}: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {game.hasBox ? t("details.yes") : t("details.no")}
                </span>
              </div>
            )}

            {game.hasManual && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t("details.hasManual")}: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {game.hasManual ? t("details.yes") : t("details.no")}
                </span>
              </div>
            )}
          </div>

          {/* Condição e Trade */}
          {(game.condition || game.acceptsTrade !== undefined) && (
            <div className="flex items-center space-x-4 mt-2 text-sm">
              {game.condition && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {t("details.condition")}:{" "}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {game.condition.toLowerCase()}
                  </span>
                </div>
              )}

              {game.acceptsTrade !== undefined && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {t("details.acceptsTrade")}:{" "}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {game.acceptsTrade ? t("details.yes") : t("details.no")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Descrição */}
          {game.description && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {game.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
