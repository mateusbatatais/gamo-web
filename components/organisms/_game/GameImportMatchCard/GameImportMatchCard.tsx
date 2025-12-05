// GameImportMatchCard.tsx - VERSÃO OTIMIZADA
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
import { MatchFieldEditor } from "../MatchFieldEditor/MatchFieldEditor";

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
    platformsMap,
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
        updatePlatform(bestMatch.id.toString());
      }
    }
  }, [
    match.userPlatform,
    match.confirmedPlatformId,
    match.suggestedPlatformId,
    findBestPlatformMatch,
  ]);

  // Sync status from props (e.g. when "Confirm All" updates the match)
  useEffect(() => {
    setCurrentStatus(
      match.matchStatus === "CONFIRMED"
        ? "CONFIRMED"
        : match.matchStatus === "SKIPPED"
          ? "SKIPPED"
          : "PENDING",
    );
  }, [match.matchStatus]);

  const platformOptions = getPlatformOptions();
  const confidencePercentage = match.confidence ? Math.round(match.confidence * 100) : 0;
  const selectedPlatformName = selectedPlatformId
    ? platformsMap[parseInt(selectedPlatformId)]
    : null;

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
        await apiFetch(`/user-games-import/match/${matchId}/game`, {
          method: "PUT",
          body: { gameId },
        });
        setCurrentStatus("CONFIRMED");
        if (game) setCurrentGame(game);
      } else {
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

  // Função para renderizar dados do usuário de forma compacta
  const renderUserDataCompact = () => {
    if (!match.userData || currentStatus === "SKIPPED") return null;

    const hasData =
      match.userData.status ||
      match.userData.media ||
      match.userData.progress ||
      match.userData.rating;
    if (!hasData) return null;

    return (
      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
        {match.userData.status && (
          <span className="flex items-center gap-1">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {t(`statusValues.${match.userData.status.toLowerCase()}`)}
            </span>
          </span>
        )}
        {match.userData.media && (
          <span className="flex items-center gap-1">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {t(`mediaValues.${match.userData.media.toLowerCase()}`)}
            </span>
          </span>
        )}
        {match.userData.progress !== undefined && (
          <span className="flex items-center gap-1">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {match.userData.progress}/10
            </span>
          </span>
        )}
        {match.userData.rating !== undefined && (
          <span className="flex items-center gap-1">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              ⭐{match.userData.rating}
            </span>
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <Card className="p-3 mb-3">
        {/* Header Compacto */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                {match.rawInput}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${getStatusColor(currentStatus)}`}
              >
                {getStatusText(currentStatus)}
                {match.confidence && currentStatus === "PENDING" && ` (${confidencePercentage}%)`}
              </span>
            </div>
            {renderUserDataCompact()}
          </div>
        </div>

        {/* Jogo e Plataforma em Linha Única */}
        {currentGame && currentStatus !== "SKIPPED" && (
          <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
            {/* Jogo */}
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="w-8 h-8 shrink-0">
                <ImageWithFallback
                  src={currentGame.imageUrl}
                  alt={currentGame.name}
                  width={32}
                  height={32}
                  fallbackClassName="bg-gray-200 dark:bg-gray-700 w-8 h-8 flex items-center justify-center rounded text-xs"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                  {currentGame.name}
                </p>
                {match.confidence && currentStatus === "PENDING" && (
                  <p
                    className={`text-xs ${
                      match.confidence > 0.8
                        ? "text-green-600"
                        : match.confidence > 0.6
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {confidencePercentage}% {t("confidence")}
                  </p>
                )}
              </div>
            </div>

            {/* Plataforma Compacta */}
            {(match.userPlatform || platformOptions.length > 0) && (
              <div className="flex items-center gap-2 ml-3 shrink-0">
                {currentStatus === "CONFIRMED" && selectedPlatformName ? (
                  // Plataforma como texto quando confirmado
                  <div className="text-right">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Plataforma</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedPlatformName}
                    </p>
                  </div>
                ) : (
                  // Seletor de plataforma quando pendente
                  <div className="w-42">
                    <Select
                      options={[{ value: "", label: "Plataforma" }, ...platformOptions]}
                      value={selectedPlatformId}
                      onChange={(e) => {
                        setSelectedPlatformId(e.target.value);
                        updatePlatform(e.target.value);
                      }}
                      disabled={
                        platformLoading || platformsLoading || currentStatus === "CONFIRMED"
                      }
                      size="sm"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Ações Compactas */}
        <div className="flex flex-wrap gap-1.5">
          {currentStatus === "PENDING" && (
            <>
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
                label={t("actions.search")}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateMatch(match.id, null)}
                loading={isLoading}
                label={t("actions.skip")}
              />
            </>
          )}

          {currentStatus !== "PENDING" && (
            <>
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
                  label={t("actions.change")}
                />
              )}
            </>
          )}
        </div>

        {/* Editor de Campos */}
        {currentStatus !== "SKIPPED" && (
          <MatchFieldEditor
            match={match}
            onUpdate={() => onConfirm(match.id, currentGame?.id || null)}
          />
        )}
      </Card>

      {/* Modal de Busca */}
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
