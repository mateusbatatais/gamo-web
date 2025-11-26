import React, { useState } from "react";
import Image from "next/image";
import { Gamepad } from "lucide-react";
import { Counter } from "@/components/atoms/Counter/Counter";
import { normalizeImageUrl } from "@/utils/validate-url";

export interface GameItemProps {
  id: number;
  name: string;
  imageUrl?: string | null;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

export const GameItem = ({ id, name, imageUrl, quantity, onQuantityChange }: GameItemProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      id={id.toString()}
      className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800 w-28"
    >
      <div className="w-10 h-10 relative mb-1">
        {imageUrl && !imageError ? (
          <Image
            src={normalizeImageUrl(imageUrl)}
            alt={name}
            fill
            className="object-cover rounded"
            onError={handleImageError}
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded">
            <Gamepad size={16} className="text-gray-400" />
          </div>
        )}
      </div>
      <div className="text-center mb-2">
        <p className="text-xs font-medium w-full">{name}</p>
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
