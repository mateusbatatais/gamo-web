// components/organisms/PublicProfile/PublicProfileConsoleCard/PublicProfileConsoleCard.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Badge } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import {
  ArrowLeftRight,
  Pencil,
  Trash,
  ChevronDown,
  ChevronUp,
  Gamepad,
  Move3d,
  RectangleGoggles,
  Music,
  ShipWheel,
  Battery,
  Headphones,
  HardDrive,
  Mouse,
  Cog,
  Package,
} from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { ConsoleForm } from "../../_console/ConsoleForm/ConsoleForm";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteUserConsole } from "@/hooks/usePublicProfile";
import { CollectionStatus, UserConsole } from "@/@types/collection.types";
import Link from "next/link";
import { SafeImage } from "@/components/atoms/SafeImage/SafeImage";
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

const ACCESSORY_ICONS: Record<string, React.ReactNode> = {
  controllers: <Gamepad size={16} />,
  "motion-sensors": <Move3d size={16} />,
  "vr-ar": <RectangleGoggles size={16} />,
  instruments: <Music size={16} />,
  simulation: <ShipWheel size={16} />,
  "power-charging": <Battery size={16} />,
  "audio-communication": <Headphones size={16} />,
  "storage-expansion": <HardDrive size={16} />,
  "alternative-input": <Mouse size={16} />,
  "support-organization": <Cog size={16} />,
  others: <Package size={16} />,
};

export const PublicProfileConsoleCard = ({
  consoleItem,
  isOwner,
  isExpanded,
  type,
  onToggleAccessories,
}: {
  consoleItem: UserConsole & { status: CollectionStatus };
  isOwner?: boolean;
  isExpanded?: boolean;
  type?: "trade" | "collection";
  onToggleAccessories?: () => void;
}) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: deleteConsole, isPending } = useDeleteUserConsole();
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(consoleItem.photoMain);
  const { getConsolesQueryKey } = useCatalogQueryKeys();

  const handleDelete = () => {
    deleteConsole(consoleItem.id || 0);
  };

  const accessorySummary = useMemo(() => {
    if (!hasAccessories(consoleItem)) return null;

    const typeCounts: Record<string, number> = {};

    consoleItem.accessories.forEach((acc) => {
      const typeSlug = acc.typeSlug || "others";
      typeCounts[typeSlug] = (typeCounts[typeSlug] || 0) + 1;
    });

    const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

    return { sortedTypes };
  }, [consoleItem.accessories]);

  const canExpand = hasAccessories(consoleItem);

  return (
    <>
      <Card
        className={`
        overflow-hidden hover:shadow-lg transition-shadow !p-0 relative
        ${
          consoleItem.isFavorite
            ? "!border-primary-700 border-2 shadow-md shadow-primary-100 dark:shadow-primary-900/20"
            : "border border-gray-200 dark:border-gray-700"
        }
      `}
      >
        {isOwner && (
          <div className="absolute top-2 right-2 flex z-1 gap-1">
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
              icon={<Pencil size={16} />}
              variant="transparent"
              size="sm"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
            />
            <Button
              onClick={() => setShowDeleteModal(true)}
              disabled={isPending}
              variant="transparent"
              aria-label={t("deleteItem")}
              icon={<Trash size={16} />}
              size="sm"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
            />
          </div>
        )}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2 items-start">
          {consoleItem.acceptsTrade && (
            <div
              className="bg-amber-500 text-white p-1.5 rounded-full"
              aria-label="Accepts Trade"
              title="Accepts Trade"
            >
              <ArrowLeftRight size={16} />
            </div>
          )}
        </div>
        <div
          className={`
            h-48 bg-gray-100 dark:bg-gray-700 relative 
            transition-all duration-300 ease-in-out
            ${
              consoleItem.status === "PREVIOUSLY_OWNED"
                ? "opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
                : ""
            }
          `}
        >
          <SafeImage
            src={safeImageUrl}
            alt={`${consoleItem.consoleName} ${consoleItem.variantName}`}
            sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw"
            className="object-cover"
            priority={true}
          />

          {consoleItem.status === "PREVIOUSLY_OWNED" && (
            <div className="absolute bottom-2 left-2 z-10">
              <div className="bg-gray-600/90 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                {t("previouslyOwned")}
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <Link href={`/console/${consoleItem.variantSlug}`} target="_blank">
                <h3 className="font-semibold text-lg dark:text-white hover:text-primary-500">
                  {consoleItem.consoleName}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-gray-300">{consoleItem.variantName}</p>
            </div>
          </div>

          {consoleItem.skinName && (
            <p className="mt-2 text-sm dark:text-gray-400">
              <span className="font-medium dark:text-gray-300">{t("skin")}:</span>
              {consoleItem.skinName}
            </p>
          )}

          {consoleItem.price && (
            <p className="font-bold text-secondary-600 dark:text-secondary-400">
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "BRL",
              }).format(consoleItem.price)}
            </p>
          )}

          <div className="mt-3 flex gap-2 flex-wrap">
            {consoleItem.hasBox && !consoleItem.hasManual && (
              <Badge status="info" size="sm">
                {t("withBox")}
              </Badge>
            )}

            {consoleItem.hasManual && !consoleItem.hasBox && (
              <Badge status="success" size="sm">
                {t("withManual")}
              </Badge>
            )}

            {consoleItem.hasManual && consoleItem.hasBox && (
              <Badge status="success" size="sm">
                CIB
              </Badge>
            )}
          </div>
        </div>
        {canExpand && onToggleAccessories && (
          <div className="mt-2 flex justify-center">
            <Button
              variant="secondary"
              size="sm"
              aria-expanded={!!isExpanded}
              onClick={onToggleAccessories}
              className="flex gap-2 w-full"
            >
              <div className="flex flex-row gap-1 justify-space-between w-full">
                <div className="flex  gap-1.5">
                  {accessorySummary?.sortedTypes.slice(0, 3).map(([typeSlug, count]) => (
                    <div key={typeSlug} className="flex items-center gap-0.5">
                      <span className="text-xs">{count}x</span>
                      {ACCESSORY_ICONS[typeSlug] || ACCESSORY_ICONS.others}
                    </div>
                  ))}
                  {accessorySummary && accessorySummary.sortedTypes.length > 3 && (
                    <span className="text-xs">...</span>
                  )}
                </div>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </Button>
          </div>
        )}
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
          }}
          onSuccess={() => {
            setShowEditModal(false);
            queryClient.invalidateQueries({
              queryKey: ["userConsolesPublic", consoleItem.user?.slug],
            });
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
