// components/organisms/PublicProfile/PublicProfileConsoleList/PublicProfileConsoleList.tsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/atoms/Badge/Badge";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import {
  ArrowLeftRight,
  Pencil,
  Trash,
  ChevronDown,
  ChevronUp,
  Disc3,
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
  Heart,
  Eye,
} from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { ConsoleForm } from "../../_console/ConsoleForm/ConsoleForm";
import { useDeleteUserConsole } from "@/hooks/usePublicProfile";
import { CollectionStatus, UserConsole } from "@/@types/collection.types";
import Link from "next/link";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { FavoriteToggle } from "@/components/atoms/FavoriteToggle/FavoriteToggle";
import { useCatalogQueryKeys } from "@/hooks/useCatalogQueryKeys";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

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

export const PublicProfileConsoleList = ({
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
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { mutate: deleteConsole, isPending } = useDeleteUserConsole();
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(consoleItem.photoMain);
  const { getConsolesQueryKey } = useCatalogQueryKeys();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleDelete = () => {
    deleteConsole(consoleItem.id || 0);
  };

  // Build modal URL
  const params = new URLSearchParams(searchParams.toString());
  params.set("console", String(consoleItem.id));
  const modalUrl = `${pathname}?${params.toString()}`;

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

  const canExpandAccessories = hasAccessories(consoleItem);
  const canExpandGames = Array.isArray(consoleItem.games) && consoleItem.games.length > 0;

  return (
    <>
      <Card
        className={`
        overflow-hidden hover:shadow-lg transition-shadow !p-4
        border border-gray-200 dark:border-gray-700
      `}
      >
        {!isOwner && consoleItem.isFavorite && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-full text-primary-500 shadow-sm">
              <Heart size={16} fill="currentColor" />
            </div>
          </div>
        )}
        <div className="flex items-center gap-4">
          <Link href={modalUrl} scroll={false}>
            <div
              className={`
                w-20 h-20 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative
                transition-all duration-300 ease-in-out cursor-pointer hover:scale-105
                ${
                  consoleItem.status === "PREVIOUSLY_OWNED"
                    ? "opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
                    : ""
                }
              `}
            >
              {safeImageUrl ? (
                <>
                  {isImageLoading && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center z-10">
                      <div className="w-6 h-6 border-4 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin" />
                    </div>
                  )}
                  <Image
                    src={safeImageUrl}
                    alt={`${consoleItem.consoleName} ${consoleItem.variantName}`}
                    fill
                    sizes="80px"
                    className={clsx(
                      "object-cover transition-opacity duration-500",
                      isImageLoading ? "opacity-0" : "opacity-100",
                    )}
                    onLoad={() => setIsImageLoading(false)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-2xl">🖥️</span>
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <Link href={`/console/${consoleItem.variantSlug}`} target="_blank">
                  <h3 className="font-bold text-lg dark:text-white line-clamp-1 hover:text-primary-500">
                    {consoleItem.consoleName}
                    {consoleItem.status === "PREVIOUSLY_OWNED" && (
                      <span className="text-sm text-gray-700 font-normal">
                        {" "}
                        ({t("previouslyOwned")})
                      </span>
                    )}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {consoleItem.variantName}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                {canExpandAccessories && onToggleAccessories && (
                  <Button
                    variant="secondary"
                    size="sm"
                    aria-expanded={isExpanded && expandedType === "accessories"}
                    onClick={onToggleAccessories}
                    className="flex items-center gap-2"
                  >
                    <div className="flex gap-1 flex-row">
                      <div className="flex items-center gap-1">
                        {accessorySummary?.sortedTypes.slice(0, 3).map(([typeSlug, count]) => (
                          <div key={typeSlug} className="flex items-center gap-1">
                            <span className="text-xs">{count}x</span>
                            {ACCESSORY_ICONS[typeSlug] || ACCESSORY_ICONS.others}
                          </div>
                        ))}
                        {accessorySummary && accessorySummary.sortedTypes.length > 3 && (
                          <span className="text-xs">...</span>
                        )}
                      </div>
                      {isExpanded && expandedType === "accessories" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </Button>
                )}
                {canExpandGames && onToggleGames && (
                  <Button
                    variant="primary"
                    size="sm"
                    aria-expanded={isExpanded && expandedType === "games"}
                    onClick={onToggleGames}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-1">
                      <Disc3 size={14} />
                      <span className="text-xs">{consoleItem.games?.length || 0}</span>
                      {isExpanded && expandedType === "games" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </Button>
                )}

                <Button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("console", String(consoleItem.id));
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  aria-label="Ver detalhes"
                  icon={<Eye size={16} />}
                  variant="secondary"
                  size="sm"
                />

                {isOwner && (
                  <>
                    <FavoriteToggle
                      itemId={consoleItem.consoleId}
                      itemType="CONSOLE"
                      isFavorite={consoleItem.isFavorite}
                      queryKey={getConsolesQueryKey()}
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
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              {consoleItem.price && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Preço</span>
                  <span className="font-bold text-secondary-600 dark:text-secondary-400 text-sm">
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: "BRL",
                    }).format(consoleItem.price)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
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
            </div>

            <div className="mt-2 flex gap-2 flex-wrap">
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
        </div>
      </Card>

      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`${t("editTitle")}: ${consoleItem.consoleName} - ${consoleItem.variantName}`}
      >
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
