// components/organisms/PublicProfile/PublicProfileGameTable/PublicProfileGameTable.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { Pencil, Trash, CheckCircle2, Disc3, CloudDownload, ArrowLeftRight } from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { GameForm } from "@/components/organisms/_game/GameForm/GameForm";
import { useDeleteUserGame } from "@/hooks/usePublicProfile";
import { UserGame } from "@/@types/collection.types";
import { usePlatformsCache } from "@/hooks/usePlatformsCache";

interface PublicProfileGameTableProps {
  game: UserGame;
  isOwner: boolean;
}

export const PublicProfileGameTable = ({ game, isOwner }: PublicProfileGameTableProps) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { mutate: deleteGame, isPending } = useDeleteUserGame();
  const { platformsMap } = usePlatformsCache();

  const platformOptions = Object.entries(platformsMap).map(([id, name]) => ({
    value: id,
    label: name,
  }));

  const handleDelete = () => {
    deleteGame(game.id || 0);
  };

  return (
    <>
      <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative">
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
                  <span className="text-xl">🎮</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium dark:text-white">{game.gameTitle}</h3>
              {game.platformId && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {platformsMap[game.platformId]}
                </p>
              )}
            </div>
          </div>
        </td>
        <td className="p-4">
          {game.progress && game.progress > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">{game.progress * 10}%</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">-</span>
          )}
        </td>
        <td className="p-4">
          {game.price ? (
            <span className="font-bold text-secondary-600 dark:text-secondary-400">
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "BRL",
              }).format(game.price)}
            </span>
          ) : (
            <span className="text-sm text-gray-500">-</span>
          )}
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <div
              className="bg-gray-800/70 text-white p-1.5 rounded-full backdrop-blur-sm"
              aria-label="Media"
              title={game.media}
            >
              {game.media === "PHYSICAL" ? <Disc3 size={16} /> : <CloudDownload size={16} />}
            </div>

            {game.progress === 10 && (
              <div
                className="bg-green-500 text-white p-1.5 rounded-full"
                aria-label="Finished"
                title="Finished"
              >
                <CheckCircle2 size={16} />
              </div>
            )}

            {game.acceptsTrade && (
              <div
                className="bg-amber-500 text-white p-1.5 rounded-full"
                aria-label="Accepts Trade"
                title="Accepts Trade"
              >
                <ArrowLeftRight size={16} />
              </div>
            )}
          </div>
        </td>
        <td className="p-4">
          <div className="flex gap-2 flex-wrap">
            {game.hasBox && !game.hasManual && (
              <Badge status="info" size="sm">
                {t("withBox")}
              </Badge>
            )}

            {game.hasManual && !game.hasBox && (
              <Badge status="success" size="sm">
                {t("withManual")}
              </Badge>
            )}

            {game.hasManual && game.hasBox && (
              <Badge status="success" size="sm">
                CIB
              </Badge>
            )}
          </div>
        </td>
        {isOwner && (
          <td className="p-4">
            <div className="flex gap-2">
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
          gameId={game.gameId}
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
