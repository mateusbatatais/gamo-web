import React from "react";
import { GameItem } from "../GameItem/GameItem";
import { useTranslations } from "next-intl";
import { SimpleCollapse } from "@/components/atoms/SimpleCollapse/SimpleCollapse";
import { Spinner } from "@/components/atoms/Spinner/Spinner";

export interface SelectedGameVariant {
  variantId: number;
  quantity: number;
}

interface GameSelectorProps {
  variantsByGenre: Record<
    string,
    Array<{
      id: number;
      name: string;
      imageUrl?: string | null;
    }>
  >;
  selectedVariants: Record<number, SelectedGameVariant>;
  onQuantityChange: (variantId: number, newQuantity: number) => void;
  isLoading?: boolean;
}

export const GameSelector = ({
  variantsByGenre,
  selectedVariants,
  onQuantityChange,
  isLoading = false,
}: GameSelectorProps) => {
  const t = useTranslations("SimpleConsoleForm");

  if (isLoading) {
    return <Spinner />;
  }

  if (!variantsByGenre || Object.keys(variantsByGenre).length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">{t("noGames")}</p>;
  }

  return (
    <div className="space-y-2">
      {Object.entries(variantsByGenre).map(([genre, genreVariants]) => (
        <SimpleCollapse key={genre} title={genre} defaultOpen={false}>
          <div className="flex gap-2 flex-wrap">
            {genreVariants.map((variant) => {
              const selected = selectedVariants[variant.id] || {
                variantId: variant.id,
                quantity: 0,
              };

              return (
                <GameItem
                  key={variant.id}
                  id={variant.id}
                  name={variant.name}
                  imageUrl={variant.imageUrl}
                  quantity={selected.quantity}
                  onQuantityChange={(newQuantity) => onQuantityChange(variant.id, newQuantity)}
                />
              );
            })}
          </div>
        </SimpleCollapse>
      ))}
    </div>
  );
};
