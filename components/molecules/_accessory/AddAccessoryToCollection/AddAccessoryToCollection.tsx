"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { CardActionButtons } from "../../CardActionButtons/CardActionButtons";
import { usePendingAction } from "@/contexts/PendingActionContext";
import { useModalUrl } from "@/hooks/useModalUrl";
import { TradeAccessoryForm } from "../TradeAccessoryForm/TradeAccessoryForm";
import { SimpleAccessoryForm } from "../SimpleAccessoryForm/SimpleAccessoryForm";
import { useUserAccessoryMutation } from "@/hooks/useUserAccessoryMutation";

interface Props {
  accessoryId: number;
  accessoryVariantId: number;
  accessorySlug: string;
  onAddSuccess?: () => void;
}

export function AddAccessoryToCollection({
  accessoryId,
  accessoryVariantId,
  accessorySlug,
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
  const {
    isOpen: isSimpleModalOpen,
    openModal: openSimpleModal,
    closeModal: closeSimpleModal,
  } = useModalUrl(`add-accessory-simple-${accessoryVariantId}`);
  const { isPending } = useUserAccessoryMutation();

  const handleAction = (type: "OWNED" | "TRADE") => {
    if (!user) {
      setPendingAction({
        type: "ADD_ACCESSORY_TO_COLLECTION",
        payload: { type, accessoryId, accessoryVariantId, accessorySlug },
      });

      const returnUrl = `${window.location.pathname}${window.location.search}`;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (type === "OWNED") {
      openSimpleModal();
    } else {
      openTradeModal();
    }
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
          accessorySlug={accessorySlug}
          onSuccess={() => {
            closeTradeModal();
            onAddSuccess?.();
          }}
          onCancel={closeTradeModal}
        />
      </Dialog>

      <Dialog open={isSimpleModalOpen} onClose={closeSimpleModal} title={"Adicionar à coleção"}>
        <SimpleAccessoryForm
          accessoryId={accessoryId}
          accessoryVariantId={accessoryVariantId}
          onSuccess={() => {
            closeSimpleModal();
            onAddSuccess?.();
          }}
          onCancel={closeSimpleModal}
        />
      </Dialog>
    </div>
  );
}
