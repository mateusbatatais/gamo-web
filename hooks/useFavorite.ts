import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePendingAction } from "@/contexts/PendingActionContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import { toggleFavorite } from "@/lib/api/favorites";
import { FavoriteInput } from "@/@types/favorite";

export function useFavorite() {
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const { setPendingAction } = usePendingAction();
  const { showToast } = useToast();
  const router = useRouter();

  const handleToggleFavorite = useCallback(
    async (input: FavoriteInput) => {
      if (!user) {
        setPendingAction({
          type: "TOGGLE_FAVORITE",
          payload: input,
        });
        const returnUrl = `${window.location.pathname}${window.location.search}`;
        router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
        return { added: false };
      }

      setLoading(true);
      try {
        const result = await toggleFavorite(token, input);
        showToast(
          result.added ? "Item adicionado aos favoritos" : "Item removido dos favoritos",
          "success",
        );
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao atualizar favorito";
        showToast(message, "danger");
        return { added: false };
      } finally {
        setLoading(false);
      }
    },
    [user, token, router, setPendingAction, showToast],
  );

  return { toggleFavorite: handleToggleFavorite, loading };
}
