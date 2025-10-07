"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { CardActionButtons } from "../../CardActionButtons/CardActionButtons";
import { usePendingAction } from "@/contexts/PendingActionContext";
import { useModalUrl } from "@/hooks/useModalUrl";
import { TradeConsoleForm } from "../TradeConsoleForm/TradeConsoleForm";
import { SimpleConsoleForm } from "../SimpleConsoleForm/SimpleConsoleForm";

interface Props {
  consoleVariantId: number;
  variantSlug: string;
  consoleId: number;
  skinId: number;
  onAddSuccess?: () => void;
}

export function AddConsoleToCollection({
  consoleVariantId,
  variantSlug,
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
  const {
    isOpen: isSimpleModalOpen,
    openModal: openSimpleModal,
    closeModal: closeSimpleModal,
  } = useModalUrl(`add-console-simple-${skinId}`);

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
      openSimpleModal();
    } else {
      openTradeModal();
    }
  };

  return (
    <div className="flex justify-end">
      <CardActionButtons
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

      <Dialog
        open={isTradeModalOpen}
        onClose={closeTradeModal}
        title={"Anunciar console"}
        data-testid="trade-modal"
      >
        <TradeConsoleForm
          consoleId={consoleId}
          variantSlug={variantSlug}
          consoleVariantId={consoleVariantId}
          skinId={skinId}
          onSuccess={() => {
            closeTradeModal();
            onAddSuccess?.();
          }}
          onCancel={closeTradeModal}
        />
      </Dialog>

      <Dialog
        open={isSimpleModalOpen}
        onClose={closeSimpleModal}
        title={"Adicionar à coleção"}
        data-testid="simple-collection-modal"
      >
        <SimpleConsoleForm
          consoleId={consoleId}
          consoleVariantId={consoleVariantId}
          variantSlug={variantSlug}
          skinId={skinId}
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
