"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { CardActionButtons } from "../../CardActionButtons/CardActionButtons";
import { usePendingAction } from "@/contexts/PendingActionContext";
import { useModalUrl } from "@/hooks/useModalUrl";
import { TradeAccessoryForm } from "../TradeAccessoryForm/TradeAccessoryForm";
import { SimpleAccessoryForm } from "../SimpleAccessoryForm/SimpleAccessoryForm";
import { useFavorite } from "@/hooks/useFavorite";
import { useIsMutating } from "@tanstack/react-query";

interface Props {
  accessoryId: number;
  accessoryVariantId: number;
  accessorySlug: string;
  onAddSuccess?: () => void;
  isFavorite: boolean;
  onFavoriteToggle?: (isFavorite: boolean) => void;
}

export function AddAccessoryToCollection({
  accessoryId,
  accessoryVariantId,
  accessorySlug,
  onAddSuccess,
  isFavorite,
  onFavoriteToggle,
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
  const { toggleFavorite, isPending: favoriteLoading } = useFavorite();
  const isAccessoryPending = useIsMutating({ mutationKey: ["createUserAccessory"] }) > 0;

  const handleFavorite = async () => {
    const { added } = await toggleFavorite({
      itemId: accessoryId,
      itemType: "ACCESSORY",
    });
    onFavoriteToggle?.(added);
  };

  const handleAction = (type: "OWNED" | "TRADE") => {
    if (!user) {
      setPendingAction({
        type: "ADD_ACCESSORY_TO_COLLECTION",
        payload: { type, accessoryId },
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

  const tradeFormId = `trade-accessory-form-${accessoryId}`;
  const simpleFormId = `simple-accessory-form-${accessoryId}`;

  return (
    <div className="flex justify-end">
      <CardActionButtons
        loading={favoriteLoading}
        favoriteLoading={favoriteLoading}
        actions={[
          {
            key: "favorite",
            active: isFavorite,
            onClick: handleFavorite,
          },
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
        title={"Anunciar acessório"}
        actionButtons={{
          confirm: {
            label: "Anunciar",
            type: "submit",
            form: tradeFormId,
            loading: isAccessoryPending,
          },
          cancel: {
            label: "Cancelar",
            onClick: closeTradeModal,
            disabled: isAccessoryPending,
          },
        }}
      >
        <TradeAccessoryForm
          accessoryId={accessoryId}
          accessoryVariantId={accessoryVariantId}
          accessorySlug={accessorySlug}
          onSuccess={() => {
            closeTradeModal();
            onAddSuccess?.();
          }}
          onCancel={closeTradeModal}
          formId={tradeFormId}
          hideButtons
        />
      </Dialog>

      <Dialog
        open={isSimpleModalOpen}
        onClose={closeSimpleModal}
        title={"Adicionar acessório à coleção"}
        actionButtons={{
          confirm: {
            label: "Adicionar à coleção",
            type: "submit",
            form: simpleFormId,
            loading: isAccessoryPending,
          },
          cancel: {
            label: "Cancelar",
            onClick: closeSimpleModal,
            disabled: isAccessoryPending,
          },
        }}
      >
        <SimpleAccessoryForm
          accessoryId={accessoryId}
          accessoryVariantId={accessoryVariantId}
          onSuccess={() => {
            closeSimpleModal();
            onAddSuccess?.();
          }}
          onCancel={closeSimpleModal}
          formId={simpleFormId}
          hideButtons
        />
      </Dialog>
    </div>
  );
}
