// components/molecules/AddConsoleToCollection/AddConsoleToCollection.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { CardActionButtons } from "../CardActionButtons/CardActionButtons";
import { usePendingAction } from "@/contexts/PendingActionContext";
import { useModalUrl } from "@/hooks/useModalUrl";
import { useUserConsoleMutation } from "@/hooks/useUserConsoleMutation";
import { TradeConsoleForm } from "../TradeConsoleForm/TradeConsoleForm";

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
  const { user } = useAuth();
  const router = useRouter();
  const { setPendingAction } = usePendingAction();
  const {
    isOpen: isTradeModalOpen,
    openModal: openTradeModal,
    closeModal: closeTradeModal,
  } = useModalUrl(`add-to-collection-${skinId}`);
  const { createUserConsole, isPending } = useUserConsoleMutation();

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
      openTradeModal();
    }
  };

  const addToCollectionDirectly = async () => {
    await createUserConsole({
      consoleVariantId,
      consoleId,
      skinId,
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

      <Dialog open={isTradeModalOpen} onClose={closeTradeModal} title={"Anunciar console"}>
        <TradeConsoleForm
          consoleId={consoleId}
          consoleVariantId={consoleVariantId}
          skinId={skinId}
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
