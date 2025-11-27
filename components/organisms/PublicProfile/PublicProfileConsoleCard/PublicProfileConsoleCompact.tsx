// components/organisms/PublicProfile/PublicProfileConsoleCompact/PublicProfileConsoleCompact.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/atoms/Card/Card";
import { Pencil, Trash, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { ConsoleForm } from "../../_console/ConsoleForm/ConsoleForm";
import { useDeleteUserConsole } from "@/hooks/usePublicProfile";
import { CollectionStatus, UserConsole } from "@/@types/collection.types";
import { useTranslations } from "next-intl";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { FavoriteToggle } from "@/components/atoms/FavoriteToggle/FavoriteToggle";
import { useCatalogQueryKeys } from "@/hooks/useCatalogQueryKeys";

type Accessory = { id: number; name: string; slug: string; photoMain?: string };
function hasAccessories(
  item: UserConsole,
): item is UserConsole & { accessories: ReadonlyArray<Accessory> } {
  const maybe = item as unknown as { accessories?: unknown };
  return Array.isArray(maybe.accessories) && maybe.accessories.length > 0;
}

export const PublicProfileConsoleCompact = ({
  consoleItem,
  isOwner,
  isExpanded,
  expandedType,
  type,
  onToggleAccessories,
  onToggleGames,
}: {
  consoleItem: UserConsole & { status: CollectionStatus };
  isOwner?: boolean;
  isExpanded?: boolean;
  expandedType?: "accessories" | "games" | null;
  type?: "trade" | "collection";
  onToggleAccessories?: () => void;
  onToggleGames?: () => void;
}) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { mutate: deleteConsole, isPending } = useDeleteUserConsole();
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(consoleItem.photoMain);
  const { getConsolesQueryKey } = useCatalogQueryKeys();

  const handleDelete = () => {
    deleteConsole(consoleItem.id || 0);
  };

  const canExpandAccessories = hasAccessories(consoleItem);
  const canExpandGames = Array.isArray(consoleItem.games) && consoleItem.games.length > 0;
  const canExpand = canExpandAccessories || canExpandGames;

  return (
    <>
      <Card
        className={`
        overflow-hidden hover:shadow-lg transition-shadow !p-0 relative group aspect-square
        border border-gray-200 dark:border-gray-700
      `}
      >
        {!isOwner && consoleItem.isFavorite && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-full text-primary-500 shadow-sm">
              <Heart size={12} fill="currentColor" />
            </div>
          </div>
        )}
        {isOwner && (
          <div className="absolute top-2 right-2 flex z-20 opacity-0 group-hover:opacity-100 transition-opacity gap-1">
            <FavoriteToggle
              itemId={consoleItem.consoleId}
              itemType="CONSOLE"
              isFavorite={consoleItem.isFavorite}
              queryKey={getConsolesQueryKey()}
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

        {canExpand && (
          <div className="absolute bottom-0 left-0 right-0 w-full z-20 flex gap-0.5">
            {canExpandAccessories && onToggleAccessories && (
              <Button
                variant="secondary"
                size="sm"
                aria-expanded={isExpanded && expandedType === "accessories"}
                onClick={onToggleAccessories}
                icon={
                  isExpanded && expandedType === "accessories" ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )
                }
                className="flex-1 opacity-70 hover:opacity-100 rounded-t-none"
              ></Button>
            )}
            {canExpandGames && onToggleGames && (
              <Button
                variant="primary"
                size="sm"
                aria-expanded={isExpanded && expandedType === "games"}
                onClick={onToggleGames}
                icon={
                  isExpanded && expandedType === "games" ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )
                }
                className="flex-1 opacity-70 hover:opacity-100 rounded-t-none"
              ></Button>
            )}
          </div>
        )}

        <div
          className={`
            w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative
            transition-all duration-300 ease-in-out
            ${
              consoleItem.status === "PREVIOUSLY_OWNED"
                ? "opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
                : ""
            }
          `}
        >
          {safeImageUrl ? (
            <Image
              src={safeImageUrl}
              alt={`${consoleItem.consoleName} ${consoleItem.variantName}`}
              fill
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-2xl">🖥️</span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
          <span className="text-white text-xs font-medium text-center px-2 line-clamp-2">
            {consoleItem.consoleName}
            {consoleItem.variantName && ` (${consoleItem.variantName})`}
          </span>
        </div>
      </Card>

      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} title={t("editTitle")}>
        <ConsoleForm
          mode="edit"
          type={type}
          consoleId={consoleItem.consoleId}
          consoleVariantId={consoleItem.consoleVariantId}
          variantSlug={consoleItem.variantSlug}
          skinId={consoleItem.skinId}
          initialData={{
            id: consoleItem.id,
            description: consoleItem.description,
            status: consoleItem.status,
            price: consoleItem.price,
            hasBox: consoleItem.hasBox,
            hasManual: consoleItem.hasManual,
            condition: consoleItem.condition,
            acceptsTrade: consoleItem.acceptsTrade,
            photoMain: consoleItem.photoMain,
            photos: consoleItem.photos,
            storageOptionId: consoleItem.storageOption?.id,
            address: consoleItem.address,
            zipCode: consoleItem.zipCode,
            city: consoleItem.city,
            state: consoleItem.state,
            latitude: consoleItem.latitude,
            longitude: consoleItem.longitude,
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
