import { FavoriteInput } from "@/@types/favorite";
import { apiFetch } from "@/utils/api";

export const toggleFavorite = async (
  token: string | null,
  input: FavoriteInput,
): Promise<{ added: boolean }> => {
  try {
    const response = await apiFetch<{
      code: "FAVORITE_ADDED" | "FAVORITE_REMOVED";
      message: string;
    }>("/favorites", {
      method: "POST",
      token,
      body: input,
    });

    return { added: response.code === "FAVORITE_ADDED" };
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw new Error("Failed to toggle favorite");
  }
};

export const getUserFavorites = async (token: string | null, itemType?: string) => {
  return apiFetch<
    {
      id: number;
      itemId: number;
      itemType: string;
      createdAt: string;
    }[]
  >(`/favorites${itemType ? `?type=${itemType}` : ""}`, {
    token,
  });
};
