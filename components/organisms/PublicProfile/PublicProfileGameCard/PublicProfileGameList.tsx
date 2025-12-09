// components/organisms/PublicProfile/PublicProfileGameList/PublicProfileGameList.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/atoms/Badge/Badge";
import clsx from "clsx";
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
import TruncatedText from "@/components/atoms/TruncatedText/TruncatedText";
import { useUserGameMutation } from "@/hooks/useUserGameMutation";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { useUserGame } from "@/hooks/useUserGame";

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
  const [isImageLoading, setIsImageLoading] = useState(true);
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

  const handleDelete = () => {
    deleteGame(game.id || 0, {
      onSuccess: () => {
        setShowDeleteModal(false);
      },
    });
  };

  const mergedGameData = {
    ...game,
    ...fullGameData,
    compatibleUserConsoleIds:
      fullGameData?.compatibleUserConsoleIds && fullGameData.compatibleUserConsoleIds.length > 0
        ? fullGameData.compatibleUserConsoleIds
        : game.compatibleUserConsoleIds,
  };

  return (
    <>
      <Card
        className={`
        overflow-hidden hover:shadow-lg transition-shadow !p-4
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
        <div className="flex items-start gap-4">
          <div
            className={`
              w-20 h-20 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative
              transition-all duration-300 ease-in-out
              ${
                game.status === "PREVIOUSLY_OWNED"
                  ? "opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
                  : ""
              }
            `}
          >
            {game.photoMain ? (
              <>
                {isImageLoading && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-4 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin" />
                  </div>
                )}
                <Image
                  src={game.photoMain}
                  alt={game.gameTitle || ""}
                  fill
                  sizes="80px"
                  className={clsx(
                    "object-cover transition-opacity duration-500",
                    isImageLoading ? "opacity-0" : "opacity-100",
                  )}
                  onLoad={() => setIsImageLoading(false)}
                />
              </>
            ) : game.gameImageUrl ? (
              <>
                {isImageLoading && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-4 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin" />
                  </div>
                )}
                <Image
                  src={game.gameImageUrl}
                  alt={game.gameTitle || ""}
                  fill
                  sizes="80px"
                  className={clsx(
                    "object-cover transition-opacity duration-500",
                    isImageLoading ? "opacity-0" : "opacity-100",
                  )}
                  onLoad={() => setIsImageLoading(false)}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-2xl">👾</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <Link href={`/game/${game.gameSlug}`} target="_blank">
                  <h3 className="font-bold text-xs sm:text-lg dark:text-white line-clamp-2 hover:text-primary-500">
                    {game.gameTitle}
                    {game.platformId && (
                      <span className="text-sm text-gray-700 font-normal">
                        {" "}
                        ({platformsMap[game.platformId]})
                      </span>
                    )}

                    {game.status === "PREVIOUSLY_OWNED" && (
                      <span className="text-sm text-gray-700 font-normal">
                        {" "}
                        ({t("previouslyOwned")})
                      </span>
                    )}
                  </h3>
                </Link>
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
                    disabled={isDeletePending}
                    variant="transparent"
                    aria-label={t("deleteItem")}
                    icon={<Trash size={16} />}
                    size="sm"
                  />
                </div>
              )}
            </div>

            {game.review && <TruncatedText text={game.review} maxLength={150} className="mb-1" />}

            <div className="flex flex-wrap gap-4 items-center">
              {game.progress && game.progress > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t("progress")}</span>
                  <span className="text-sm font-medium">{game.progress * 10}%</span>
                </div>
              ) : (
                ""
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

      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`${t("editTitle")}: ${game.gameTitle}`}
        subtitle={t("editDescription")}
        size="lg"
        actionButtons={{
          confirm: {
            label: t("save"),
            type: "submit",
            form: `edit-game-form-${game.id}`,
            loading: isSavePending,
            disabled: isLoadingGame,
          },
          cancel: {
            label: t("cancel"),
            onClick: () => setShowEditModal(false),
            disabled: isSavePending || isLoadingGame,
          },
        }}
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
