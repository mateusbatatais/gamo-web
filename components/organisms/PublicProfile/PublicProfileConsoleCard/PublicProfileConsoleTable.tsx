// components/organisms/PublicProfile/PublicProfileConsoleTable/PublicProfileConsoleTable.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Pencil, Trash, ChevronDown, ChevronRight, Eye } from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { ConsoleForm } from "../../_console/ConsoleForm/ConsoleForm";
import { useDeleteUserConsole } from "@/hooks/usePublicProfile";
import { CollectionStatus, UserConsole } from "@/@types/collection.types";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { FavoriteToggle } from "@/components/atoms/FavoriteToggle/FavoriteToggle";
import { useCatalogQueryKeys } from "@/hooks/useCatalogQueryKeys";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

// Tipos/guard locais (sem any)
type Accessory = { id: number; name: string; slug: string; photoMain?: string };
function hasAccessories(
  item: UserConsole,
): item is UserConsole & { accessories: ReadonlyArray<Accessory> } {
  const maybe = item as unknown as { accessories?: unknown };
  return Array.isArray(maybe.accessories) && maybe.accessories.length > 0;
}

interface PublicProfileConsoleTableProps {
  consoleItem: UserConsole & { status: CollectionStatus };
  isOwner?: boolean;
  isMarketGrid?: boolean;
  type?: "trade" | "collection";
  isExpanded?: boolean;
  expandedType?: "accessories" | "games" | null;
  onToggleAccessories?: () => void;
  onToggleGames?: () => void;
}

export const PublicProfileConsoleTable = ({
  consoleItem,
  isOwner,
  isMarketGrid = false,
  isExpanded = false,
  expandedType,
  type,
  onToggleAccessories,
  onToggleGames,
}: PublicProfileConsoleTableProps) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  const canExpandAccessories = hasAccessories(consoleItem);
  const canExpandGames = Array.isArray(consoleItem.games) && consoleItem.games.length > 0;
  const canExpand = canExpandAccessories || canExpandGames;

  return (
    <>
      <tr
        className={`
        border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800
        ${consoleItem.isFavorite ? "bg-primary-50 dark:bg-primary-900/20" : ""}
      `}
      >
        <td className="p-2 w-10">
          {canExpand && (
            <div className="flex gap-1">
              {canExpandAccessories && onToggleAccessories && (
                <Button
                  variant="secondary"
                  size="sm"
                  aria-expanded={isExpanded && expandedType === "accessories"}
                  onClick={onToggleAccessories}
                  title="Acessórios"
                >
                  {isExpanded && expandedType === "accessories" ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </Button>
              )}
              {canExpandGames && onToggleGames && (
                <Button
                  variant="primary"
                  size="sm"
                  aria-expanded={isExpanded && expandedType === "games"}
                  onClick={onToggleGames}
                  title="Jogos"
                >
                  {isExpanded && expandedType === "games" ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </Button>
              )}
            </div>
          )}
        </td>

        <td className="py-1">
          <div className="flex items-center gap-3">
            <Link href={modalUrl} scroll={false}>
              <div
                className={`
                  w-12 h-12 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative
                  transition-all duration-300 ease-in-out cursor-pointer hover:scale-105
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
                    sizes="48px"
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-xl">🖥️</span>
                  </div>
                )}
              </div>
            </Link>
            <div>
              <h3 className="font-medium dark:text-white">
                {consoleItem.consoleName}
                {consoleItem.status === "PREVIOUSLY_OWNED" && (
                  <span className="text-sm text-gray-700 font-normal">
                    {" "}
                    ({t("previouslyOwned")})
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{consoleItem.variantName}</p>
            </div>
          </div>
        </td>

        <td className="p-2">{consoleItem.skinName}</td>

        {isMarketGrid && (
          <>
            <td className="p-2">
              {consoleItem.price ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "BRL",
                  }).format(consoleItem.price)}
                </p>
              ) : (
                <span className="text-sm text-gray-500">-</span>
              )}
            </td>
            <td className="p-2">
              {consoleItem.condition ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">{consoleItem.condition}</p>
              ) : (
                <span className="text-sm text-gray-500">-</span>
              )}
            </td>
            <td className="p-2">
              <div className="flex items-center gap-2">
                {consoleItem.acceptsTrade ? (
                  <span className="text-sm text-green-600">Sim</span>
                ) : (
                  <span className="text-sm text-gray-500">Não</span>
                )}
              </div>
            </td>
          </>
        )}

        <td className="p-2">
          <div className="flex gap-2">
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
                  variant="transparent"
                  aria-label={t("deleteItem")}
                  icon={<Trash size={16} />}
                  size="sm"
                />
              </>
            )}
          </div>
        </td>
      </tr>

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
