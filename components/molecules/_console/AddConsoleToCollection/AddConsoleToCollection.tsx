"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { CardActionButtons } from "../../CardActionButtons/CardActionButtons";
import { usePendingAction } from "@/contexts/PendingActionContext";
import { useModalUrl } from "@/hooks/useModalUrl";
import { TradeConsoleForm } from "../TradeConsoleForm/TradeConsoleForm";
import { SimpleConsoleForm } from "../SimpleConsoleForm/SimpleConsoleForm";
import { useFavorite } from "@/hooks/useFavorite";
import { useIsMutating } from "@tanstack/react-query";

interface Props {
  consoleVariantId: number;
  variantSlug: string;
  consoleId: number;
  skinId: number;
  onAddSuccess?: () => void;
  isFavorite: boolean;
  onFavoriteToggle?: (isFavorite: boolean) => void;
}

export function AddConsoleToCollection({
  consoleVariantId,
  variantSlug,
  skinId,
  consoleId,
  onAddSuccess,
  isFavorite,
  onFavoriteToggle,
}: Props) {
  const t = useTranslations("AddConsole");
  const tTrade = useTranslations("TradeForm");
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
  const { toggleFavorite, isPending: favoriteLoading } = useFavorite();
  const isConsolePending = useIsMutating({ mutationKey: ["createUserConsole"] }) > 0;

  const handleFavorite = async () => {
    const { added } = await toggleFavorite({
      itemId: consoleId,
      itemType: "CONSOLE",
    });
    onFavoriteToggle?.(added);
  };

  const handleAction = (type: "OWNED" | "TRADE") => {
    if (!user) {
      setPendingAction({
        type: "ADD_CONSOLE_TO_COLLECTION",
        payload: { type, consoleId },
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

  const tradeFormId = `trade-console-form-${consoleId}`;
  const simpleFormId = `simple-console-form-${consoleId}`;

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
        title={t("titleMarket")}
        data-testid="trade-modal"
        actionButtons={{
          confirm: {
            label: tTrade("publish"),
            type: "submit",
            form: tradeFormId,
            loading: isConsolePending,
          },
          cancel: {
            label: tTrade("cancel"),
            onClick: closeTradeModal,
            disabled: isConsolePending,
          },
        }}
      >
        <TradeConsoleForm
          consoleId={consoleId}
          variantSlug={variantSlug}
          consoleVariantId={consoleVariantId}
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
        title={t("title")}
        data-testid="simple-collection-modal"
        actionButtons={{
          confirm: {
            label: tTrade("addToCollection"),
            type: "submit",
            form: simpleFormId,
            loading: isConsolePending,
          },
          cancel: {
            label: tTrade("cancel"),
            onClick: closeSimpleModal,
            disabled: isConsolePending,
          },
        }}
      >
        <SimpleConsoleForm
          consoleId={consoleId}
          consoleVariantId={consoleVariantId}
          variantSlug={variantSlug}
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
