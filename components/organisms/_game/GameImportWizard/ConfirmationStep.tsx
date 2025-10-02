// src/components/organisms/_game/GameImportWizard/ConfirmationStep.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button/Button";
import { ImportSession, ImportMatch } from "@/hooks/useGameImport";
import { GameImportMatchCard } from "../GameImportMatchCard/GameImportMatchCard";

interface ConfirmationStepProps {
  session: ImportSession & { matches?: ImportMatch[] };
  onRestart: () => void;
  onExecuteImport: () => Promise<void>;
  isExecuting: boolean;
}

export function ConfirmationStep({
  session,
  onRestart,
  onExecuteImport,
  isExecuting,
}: ConfirmationStepProps) {
  const t = useTranslations("GameImport.confirmation");
  const [confirmedMatches, setConfirmedMatches] = useState<Set<number>>(new Set());

  useEffect(() => {
    const initialConfirmed = new Set<number>();

    session.matches?.forEach((match) => {
      const shouldBeConfirmed =
        match.confirmedGameId || (match.matchStatus === "CONFIRMED" && match.suggestedGameId);

      if (shouldBeConfirmed) {
        initialConfirmed.add(match.id);
      }
    });

    setConfirmedMatches(initialConfirmed);
  }, [session]);

  const handleConfirmMatch = (matchId: number, gameId: number | null) => {
    setConfirmedMatches((prev) => {
      const newSet = new Set(prev);
      if (gameId) {
        newSet.add(matchId);
      } else {
        newSet.delete(matchId);
      }
      return newSet;
    });
  };

  const matchStats = useMemo(() => {
    const totalMatches = session.matches?.length || 0;
    const confirmedMatchesCount = confirmedMatches.size;
    const skippedMatchesCount = totalMatches - confirmedMatchesCount;

    return {
      totalMatches,
      confirmedMatchesCount,
      skippedMatchesCount,
    };
  }, [session.matches, confirmedMatches]);

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      READY_FOR_REVIEW: t("status.readyForReview"),
      PROCESSING: t("status.processing"),
      COMPLETED: t("status.completed"),
      FAILED: t("status.failed"),
      UPLOADED: t("status.uploaded"),
    };
    return statusMap[status] || status;
  };

  const getStatusBadgeClass = (status: string) => {
    const baseClass = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";

    const statusClasses: Record<string, string> = {
      READY_FOR_REVIEW: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      PROCESSING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    };

    const statusClass =
      statusClasses[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";

    return `${baseClass} ${statusClass}`;
  };

  const renderImportButton = (variant: "primary" | "outline" = "primary") => {
    const { confirmedMatchesCount } = matchStats;

    let buttonLabel: string;
    if (session.status === "COMPLETED") {
      buttonLabel = t("actions.importCompleted");
    } else if (confirmedMatchesCount === 0) {
      buttonLabel = t("actions.confirmAtLeastOne");
    } else {
      buttonLabel = t("actions.importGames", { count: confirmedMatchesCount });
    }

    return (
      <Button
        type="button"
        variant={variant}
        onClick={onExecuteImport}
        loading={isExecuting}
        disabled={confirmedMatchesCount === 0 || session.status === "COMPLETED"}
        label={buttonLabel}
      />
    );
  };

  const renderInstructionsCard = () => (
    <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
      <div className="flex items-start space-x-3">
        <div className="text-blue-600 dark:text-blue-400 mt-0.5 text-lg">💡</div>
        <div>
          <p className="font-medium text-blue-800 dark:text-blue-200">{t("instructions.title")}</p>
          <ol className="text-sm text-blue-700 dark:text-blue-300 mt-1 list-decimal list-inside space-y-1">
            <li>{t("instructions.step1")}</li>
            <li>{t("instructions.step2")}</li>
            <li>{t("instructions.step3")}</li>
            <li>{t("instructions.step4")}</li>
            <li>{t("instructions.step5")}</li>
          </ol>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">{t("instructions.note")}</p>
        </div>
      </div>
    </Card>
  );

  const renderMatchesList = () => {
    if (!session.matches || session.matches.length === 0) {
      return (
        <Card className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {session.status === "PROCESSING" ? t("messages.processing") : t("messages.noMatches")}
          </p>
        </Card>
      );
    }

    return session.matches.map((match) => (
      <GameImportMatchCard key={match.id} match={match} onConfirm={handleConfirmMatch} />
    ));
  };

  const renderSummaryCard = () => {
    const { confirmedMatchesCount, totalMatches, skippedMatchesCount } = matchStats;

    if (!session.matches || session.matches.length === 0) return null;

    return (
      <Card className="p-4 bg-gray-50 dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {confirmedMatchesCount === 0
                ? t("messages.noGamesConfirmed")
                : t("messages.gamesConfirmed", {
                    confirmed: confirmedMatchesCount,
                    total: totalMatches,
                  })}
              {skippedMatchesCount > 0 &&
                t("messages.gamesSkipped", { skipped: skippedMatchesCount })}
            </p>
            {confirmedMatchesCount > 0 && confirmedMatchesCount < totalMatches && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {t("messages.pendingGames", {
                  pending: totalMatches - confirmedMatchesCount - skippedMatchesCount,
                })}
              </p>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onRestart}
              label={t("actions.cancelImport")}
            />
            {renderImportButton("primary")}
          </div>
        </div>
      </Card>
    );
  };

  const renderSuccessCard = () => {
    if (session.status !== "COMPLETED") return null;

    return (
      <Card className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
        <div className="flex items-center space-x-3">
          <div className="text-green-600 dark:text-green-400 text-lg">🎉</div>
          <div>
            <p className="font-medium text-green-800 dark:text-green-200">
              {t("results.successTitle")}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              {t("results.successMessage", { count: matchStats.confirmedMatchesCount })}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  if (!session) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>{t("errors.sessionNotFound")}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t("title")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t("matchesCount", {
                confirmed: matchStats.confirmedMatchesCount,
                total: matchStats.totalMatches,
              })}
            </p>

            <div className="mt-2">
              <span className={getStatusBadgeClass(session.status)}>
                {t("status.label")}: {getStatusText(session.status)}
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onRestart}
              label={t("actions.restart")}
            />
            {renderImportButton("primary")}
          </div>
        </div>
      </Card>

      {renderInstructionsCard()}

      <div className="space-y-4">{renderMatchesList()}</div>

      {renderSummaryCard()}
      {renderSuccessCard()}
    </div>
  );
}
