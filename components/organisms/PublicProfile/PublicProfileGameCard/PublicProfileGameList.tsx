// components/organisms/PublicProfile/PublicProfileGameList/PublicProfileGameList.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import {
  Pencil,
  Trash,
  CheckCircle2,
  Disc3,
  CloudDownload,
  ArrowLeftRight,
  Star,
} from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { GameForm } from "@/components/organisms/_game/GameForm/GameForm";
import { useDeleteUserGame } from "@/hooks/usePublicProfile";
import { UserGame } from "@/@types/collection.types";
import Link from "next/link";
import { usePlatformsCache } from "@/hooks/usePlatformsCache";
import useGameDetails from "@/hooks/useGameDetails";
import { SelectOption } from "@/components/atoms/Select/Select";
import { FavoriteToggle } from "@/components/atoms/FavoriteToggle/FavoriteToggle";
import { useCatalogQueryKeys } from "@/hooks/useCatalogQueryKeys";

export const PublicProfileGameList = ({
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
        overflow-hidden hover:shadow-lg transition-shadow !p-4
        ${
          game.isFavorite
            ? "!border-primary-700 border-2 shadow-md shadow-primary-100 dark:shadow-primary-900/20"
            : "border border-gray-200 dark:border-gray-700"
        }
      `}
      >
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative">
            {game.photoMain ? (
              <Image
                src={game.photoMain}
                alt={game.gameTitle || ""}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : game.gameImageUrl ? (
              <Image
                src={game.gameImageUrl}
                alt={game.gameTitle || ""}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-2xl">👾</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <Link href={`/game/${game.gameSlug}`} target="_blank">
                  <h3 className="font-bold text-lg dark:text-white line-clamp-1 hover:text-primary-500">
                    {game.gameTitle}
                  </h3>
                </Link>
                {game.platformId && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {platformsMap[game.platformId]}
                  </p>
                )}
              </div>

              {isOwner && (
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
                    disabled={isPending}
                    variant="transparent"
                    aria-label={t("deleteItem")}
                    icon={<Trash size={16} />}
                    size="sm"
                  />
                </div>
              )}
            </div>

            {/* Resto do conteúdo permanece igual */}
            <div className="flex flex-wrap gap-4 items-center">
              {game.progress && game.progress > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t("progress")}</span>
                  <span className="text-sm font-medium">{game.progress * 10}%</span>
                </div>
              )}

              {game.price && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Preço</span>
                  <span className="font-bold text-secondary-600 dark:text-secondary-400 text-sm">
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: "BRL",
                    }).format(game.price)}
                  </span>
                </div>
              )}

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

                {game.rating && (
                  <div
                    className="bg-secondary-500 text-white flex items-center justify-center p-1 rounded-full"
                    aria-label="Rating"
                    title={`Rating ${game.rating / 2}/5`}
                  >
                    <Star size={12} className="fill-current mr-0.5" />
                    <span className="text-xs font-bold">{game.rating / 2}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 flex gap-2 flex-wrap">
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
          </div>
        </div>
      </Card>

      {/* Diálogos permanecem iguais */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} title={t("editTitle")}>
        <GameForm
          mode="edit"
          type={type}
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
