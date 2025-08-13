// components/molecules/AddGameToCollection/AddGameToCollection.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { useToast } from "@/contexts/ToastContext";
import { apiFetch } from "@/utils/api";
import { CardActionButtons } from "../CardActionButtons/CardActionButtons";
import { usePendingAction } from "@/contexts/PendingActionContext";
import { useModalUrl } from "@/hooks/useModalUrl";
import { GameForm } from "../GameForm/GameForm";
import { useFavorite } from "@/hooks/useFavorite";

interface Props {
  gameId: number;
  onAddSuccess?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: (newState: boolean) => void; // Novo callback
}

export function AddGameToCollection({
  gameId,
  onAddSuccess,
  isFavorite = false,
  onFavoriteToggle,
}: Props) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { setPendingAction } = usePendingAction();
  const { isOpen, openModal, closeModal } = useModalUrl(`add-game-to-collection-${gameId}`);
  const { toggleFavorite, loading: favoriteLoading } = useFavorite();

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
    setLoading(true);
    try {
      // Chamada API para adicionar jogo com status "OWNED" e valores padrão
      await apiFetch("/user-games", {
        method: "POST",
        token,
        body: {
          gameId,
          status: "OWNED",
          media: "PHYSICAL",
        },
      });
      onAddSuccess?.();
      showToast("Jogo adicionado à coleção", "success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, "danger");
      } else {
        showToast("Erro ao adicionar jogo", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end">
      <CardActionButtons
        loading={loading}
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
