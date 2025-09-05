// components/molecules/AddAccessoryToCollection/AddAccessoryToCollection.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { CardActionButtons } from "../../CardActionButtons/CardActionButtons";
import { usePendingAction } from "@/contexts/PendingActionContext";
import { useModalUrl } from "@/hooks/useModalUrl";
import { useUserAccessoryMutation } from "@/hooks/useUserAccessoryMutation";
import { TradeAccessoryForm } from "../TradeAccessoryForm/TradeAccessoryForm";

interface Props {
  accessoryId: number;
  accessoryVariantId: number;
  variantSlug: string;
  onAddSuccess?: () => void;
}

export function AddAccessoryToCollection({
  accessoryId,
  accessoryVariantId,
  variantSlug,
  onAddSuccess,
}: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const { setPendingAction } = usePendingAction();
  const {
    isOpen: isTradeModalOpen,
    openModal: openTradeModal,
    closeModal: closeTradeModal,
  } = useModalUrl(`add-accessory-${accessoryVariantId}`);
  const { createUserAccessory, isPending } = useUserAccessoryMutation();

  const handleAction = (type: "OWNED" | "TRADE") => {
    if (!user) {
      setPendingAction({
        type: "ADD_ACCESSORY_TO_COLLECTION",
        payload: { type, accessoryId, accessoryVariantId, variantSlug },
      });

      const returnUrl = `${window.location.pathname}${window.location.search}`;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (type === "OWNED") {
      addToCollectionDirectly();
    } else {
      openTradeModal();
    }
  };

  const addToCollectionDirectly = async () => {
    await createUserAccessory({
      accessoryId,
      accessoryVariantId,
      status: "OWNED",
      condition: "USED",
    });
    onAddSuccess?.();
  };

  return (
    <div className="flex justify-end">
      <CardActionButtons
        loading={isPending}
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

      <Dialog open={isTradeModalOpen} onClose={closeTradeModal} title={"Anunciar acessório"}>
        <TradeAccessoryForm
          accessoryId={accessoryId}
          accessoryVariantId={accessoryVariantId}
          variantSlug={variantSlug}
          onSuccess={() => {
            closeTradeModal();
            onAddSuccess?.();
          }}
          onCancel={closeTradeModal}
        />
      </Dialog>
    </div>
  );
}
