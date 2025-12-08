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
  const { mutate: deleteGame, isPending } = useDeleteUserGame();
  const { platformsMap } = usePlatformsCache();
  const { getGamesQueryKey } = useCatalogQueryKeys();

  const { data: gameDetails } = useGameDetails(game?.gameSlug || "");

  const platformOptions: SelectOption[] =
    gameDetails?.platforms?.map((platformId) => ({
      value: platformId.toString(),
      label: platformsMap[platformId],
    })) || [];

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
              disabled={isPending}
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

      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} title={t("editTitle")}>
        <GameForm
          mode="edit"
          type={type}
          gameId={game.gameId}
          gameSlug={game.gameSlug || ""}
          platformOptions={platformOptions}
          initialData={{
            id: game.id,
            description: game.description || undefined,
            status: game.status,
            price: game.price || undefined,
            hasBox: game.hasBox || false,
            hasManual: game.hasManual || false,
            condition: game.condition || undefined,
            acceptsTrade: game.acceptsTrade || false,
            photoMain: game.photoMain || undefined,
            photos: game.photos || undefined,
            progress: game.progress || undefined,
            rating: game.rating || undefined,
            review: game.review || undefined,
            abandoned: game.abandoned || false,
            media: game.media,
            platformId: game.platformId,
            address: game.address,
            zipCode: game.zipCode,
            city: game.city,
            state: game.state,
            latitude: game.latitude,
            longitude: game.longitude,
            compatibleUserConsoleIds: game.compatibleUserConsoleIds,
          }}
          onSuccess={() => {
            setShowEditModal(false);
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Dialog>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t("deleteTitle")}
        message={t("deleteMessage")}
        confirmText={t("deleteConfirm")}
        cancelText={t("cancel")}
        isLoading={isPending}
      />
    </>
  );
};
