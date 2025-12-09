// components/organisms/DonationModal/DonationModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Coffee } from "lucide-react";
import { useModalUrl } from "@/hooks/useModalUrl";
import { useTranslations } from "next-intl";
import { DonationForm } from "@/components/organisms/DonationForm/DonationForm";

export function DonationModal() {
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations("DonationModal");
  const { isOpen, closeModal } = useModalUrl("donation");

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Dialog
      modalId="donation"
      title={t("title")}
      subtitle={t("subtitle")}
      onClose={closeModal}
      icon={<Coffee className="text-yellow-500" />}
      size="md"
      open={isOpen}
    >
      <DonationForm onCancel={closeModal} onSuccess={closeModal} mode="modal" />
    </Dialog>
  );
}
