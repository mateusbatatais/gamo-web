// components/organisms/PublicProfile/PublicProfileConsoleTable/PublicProfileConsoleTable.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Pencil, Trash, ChevronDown, ChevronRight } from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { ConsoleForm } from "../../_console/ConsoleForm/ConsoleForm";
import { useDeleteUserConsole } from "@/hooks/usePublicProfile";
import { CollectionStatus, UserConsole } from "@/@types/collection.types";

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
  isOwner: boolean;
  isMarketGrid?: boolean;

  // suporte ao toggle vindo do Grid
  isExpanded?: boolean;
  onToggleAccessories?: () => void;
}

export const PublicProfileConsoleTable = ({
  consoleItem,
  isOwner,
  isMarketGrid = false,
  isExpanded = false,
  onToggleAccessories,
}: PublicProfileConsoleTableProps) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { mutate: deleteConsole, isPending } = useDeleteUserConsole();

  const handleDelete = () => {
    deleteConsole(consoleItem.id || 0);
  };

  const canExpand = hasAccessories(consoleItem);

  return (
    <>
      <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
        {/* Coluna do expander - só exibe se houver acessórios */}
        <td className="p-2 w-10">
          {onToggleAccessories && canExpand && (
            <Button
              variant="transparent"
              size="sm"
              aria-expanded={isExpanded}
              onClick={onToggleAccessories}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Button>
          )}
        </td>

        <td className="py-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative">
              {consoleItem.photoMain ? (
                <Image
                  src={consoleItem.photoMain}
                  alt={`${consoleItem.consoleName} ${consoleItem.variantName}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-xl">🖥️</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium dark:text-white">{consoleItem.consoleName}</h3>
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

        {isOwner && (
          <td className="p-2">
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
