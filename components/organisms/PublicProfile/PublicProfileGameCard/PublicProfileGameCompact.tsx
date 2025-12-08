// components/organisms/PublicProfile/PublicProfileGameCompact/PublicProfileGameCompact.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/atoms/Card/Card";
import { Pencil, Trash, Heart } from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { GameForm } from "@/components/organisms/_game/GameForm/GameForm";
import { useDeleteUserGame } from "@/hooks/usePublicProfile";
import { UserGame } from "@/@types/collection.types";
import { usePlatformsCache } from "@/hooks/usePlatformsCache";
import { useTranslations } from "next-intl";
import useGameDetails from "@/hooks/useGameDetails";
import { SelectOption } from "@/components/atoms/Select/Select";
import { FavoriteToggle } from "@/components/atoms/FavoriteToggle/FavoriteToggle";
import { useCatalogQueryKeys } from "@/hooks/useCatalogQueryKeys";
import { useUserGameMutation } from "@/hooks/useUserGameMutation";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { useUserGame } from "@/hooks/useUserGame";

export const PublicProfileGameCompact = ({
  game,
  isOwner,
  type,
}: {
  game: UserGame;
  isOwner?: boolean;
  type?: "collection" | "trade";
}) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { mutate: deleteGame, isPending: isDeletePending } = useDeleteUserGame();
  const { isPending: isSavePending } = useUserGameMutation();
  const { platformsMap } = usePlatformsCache();
  const { getGamesQueryKey } = useCatalogQueryKeys();

  const { data: fullGameData, isLoading: isLoadingGame } = useUserGame(game.id || 0, {
    enabled: showEditModal && isOwner && !!game.id,
  });

  const { data: gameDetails } = useGameDetails(game?.gameSlug || "");

  const platformOptions: SelectOption[] =
    gameDetails?.platforms?.map((platformId) => ({
      value: platformId.toString(),
      label: platformsMap[platformId],
    })) || [];

  const mergedGameData = {
    ...game,
    ...fullGameData,
    compatibleUserConsoleIds:
      fullGameData?.compatibleUserConsoleIds && fullGameData.compatibleUserConsoleIds.length > 0
        ? fullGameData.compatibleUserConsoleIds
        : game.compatibleUserConsoleIds,
  };

  const handleDelete = () => {
    deleteGame(game.id || 0);
  };

  return (
    <>
      <Card
        className={`
        overflow-hidden hover:shadow-lg transition-shadow !p-0 relative group aspect-square
        border border-gray-200 dark:border-gray-700
      `}
      >
        {!isOwner && game.isFavorite && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-full text-primary-500 shadow-sm">
              <Heart size={12} fill="currentColor" />
            </div>
          </div>
        )}
        {isOwner && (
          <div className="absolute top-2 right-2 flex z-10 opacity-0 group-hover:opacity-100 transition-opacity gap-1">
            <FavoriteToggle
              itemId={game.gameId}
              itemType="GAME"
              isFavorite={game.isFavorite}
              queryKey={getGamesQueryKey()}
              size="sm"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
            />
            <Button
              onClick={() => setShowEditModal(true)}
              aria-label={t("editItem")}
              icon={<Pencil size={12} />}
              variant="transparent"
              size="sm"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
            />
            <Button
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeletePending}
              variant="transparent"
              aria-label={t("deleteItem")}
              icon={<Trash size={12} />}
              size="sm"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
            />
          </div>
        )}

        <div
          className={`
            w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative
            transition-all duration-300 ease-in-out
            ${
              game.status === "PREVIOUSLY_OWNED"
                ? "opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
                : ""
            }
          `}
        >
          {game.photoMain ? (
            <Image
              src={game.photoMain}
              alt={game.gameTitle || ""}
              fill
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
              className="object-cover"
            />
          ) : game.gameImageUrl ? (
            <Image
              src={game.gameImageUrl}
              alt={game.gameTitle || ""}
              fill
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-2xl">👾</span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-xs font-medium text-center px-2 line-clamp-2">
            {game.gameTitle}
          </span>
        </div>
      </Card>

      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`${t("editTitle")}: ${game.gameTitle}`}
        subtitle={t("editDescription")}
        size="lg"
      >
        {isLoadingGame ? (
          <div className="flex justify-center p-8">
            <Spinner size={32} />
          </div>
        ) : (
          <GameForm
            mode="edit"
            type={type}
            gameId={game.id || 0}
            gameSlug={game.gameSlug || ""}
            platformOptions={platformOptions}
            initialData={{
              ...mergedGameData,
              compatibleUserConsoleIds: mergedGameData.compatibleUserConsoleIds,
            }}
            formId={`edit-game-form-${game.id}`}
            hideButtons
            onSuccess={() => {
              setShowEditModal(false);
            }}
            onCancel={() => setShowEditModal(false)}
          />
        )}
        <div className="flex justify-end gap-3 mt-6 border-t pt-4 dark:border-gray-700">
          <Button variant="outline" onClick={() => setShowEditModal(false)}>
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            form={`edit-game-form-${game.id}`}
            loading={isSavePending}
            disabled={isLoadingGame}
          >
            {t("save")}
          </Button>
        </div>
      </Dialog>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t("deleteTitle")}
        message={t("deleteMessage")}
        confirmText={t("deleteConfirm")}
        cancelText={t("cancel")}
        isLoading={isDeletePending}
      />
    </>
  );
};
