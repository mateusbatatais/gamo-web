// components/organisms/PublicProfile/PublicProfileGameTable/PublicProfileGameTable.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Pencil, Trash } from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { GameForm } from "@/components/organisms/_game/GameForm/GameForm";
import { useDeleteUserGame } from "@/hooks/usePublicProfile";
import { UserGame } from "@/@types/collection.types";
import { usePlatformsCache } from "@/hooks/usePlatformsCache";
import useGameDetails from "@/hooks/useGameDetails";
import { SelectOption } from "@/components/atoms/Select/Select";
import { FavoriteToggle } from "@/components/atoms/FavoriteToggle/FavoriteToggle";
import { useCatalogQueryKeys } from "@/hooks/useCatalogQueryKeys";

interface PublicProfileGameTableProps {
  game: UserGame;
  isOwner?: boolean;
  isMarketGrid?: boolean;
  type?: "collection" | "trade";
}

export const PublicProfileGameTable = ({
  game,
  type,
  isOwner,
  isMarketGrid = false,
}: PublicProfileGameTableProps) => {
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
      <tr
        className={`
        border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800
        ${game.isFavorite ? "bg-primary-50 dark:bg-primary-900/20" : ""}
      `}
      >
        <td className="py-1">
          <div className="flex items-center gap-3">
            <div
              className={`
              w-12 h-12 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative
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
                  sizes="48px"
                  className="object-cover"
                />
              ) : game.gameImageUrl ? (
                <Image
                  src={game.gameImageUrl}
                  alt={game.gameTitle || ""}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-xl">👾</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium dark:text-white">
                {game.gameTitle}
                {game.status === "PREVIOUSLY_OWNED" && (
                  <span className="text-sm text-gray-700 font-normal">
                    {" "}
                    ({t("previouslyOwned")})
                  </span>
                )}
              </h3>
            </div>
          </div>
        </td>
        <td className="p-2">
          {game.platformId && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {platformsMap[game.platformId]}
            </p>
          )}
        </td>
        {!isMarketGrid && (
          <td className="p-2">
            {game.progress && game.progress > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">{game.progress * 10}%</span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">-</span>
            )}
          </td>
        )}

        {isMarketGrid && (
          <>
            <td className="p-2">
              {game.price ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "BRL",
                  }).format(game.price)}
                </p>
              ) : (
                <span className="text-sm text-gray-500">-</span>
              )}
            </td>
            <td className="p-2">
              {game.condition ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">{game.condition}</p>
              ) : (
                <span className="text-sm text-gray-500">-</span>
              )}
            </td>
            <td className="p-2">
              <div className="flex items-center gap-2">
                {game.acceptsTrade ? (
                  <span className="text-sm text-green-600">Sim</span>
                ) : (
                  <span className="text-sm text-gray-500">Não</span>
                )}
              </div>
            </td>
          </>
        )}

        <td className="p-2">
          <div className="flex items-center gap-2">
            <div aria-label="Media" title={game.media}>
              {game.media}
            </div>
          </div>
        </td>
        {isOwner && (
          <td className="p-2">
            <div className="flex gap-2">
              <FavoriteToggle
                itemId={game.gameId}
                itemType="GAME"
                isFavorite={game.isFavorite}
                queryKey={getGamesQueryKey()}
                size="sm"
              />
              <Button
                onClick={() => setShowEditModal(true)}
                aria-label={t("editItem")}
                icon={<Pencil size={16} />}
                variant="transparent"
                size="sm"
              />
              <Button
                onClick={() => setShowDeleteModal(true)}
                variant="transparent"
                aria-label={t("deleteItem")}
                icon={<Trash size={16} />}
                size="sm"
              />
            </div>
          </td>
        )}
      </tr>

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
