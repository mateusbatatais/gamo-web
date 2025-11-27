"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Trash } from "lucide-react";
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/atoms/Button/Button";
import { useDeleteUserGame } from "@/hooks/usePublicProfile";
import { UserGame } from "@/@types/collection.types";

interface GameActionButtonsProps {
  game: UserGame;
  isOwner?: boolean;
  compact?: boolean;
  customClassName?: string;
}

export const GameActionButtons = ({
  game,
  isOwner,
  compact = false,
  customClassName = "",
}: GameActionButtonsProps) => {
  const t = useTranslations("PublicProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { mutate: deleteGame, isPending: isDeletePending } = useDeleteUserGame();

  const handleDelete = () => {
    deleteGame(game.id!, {
      onSuccess: () => {
        setShowDeleteModal(false);
      },
    });
  };

  if (!isOwner) return null;

  return (
    <>
      <div className={customClassName}>
        <Button
          onClick={() => setShowDeleteModal(true)}
          disabled={isDeletePending}
          variant="transparent"
          aria-label={t("deleteItem")}
          icon={<Trash size={compact ? 12 : 16} />}
          size="sm"
        />
      </div>

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
