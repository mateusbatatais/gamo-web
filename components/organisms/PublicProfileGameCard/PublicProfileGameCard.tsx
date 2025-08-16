// components/organisms/PublicProfile/PublicProfileGameCard/PublicProfileGameCard.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { UserGamePublic } from "@/@types/publicProfile";
import { Card } from "@/components/atoms/Card/Card";
import { Pencil, Trash } from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { GameForm } from "@/components/organisms/GameForm/GameForm";
import { useDeleteUserGame } from "@/hooks/usePublicProfile";

export const PublicProfileGameCard = ({
  game,
  isOwner,
  slug,
}: {
  game: UserGamePublic;
  isOwner: boolean;
  slug: string;
}) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { mutate: deleteGame, isPending } = useDeleteUserGame();

  const handleDelete = () => {
    deleteGame(game.id, {
      context: { slug },
    });
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow !p-0 relative">
        {isOwner && (
          <div className="absolute top-2 right-2 flex z-1">
            <Button
              onClick={() => setShowEditModal(true)}
              aria-label={t("editItem")}
              icon={<Pencil size={16} />}
              variant="transparent"
              size="sm"
            />
            <Button
              onClick={() => setShowDeleteModal(true)}
              disabled={isPending}
              variant="transparent"
              aria-label={t("deleteItem")}
              icon={<Trash size={16} />}
              size="sm"
            />
          </div>
        )}

        <div className="h-48 bg-gray-100 dark:bg-gray-700 relative">
          {game.photoMain ? (
            <Image
              src={game.photoMain}
              alt={game.gameTitle}
              fill
              sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw"
              className="object-contain"
              priority={true}
            />
          ) : game.gameImageUrl ? (
            <Image
              src={game.gameImageUrl}
              alt={game.gameTitle}
              fill
              sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw"
              className="object-contain"
              priority={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">🎮</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg dark:text-white line-clamp-1">
                {game.gameTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{t(`media.${game.media}`)}</p>
            </div>
          </div>

          {game.rating && (
            <div className="mt-2 flex items-center">
              <span className="text-sm font-medium dark:text-gray-300">{t("rating")}:</span>
              <span className="ml-1 font-bold dark:text-white">{game.rating}/10</span>
            </div>
          )}

          {game.price && (
            <p className="mt-2 font-bold dark:text-white">
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "BRL",
              }).format(game.price)}
            </p>
          )}

          <div className="mt-3 flex gap-2 flex-wrap">
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

            {game.acceptsTrade && (
              <Badge status="warning" size="sm">
                {t("acceptsTrade")}
              </Badge>
            )}
          </div>
        </div>
      </Card>

      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={t("editTitle")}
        size="xl"
      >
        <GameForm
          mode="edit"
          gameId={game.gameId}
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
          }}
          onSuccess={() => {
            setShowEditModal(false);
            // A invalidação é tratada pelo próprio GameForm
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
