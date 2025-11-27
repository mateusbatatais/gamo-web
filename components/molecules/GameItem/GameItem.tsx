import React from "react";
import { Counter } from "@/components/atoms/Counter/Counter";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback/ImageWithFallback";

export interface GameItemProps {
  id: number;
  name: string;
  imageUrl?: string | null;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

export const GameItem = ({ id, name, imageUrl, quantity, onQuantityChange }: GameItemProps) => {
  return (
    <div
      id={id.toString()}
      className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800 w-28"
    >
      <div className="w-10 h-10 relative mb-1">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          packageSize={16}
          fallbackClassName="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded"
          imgClassName="object-cover rounded"
        />
      </div>
      <div className="text-center mb-2 w-full">
        <p className="text-xs font-medium w-full truncate" title={name}>
          {name}
        </p>
      </div>
      <Counter
        value={quantity}
        onIncrement={() => onQuantityChange(quantity + 1)}
        onDecrement={() => onQuantityChange(quantity - 1)}
        min={0}
        max={10}
      />
    </div>
  );
};
