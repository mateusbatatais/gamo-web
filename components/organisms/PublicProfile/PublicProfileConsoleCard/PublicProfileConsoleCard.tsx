// components/organisms/PublicProfile/PublicProfileConsoleCard/PublicProfileConsoleCard.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { ArrowLeftRight, Pencil, Trash } from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { ConsoleForm } from "../../_console/ConsoleForm/ConsoleForm";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteUserConsole } from "@/hooks/usePublicProfile";
import { CollectionStatus, UserConsole } from "@/@types/collection.types";
import Link from "next/link";

export const PublicProfileConsoleCard = ({
  consoleItem,
  isOwner,
}: {
  consoleItem: UserConsole & { status: CollectionStatus };
  isOwner: boolean;
}) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: deleteConsole, isPending } = useDeleteUserConsole();

  const handleDelete = () => {
    deleteConsole(consoleItem.id || 0);
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
              <span className="text-4xl">🎮</span>
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
