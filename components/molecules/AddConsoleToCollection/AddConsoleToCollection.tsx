// components/molecules/AddToCollection/AddToCollection.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { useToast } from "@/contexts/ToastContext";
import { apiFetch } from "@/utils/api";
import { ConsoleForm } from "@/components/organisms/ConsoleForm/ConsoleForm";
import { CardActionButtons } from "../CardActionButtons/CardActionButtons";
import { usePendingAction } from "@/contexts/PendingActionContext";
import { useModalUrl } from "@/hooks/useModalUrl";

interface Props {
  consoleVariantId: number;
  consoleId: number;
  skinId: number;
  onAddSuccess?: () => void;
}

export function AddConsoleToCollection({
  consoleVariantId,
  skinId,
  consoleId,
  onAddSuccess,
}: Props) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { setPendingAction } = usePendingAction();
  const { isOpen, openModal, closeModal } = useModalUrl(`add-to-collection-${skinId}`);

  const handleAction = (type: "OWNED" | "TRADE") => {
    if (!user) {
      setPendingAction({
        type: "ADD_TO_COLLECTION",
        payload: { type, consoleVariantId, skinId, consoleId },
      });

      const returnUrl = `${window.location.pathname}${window.location.search}`;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (type === "OWNED") {
      addToCollectionDirectly();
    } else {
      openModal();
    }
  };

  const addToCollectionDirectly = async () => {
    setLoading(true);
    try {
      // Chamada API simplificada para OWNED
      await apiFetch("/user-consoles", {
        method: "POST",
        token,
        body: {
          consoleVariantId,
          consoleId,
          skinId,
          status: "OWNED",
          condition: "USED",
        },
      });
      onAddSuccess?.();
      showToast("Adicionado a coleção", "success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, "danger");
      } else {
        showToast("err.message", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end">
      <CardActionButtons
        loading={loading}
        actions={[
          {
            key: "collection",
            onClick: () => handleAction("OWNED"),
          },
          {
            key: "market",
            onClick: () => handleAction("TRADE"),
          },
        ]}
      />

      <Dialog open={isOpen} onClose={closeModal} title={"Adicionar à coleção"}>
        <ConsoleForm
          mode="create"
          consoleId={consoleId}
          consoleVariantId={consoleVariantId}
          skinId={skinId}
          onSuccess={() => {
            closeModal();
            onAddSuccess?.();
          }}
          onCancel={closeModal}
        />
      </Dialog>
    </div>
  );
}
