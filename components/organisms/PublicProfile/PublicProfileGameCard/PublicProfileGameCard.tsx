// components/organisms/PublicProfile/PublicProfileGameCard/PublicProfileGameCard.tsx
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
  Heart,
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
import { usePathname, useSearchParams } from "next/navigation";
import { useUserGameMutation } from "@/hooks/useUserGameMutation";

export const PublicProfileGameCard = ({
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
  const { isPending } = useUserGameMutation();
  const { platformsMap } = usePlatformsCache();
  const { getGamesQueryKey } = useCatalogQueryKeys();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: gameDetails } = useGameDetails(game?.gameSlug || "");

  const platformOptions: SelectOption[] =
    gameDetails?.platforms?.map((platformId) => ({
      value: platformId.toString(),
      label: platformsMap[platformId],
    })) || [];

  const handleDelete = () => {
    deleteGame(game.id || 0);
  };

  // Build modal URL
  const params = new URLSearchParams(searchParams.toString());
  params.set("game", String(game.id));
  const modalUrl = `${pathname}?${params.toString()}`;

  return (
    <>
      <Card
        className={`
        overflow-hidden hover:shadow-lg transition-shadow !p-0 relative group
        border border-gray-200 dark:border-gray-700
      `}
      >
        {!isOwner && game.isFavorite && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-full text-primary-500 shadow-sm">
              <Heart size={16} fill="currentColor" />
            </div>
          </div>
        )}
        {isOwner && (
          <div className="absolute top-2 right-2 flex z-10 gap-1">
            {/* Botão de favorito */}
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
              icon={<Pencil size={16} />}
              variant="transparent"
              size="sm"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
            />
            <Button
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeletePending}
              variant="transparent"
              aria-label={t("deleteItem")}
              icon={<Trash size={16} />}
              size="sm"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
            />
          </div>
        )}

        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2 items-start">
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

        <div
          className={`
            h-48 bg-gray-100 dark:bg-gray-700 relative 
            transition-all duration-300 ease-in-out
            ${
              game.status === "PREVIOUSLY_OWNED"
                ? "opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
                : ""
            }
          `}
        >
          <Link href={modalUrl} scroll={false}>
            {game.photoMain ? (
              <Image
                src={game.photoMain}
                alt={game.gameTitle || ""}
                fill
                sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw"
                className="object-cover cursor-pointer hover:scale-105 transition-transform"
                priority={true}
              />
            ) : game.gameImageUrl ? (
              <Image
                src={game.gameImageUrl}
                alt={game.gameTitle || ""}
                fill
                sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw"
                className="object-cover cursor-pointer hover:scale-105 transition-transform"
                priority={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-4xl">👾</span>
              </div>
            )}
          </Link>
          {game.status === "PREVIOUSLY_OWNED" && (
            <div className="absolute bottom-2 left-2 z-10">
              <div className="bg-gray-600/90 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                {t("previouslyOwned")}
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <Link href={`/game/${game.gameSlug}`} target="_blank">
                <h3 className="font-bold text-lg dark:text-white line-clamp-2 hover:text-primary-500">
                  {game.gameTitle}
                </h3>
              </Link>
              {game.platformId && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {platformsMap[game.platformId]}
                </p>
              )}
            </div>
          </div>

          {game.progress && game.progress > 0 && game.progress < 10 ? (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>{t("progress")}</span>
                <span>{game.progress * 10}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${game.progress * 10}%` }}
                ></div>
              </div>
            </div>
          ) : null}

          <div className="flex justify-between items-center mb-3">
            {game.price && (
              <p className="font-bold text-secondary-600 dark:text-secondary-400">
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "BRL",
                }).format(game.price)}
              </p>
            )}
          </div>

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
          </div>
        </div>
      </Card>

      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={t("editTitle")}
        actionButtons={{
          confirm: {
            label: t("saveChanges"),
            type: "submit",
            form: `edit-game-form-${game.id}`,
            // We use the mutation state here. However, to get isPending for UPDATE,
            // we need to access it. Currently useDeleteUserGame is used, let's verify if we can get update status.
            // GameForm uses useUserGameMutation inside.
            // To properly show loading on the parent button, we should ideally hoist the mutation or expose loading state.
            // For now, let's assume the mutation is fast or the user sees the internal loading if any.
            // BUT, since we are hiding internal buttons, we MUST show loading here.
            // So we need to import useUserGameMutation here too? No, GameForm submits it.
            // We need to pass loading state up? Or just use isPending from a hook here?
            // Let's import useUserGameMutation here.
            loading: isPending,
          },
          cancel: {
            label: t("cancel"),
            onClick: () => setShowEditModal(false),
            disabled: isPending,
          },
        }}
      >
        <GameForm
          mode="edit"
          type={type}
          gameId={game.id || 0}
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
          formId={`edit-game-form-${game.id}`}
          hideButtons
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
        isLoading={isDeletePending}
      />
    </>
  );
};
