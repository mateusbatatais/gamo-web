import React from "react";
import { AccessoryItem } from "../AccessoryItem/AccessoryItem";
import { useTranslations } from "next-intl";
import { SimpleCollapse } from "@/components/atoms/SimpleCollapse/SimpleCollapse";
import { Spinner } from "@/components/atoms/Spinner/Spinner";

export interface SelectedAccessoryVariant {
  variantId: number;
  quantity: number;
}

interface AccessorySelectorProps {
  variantsByType: Record<
    string,
    Array<{
      id: number;
      name: string;
      editionName?: string;
      imageUrl?: string;
    }>
  >;
  selectedVariants: Record<number, SelectedAccessoryVariant>;
  onQuantityChange: (variantId: number, newQuantity: number) => void;
  isLoading?: boolean;
}

export const AccessorySelector = ({
  variantsByType,
  selectedVariants,
  onQuantityChange,
  isLoading = false,
}: AccessorySelectorProps) => {
  const t = useTranslations("SimpleConsoleForm");

  if (isLoading) {
    return <Spinner />;
  }

  if (!variantsByType || Object.keys(variantsByType).length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">{t("noAccessories")}</p>;
  }

  return (
    <div className="space-y-2">
      {Object.entries(variantsByType).map(([type, typeVariants]) => (
        <SimpleCollapse key={type} title={type} defaultOpen={true}>
          <div className="flex gap-2">
            {typeVariants.map((variant) => {
              const selected = selectedVariants[variant.id] || {
                variantId: variant.id,
                quantity: 0,
              };

              return (
                <AccessoryItem
                  key={variant.id}
                  id={variant.id}
                  name={variant.name}
                  editionName={variant.editionName}
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
