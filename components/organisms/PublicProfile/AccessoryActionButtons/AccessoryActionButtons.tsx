"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Trash } from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { useDeleteUserAccessory } from "@/hooks/usePublicProfile";
import { UserAccessory } from "@/@types/collection.types";
import { AccessoryForm } from "../../_accessory/AccessoryForm/AccessoryForm";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { useUserAccessory } from "@/hooks/useUserAccessory";

interface AccessoryActionButtonsProps {
  accessory: UserAccessory;
  isOwner: boolean;
  compact?: boolean;
  customClassName?: string;
  type?: "collection" | "trade";
}

export const AccessoryActionButtons = ({
  accessory,
  isOwner,
  compact = false,
  customClassName = "",
  type = "collection",
}: AccessoryActionButtonsProps) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { mutate: deleteAccessory, isPending: isDeletePending } = useDeleteUserAccessory();
  const { data: accessoryDetails, isLoading } = useUserAccessory(accessory.id!, {
    enabled: showEditModal,
  });

  const handleDelete = () => {
    deleteAccessory(accessory.id!);
  };

  if (!isOwner) return null;

  return (
    <>
      <div className={`${customClassName} flex${compact ? "flex-col" : ""}`}>
        <Button
          onClick={() => setShowEditModal(true)}
          aria-label={t("editItem")}
          icon={<Pencil size={compact ? 12 : 16} />}
          variant="transparent"
          size="sm"
        />
        <Button
          onClick={() => setShowDeleteModal(true)}
          disabled={isDeletePending}
          variant="transparent"
          aria-label={t("deleteItem")}
          icon={<Trash size={compact ? 12 : 16} />}
          size="sm"
        />
      </div>

      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} title={t("editTitle")}>
        {isLoading ? (
          <Spinner />
        ) : (
          <AccessoryForm
            mode="edit"
            type={type}
            accessoryId={accessory.accessoryId}
            accessoryVariantId={accessory.accessoryVariantId}
            accessorySlug={accessory.accessorySlug!}
            initialData={{
              id: accessory.id,
              description: accessoryDetails?.description || accessory.description,
              status: accessoryDetails?.status || accessory.status,
              price: accessoryDetails?.price || accessory.price,
              hasBox: accessoryDetails?.hasBox || accessory.hasBox,
              hasManual: accessoryDetails?.hasManual || accessory.hasManual,
              condition: accessoryDetails?.condition || accessory.condition,
              acceptsTrade: accessoryDetails?.acceptsTrade || accessory.acceptsTrade,
              photoMain: accessoryDetails?.photoMain || accessory.photoMain,
              photos: accessoryDetails?.photos || accessory.photos,
              compatibleUserConsoleIds: accessoryDetails?.compatibleUserConsoleIds || [],
            }}
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
