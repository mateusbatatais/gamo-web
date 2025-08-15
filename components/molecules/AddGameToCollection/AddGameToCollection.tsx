// components/molecules/AddGameToCollection/AddGameToCollection.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { CardActionButtons } from "../CardActionButtons/CardActionButtons";
import { usePendingAction } from "@/contexts/PendingActionContext";
import { useModalUrl } from "@/hooks/useModalUrl";
import { GameForm } from "../../organisms/GameForm/GameForm";
import { useFavorite } from "@/hooks/useFavorite";
import { useUserGameMutation } from "@/hooks/useUserGameMutation";

interface Props {
  gameId: number;
  onAddSuccess?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: (newState: boolean) => void;
}

export function AddGameToCollection({
  gameId,
  onAddSuccess,
  isFavorite = false,
  onFavoriteToggle,
}: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const { setPendingAction } = usePendingAction();
  const { isOpen, openModal, closeModal } = useModalUrl(`add-game-to-collection-${gameId}`);
  const { toggleFavorite, isPending: favoriteLoading } = useFavorite();
  const { createUserGame, isPending } = useUserGameMutation();

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
      addToCollectionDirectly();
    } else {
      openModal();
    }
  };

  const addToCollectionDirectly = async () => {
    await createUserGame({
      gameId,
      status: "OWNED",
      media: "PHYSICAL",
    });
    onAddSuccess?.();
  };

  return (
    <div className="flex justify-end">
      <CardActionButtons
        loading={isPending}
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

      <Dialog open={isOpen} onClose={closeModal} title={"Adicionar jogo à coleção"}>
        <GameForm
          mode="create"
          gameId={gameId}
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
