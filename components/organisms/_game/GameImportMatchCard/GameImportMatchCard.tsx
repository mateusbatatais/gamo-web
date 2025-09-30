// GameImportMatchCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button/Button";
import { Select } from "@/components/atoms/Select/Select";
import { ImportMatch } from "@/hooks/useGameImport";
import { GameSearchModal } from "../GameSearchModal/GameSearchModal";
import { Game } from "@/@types/catalog.types";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback/ImageWithFallback";
import { useApiClient } from "@/lib/api-client";
import { usePlatformMatching } from "@/hooks/usePlatformMatching";

interface GameImportMatchCardProps {
  match: ImportMatch;
  onConfirm: (matchId: number, confirmedGameId: number | null, newSuggestedGame?: Game) => void;
}

export function GameImportMatchCard({ match, onConfirm }: GameImportMatchCardProps) {
  const t = useTranslations("GameImport.confirmation");
  const { apiFetch } = useApiClient();
  const {
    findBestPlatformMatch,
    getPlatformOptions,
    isLoading: platformsLoading,
  } = usePlatformMatching();

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [platformLoading, setPlatformLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<"PENDING" | "CONFIRMED" | "SKIPPED">(
    match.matchStatus === "CONFIRMED"
      ? "CONFIRMED"
      : match.matchStatus === "SKIPPED"
        ? "SKIPPED"
        : "PENDING",
  );
  const [currentGame, setCurrentGame] = useState(match.suggestedGame);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>(
    match.confirmedPlatformId?.toString() || match.suggestedPlatformId?.toString() || "",
  );

  // Encontrar melhor match de plataforma quando o componente carrega
  useEffect(() => {
    if (match.userPlatform && !match.confirmedPlatformId && !match.suggestedPlatformId) {
      const bestMatch = findBestPlatformMatch(match.userPlatform);
      if (bestMatch) {
        setSelectedPlatformId(bestMatch.id.toString());
        // Auto-save da plataforma sugerida
        updatePlatform(bestMatch.id.toString());
      }
    }
  }, [
    match.userPlatform,
    match.confirmedPlatformId,
    match.suggestedPlatformId,
    findBestPlatformMatch,
  ]);

  const platformOptions = getPlatformOptions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "SKIPPED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      CONFIRMED: t("status.confirmed"),
      SKIPPED: t("status.skipped"),
      PENDING: t("status.pending"),
    };
    return statusMap[status] || status;
  };

  const updateMatch = async (matchId: number, gameId: number | null, game?: Game) => {
    setIsLoading(true);
    try {
      if (gameId) {
        // Atualizar com novo jogo
        await apiFetch(`/user-games-import/match/${matchId}/game`, {
          method: "PUT",
          body: { gameId },
        });
        setCurrentStatus("CONFIRMED");
        if (game) setCurrentGame(game);
      } else {
        // Marcar como skipped
        await apiFetch(`/user-games-import/match/${matchId}/confirm`, {
          method: "PUT",
          body: { confirmedGameId: null },
        });
        setCurrentStatus("SKIPPED");
      }

      onConfirm(matchId, gameId, game);
    } catch (error) {
      console.error("Error updating match:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar plataforma (NOVA)
  const updatePlatform = async (platformId: string) => {
    setPlatformLoading(true);
    try {
      await apiFetch(`/user-games-import/match/${match.id}/platform`, {
        method: "PUT",
        body: { platformId: platformId ? parseInt(platformId) : null },
      });
      setSelectedPlatformId(platformId);
    } catch (error) {
      console.error("Error updating platform:", error);
    } finally {
      setPlatformLoading(false);
    }
  };

  const handleReopen = async (matchId: number) => {
    await updateMatch(matchId, null);
    setCurrentStatus("PENDING");
  };

  const handleGameSelectFromModal = async (game: Game) => {
    await updateMatch(match.id, game.id, game);
    setShowSearchModal(false);
  };

  const confidencePercentage = match.confidence ? Math.round(match.confidence * 100) : 0;

  return (
    <>
      <Card className="p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{match.rawInput}</h3>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}
            >
              {getStatusText(currentStatus)}
              {match.confidence && currentStatus === "PENDING" && ` (${confidencePercentage}%)`}
            </span>
          </div>
        </div>

        {/* Jogo Atual - ORIGINAL MANTIDO */}
        {currentGame && currentStatus !== "SKIPPED" && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentStatus === "CONFIRMED" ? t("selectedGame") : t("suggestedMatch")}
              </span>
              {match.confidence && currentStatus === "PENDING" && (
                <span
                  className={`text-xs font-medium ${
                    match.confidence > 0.8
                      ? "text-green-600"
                      : match.confidence > 0.6
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {confidencePercentage}% {t("confidence")}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex-shrink-0">
                <ImageWithFallback
                  src={currentGame.imageUrl}
                  alt={currentGame.name}
                  width={48}
                  height={48}
                  fallbackClassName="bg-gray-200 dark:bg-gray-700 w-12 h-12 flex items-center justify-center rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {currentGame.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {currentGame.slug}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Seletor de Plataforma - NOVO (adicionado após o jogo) */}
        {(match.userPlatform || platformOptions.length > 0) && currentStatus !== "SKIPPED" && (
          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {t("platform")}
              </span>
              {match.userPlatform && (
                <span className="text-xs text-purple-600 dark:text-purple-400">
                  {t("originalPlatform")}: {match.userPlatform}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <Select
                  label={t("selectPlatform")}
                  options={[{ value: "", label: t("noPlatform") }, ...platformOptions]}
                  value={selectedPlatformId}
                  onChange={(e) => {
                    setSelectedPlatformId(e.target.value);
                    updatePlatform(e.target.value);
                  }}
                  disabled={platformLoading || platformsLoading}
                  size="sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Dados do Usuário - ORIGINAL MANTIDO */}
        {match.userData && currentStatus !== "SKIPPED" && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 block">
              {t("userData")}
            </span>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {match.userData.status && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t("fields.status")}: </span>
                  <span className="font-medium capitalize">
                    {t(`statusValues.${match.userData.status.toLowerCase()}`)}
                  </span>
                </div>
              )}
              {match.userData.media && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t("fields.media")}: </span>
                  <span className="font-medium capitalize">
                    {t(`mediaValues.${match.userData.media.toLowerCase()}`)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ações - ORIGINAL MANTIDO */}
        {currentStatus === "PENDING" && (
          <div className="flex flex-wrap gap-2">
            {currentGame && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => updateMatch(match.id, currentGame.id)}
                loading={isLoading}
                label={t("actions.confirmMatch")}
              />
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSearchModal(true)}
              loading={isLoading}
              label={t("actions.searchAlternatives")}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateMatch(match.id, null)}
              loading={isLoading}
              label={t("actions.skipGame")}
            />
          </div>
        )}

        {currentStatus !== "PENDING" && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleReopen(match.id)}
              loading={isLoading}
              label={t("actions.reopen")}
            />

            {currentStatus === "CONFIRMED" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSearchModal(true)}
                loading={isLoading}
                label={t("actions.changeGame")}
              />
            )}
          </div>
        )}
      </Card>

      {/* Modal de Busca - ORIGINAL MANTIDO */}
      {showSearchModal && (
        <GameSearchModal
          searchTerm={match.rawInput}
          onSelectGame={handleGameSelectFromModal}
          onClose={() => setShowSearchModal(false)}
        />
      )}
    </>
  );
}
