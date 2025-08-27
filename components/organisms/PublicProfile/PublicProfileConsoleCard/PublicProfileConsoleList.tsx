// components/organisms/PublicProfile/PublicProfileConsoleList/PublicProfileConsoleList.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { Pencil, Trash, ArrowLeftRight } from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { ConsoleForm } from "../../_console/ConsoleForm/ConsoleForm";
import { useDeleteUserConsole } from "@/hooks/usePublicProfile";
import { CollectionStatus, UserConsole } from "@/@types/collection.types";
import Link from "next/link";

export const PublicProfileConsoleList = ({
  consoleItem,
  isOwner,
}: {
  consoleItem: UserConsole & { status: CollectionStatus };
  isOwner: boolean;
}) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { mutate: deleteConsole, isPending } = useDeleteUserConsole();

  const handleDelete = () => {
    deleteConsole(consoleItem.id || 0);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow !p-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative">
            {consoleItem.photoMain ? (
              <Image
                src={consoleItem.photoMain}
                alt={`${consoleItem.consoleName} ${consoleItem.variantName}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-2xl">🎮</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <Link href={`/console/${consoleItem.variantSlug}`} target="_blank">
                  <h3 className="font-bold text-lg dark:text-white line-clamp-1 hover:text-primary-500">
                    {consoleItem.consoleName}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {consoleItem.variantName}
                </p>
              </div>

              {isOwner && (
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
                    disabled={isPending}
                    variant="transparent"
                    aria-label={t("deleteItem")}
                    icon={<Trash size={16} />}
                    size="sm"
                  />
                </div>
              )}
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
