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
import { useIsMutating } from "@tanstack/react-query";

interface AccessoryActionButtonsProps {
  accessory: UserAccessory;
  isOwner?: boolean;
  compact?: boolean;
  customClassName?: string;
  type?: "collection" | "trade";
}

export const AccessoryActionButtons = ({
  accessory,
  isOwner,
  compact = false,
  customClassName = "",
  // type = "collection",
}: AccessoryActionButtonsProps) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const closeEditModal = () => setShowEditModal(false);
  const { mutate: deleteAccessory, isPending: isDeletePending } = useDeleteUserAccessory();
  const isUpdatePending = useIsMutating({ mutationKey: ["updateUserAccessory"] }) > 0;
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
          icon={<Trash size={16} />}
          size="sm"
        />
      </div>

      <Dialog
        open={showEditModal}
        onClose={closeEditModal}
        title={`${t("editTitle")}: ${accessory.accessoryName}`}
        actionButtons={{
          confirm: {
            label: t("saveChanges"),
            type: "submit",
            form: `edit-accessory-form-${accessory.id}`,
            loading: isUpdatePending,
          },
          cancel: {
            label: t("cancel"),
            onClick: closeEditModal,
            disabled: isUpdatePending,
          },
        }}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <AccessoryForm
            mode="edit"
            type="collection"
            accessoryId={accessory.accessoryId}
            accessoryVariantId={accessory.accessoryVariantId}
            accessorySlug={accessory.accessorySlug!}
            initialData={{
              id: accessory.id,
              description: accessoryDetails?.description || accessory.description || undefined,
              status: accessoryDetails?.status || accessory.status,
              price: accessoryDetails?.price || accessory.price || undefined,
              hasBox: accessoryDetails?.hasBox || accessory.hasBox || false,
              hasManual: accessoryDetails?.hasManual || accessory.hasManual || false,
              condition: accessoryDetails?.condition || accessory.condition || undefined,
              acceptsTrade: accessoryDetails?.acceptsTrade || accessory.acceptsTrade || false,
              photoMain: accessoryDetails?.photoMain || accessory.photoMain || undefined,
              photos: accessoryDetails?.photos || accessory.photos || undefined,
              compatibleUserConsoleIds: accessoryDetails?.compatibleUserConsoleIds || [],
              address: accessoryDetails?.address || accessory.address,
              zipCode: accessoryDetails?.zipCode || accessory.zipCode,
              city: accessoryDetails?.city || accessory.city,
              state: accessoryDetails?.state || accessory.state,
              latitude: accessoryDetails?.latitude || accessory.latitude,
              longitude: accessoryDetails?.longitude || accessory.longitude,
            }}
            onSuccess={() => {
              closeEditModal();
            }}
            onCancel={closeEditModal}
            formId={`edit-accessory-form-${accessory.id}`}
            hideButtons
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
