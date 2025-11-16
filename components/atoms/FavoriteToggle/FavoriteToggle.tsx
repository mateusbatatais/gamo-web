// components/atoms/FavoriteToggle/FavoriteToggle.tsx
"use client";

import React from "react";
import { Heart } from "lucide-react";
import { Button, ButtonVariant } from "@/components/atoms/Button/Button";
import { useFavorite } from "@/hooks/useFavorite";
import { useQueryClient } from "@tanstack/react-query";
import { PaginatedResponse } from "@/@types/catalog.types";

interface FavoriteToggleProps {
  itemId: number;
  itemType: "GAME" | "CONSOLE" | "ACCESSORY";
  isFavorite: boolean | undefined;
  queryKey: string[];
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: ButtonVariant;
}

export const FavoriteToggle: React.FC<FavoriteToggleProps> = ({
  itemId,
  itemType,
  isFavorite,
  queryKey,
  size = "sm",
  className = "",
  variant = "transparent",
}) => {
  const { toggleFavorite, isPending: favoriteLoading } = useFavorite();
  const queryClient = useQueryClient();

  const handleFavoriteToggle = async () => {
    if (favoriteLoading) return;

    // Atualização otimista seguindo o padrão do GameCatalogComponent
    await queryClient.cancelQueries({ queryKey });

    const previousData = queryClient.getQueryData<PaginatedResponse<unknown>>(queryKey);

    if (previousData) {
      queryClient.setQueryData<PaginatedResponse<unknown>>(queryKey, {
        ...previousData,
        items: previousData.items.map((item: unknown) => {
          const curr = item as { id: number; isFavorite?: boolean; [key: string]: unknown };
          return curr.id === itemId ? { ...curr, isFavorite: !isFavorite } : curr;
        }),
      });
    }

    try {
      await toggleFavorite({
        itemId,
        itemType,
      });

      queryClient.invalidateQueries({ queryKey });
    } catch (error) {
      if (previousData) {
        queryClient.setQueryData(queryKey, previousData);
      }
      console.error("Erro ao alternar favorito:", error);
    }
  };

  return (
    <Button
      onClick={handleFavoriteToggle}
      disabled={favoriteLoading}
      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      icon={
        <Heart
          size={size === "sm" ? 16 : size === "md" ? 20 : 24}
          className={isFavorite ? "fill-current text-primary-700" : ""}
        />
      }
      variant={variant}
      size={size}
      className={`
        ${isFavorite ? "text-primary-700 hover:text-primary-800" : ""}
        ${className}
      `}
    />
  );
};
