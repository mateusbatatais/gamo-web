// components/organisms/PublicProfile/PublicProfileConsoleCard/PublicProfileConsoleCard.tsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
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

// Tipos/guard locais (sem any)
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
  onToggleAccessories,
}: {
  consoleItem: UserConsole & { status: CollectionStatus };
  isOwner: boolean;
  isExpanded?: boolean;
  onToggleAccessories?: () => void;
}) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: deleteConsole, isPending } = useDeleteUserConsole();

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
        <div className="h-48 bg-gray-100 dark:bg-gray-700 relative">
          {consoleItem.photoMain ? (
            <Image
              src={consoleItem.photoMain}
              alt={`${consoleItem.consoleName} ${consoleItem.variantName}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw"
              className="object-cover"
              priority={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">🖥️</span>
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

          {canExpand && onToggleAccessories && (
            <div className="mt-2 flex justify-center">
              <Button
                variant="secondary"
                size="sm"
                aria-expanded={!!isExpanded}
                onClick={onToggleAccessories}
                className="flex items-center gap-2 w-full"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5">
                    {accessorySummary?.sortedTypes.map(([typeSlug, count]) => (
                      <div key={typeSlug} className="flex items-center gap-0.5">
                        <span className="text-xs">{count}x</span>
                        {ACCESSORY_ICONS[typeSlug] || ACCESSORY_ICONS.others}
                      </div>
                    ))}
                  </div>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} title={t("editTitle")}>
        <ConsoleForm
          mode="edit"
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
