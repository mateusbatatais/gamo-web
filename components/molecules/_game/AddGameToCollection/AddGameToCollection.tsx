// components/molecules/AddGameToCollection/AddGameToCollection.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { SelectOption } from "@/components/atoms/Select/Select";
import { CardActionButtons } from "../../CardActionButtons/CardActionButtons";
import { usePendingAction } from "@/contexts/PendingActionContext";
import { useModalUrl } from "@/hooks/useModalUrl";
import { useFavorite } from "@/hooks/useFavorite";
import { SimpleGameForm } from "../SimpleGameForm/SimpleGameForm";
import { usePlatformsCache } from "@/hooks/usePlatformsCache";
import { TradeGameForm } from "../TradeGameForm/TradeGameForm";

interface Props {
  gameId: number;
  platforms: number[];
  onAddSuccess?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: (newState: boolean) => void;
}

export function AddGameToCollection({
  gameId,
  platforms,
  onAddSuccess,
  isFavorite = false,
  onFavoriteToggle,
}: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const { setPendingAction } = usePendingAction();
  const {
    isOpen: isTradeModalOpen,
    openModal: openTradeModal,
    closeModal: closeTradeModal,
  } = useModalUrl(`add-game-to-collection-${gameId}`);
  const {
    isOpen: isSimpleModalOpen,
    openModal: openSimpleModal,
    closeModal: closeSimpleModal,
  } = useModalUrl(`add-game-simple-${gameId}`);
  const { toggleFavorite, isPending: favoriteLoading } = useFavorite();
  const { platformsMap, isLoading: platformsLoading } = usePlatformsCache();

  const handleFavorite = async () => {
    const { added } = await toggleFavorite({
      itemId: gameId,
      itemType: "GAME",
    });
    onFavoriteToggle?.(added);
  };

  const handleAction = (type: "OWNED" | "TRADE") => {
    if (!user) {
      setPendingAction({
        type: "ADD_GAME_TO_COLLECTION",
        payload: { type, gameId },
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

  const platformOptions: SelectOption[] = platforms
    .filter((id) => platformsMap[id])
    .map((id) => ({
      value: String(id),
      label: platformsMap[id],
    }));

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

      <Dialog open={isTradeModalOpen} onClose={closeTradeModal} title={"Anunciar jogo"}>
        <TradeGameForm
          gameId={gameId}
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
        title={"Adicionar jogo à coleção"}
      >
        {platformsLoading ? (
          <div>Carregando plataformas...</div>
        ) : (
          <SimpleGameForm
            gameId={gameId}
            platformOptions={platformOptions}
            onSuccess={() => {
              closeSimpleModal();
              onAddSuccess?.();
            }}
            onCancel={closeSimpleModal}
          />
        )}
      </Dialog>
    </div>
  );
}
