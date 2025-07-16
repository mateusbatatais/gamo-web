// components/organisms/PublicProfile/PublicProfileConsoleCard/PublicProfileConsoleCard.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { ConsoleStatus, UserConsolePublic } from "@/@types/publicProfile";
import { Card } from "@/components/atoms/Card/Card";
import { Pencil, Trash } from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { apiFetch } from "@/utils/api";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { EditConsoleForm } from "../../EditConsoleForm/EditConsoleForm";

export const PublicProfileConsoleCard = ({
  consoleItem,
  isOwner,
}: {
  consoleItem: UserConsolePublic & { status: ConsoleStatus["Status"] };
  isOwner: boolean;
}) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { showToast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await apiFetch(`/user-consoles/${consoleItem.id}`, {
        method: "DELETE",
        token,
      });
      showToast(t("deleteSuccess"), "success");
    } catch {
      showToast(t("deleteError"), "danger");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow !p-0 relative">
        {isOwner && (
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <Button
              className="bg-white dark:bg-gray-800 p-1 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setShowEditModal(true)}
              aria-label={t("editItem")}
              icon={<Pencil size={16} />}
            ></Button>
            <Button
              className="bg-white dark:bg-gray-800 p-1 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
              aria-label={t("deleteItem")}
              icon={<Trash size={16} />}
            ></Button>
          </div>
        )}

        <div className="h-48 bg-gray-100 dark:bg-gray-700 relative">
          {consoleItem.photoMain ? (
            <Image
              src={consoleItem.photoMain}
              alt={`${consoleItem.consoleName} ${consoleItem.variantName}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw"
              className="object-contain"
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
              <h3 className="font-semibold text-lg dark:text-white">{consoleItem.consoleName}</h3>
              <p className="text-gray-600 dark:text-gray-300">{consoleItem.variantName}</p>
            </div>
          </div>

          {consoleItem.skinName && (
            <p className="mt-2 text-sm dark:text-gray-400">
              <span className="font-medium dark:text-gray-300">{t("skin")}:</span>{" "}
              {consoleItem.skinName}
            </p>
          )}

          {consoleItem.price && (
            <p className="mt-2 font-bold dark:text-white">
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

            {consoleItem.acceptsTrade && (
              <Badge status="warning" size="sm">
                {t("acceptsTrade")}
              </Badge>
            )}
          </div>
        </div>
      </Card>

      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={t("editTitle")}
        size="xl"
      >
        <EditConsoleForm
          consoleItem={consoleItem}
          onSuccess={() => {
            setShowEditModal(false);
            showToast(t("editSuccess"), "success");
          }}
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
      />
    </>
  );
};
