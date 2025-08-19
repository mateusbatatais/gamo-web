// components/atoms/Rating/Rating.tsx
import React from "react";
import clsx from "clsx";
import { Rating as MuiRating, RatingProps as MuiRatingProps } from "@mui/material";
import { Star, StarOutline } from "@mui/icons-material";

export type RatingSize = "sm" | "md" | "lg";

export interface RatingProps extends Omit<MuiRatingProps, "size" | "onChange"> {
  value: number;
  onChange?: (newValue: number) => void;
  size?: RatingSize;
  className?: string;
}

const sizeClasses: Record<RatingSize, string> = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

export function Rating({ value, onChange, size = "md", className, ...props }: RatingProps) {
  const handleChange = (event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null && onChange) {
      onChange(newValue * 2); // Converte de 0-5 para 0-10
    }
  };

  return (
    <MuiRating
      name="game-rating"
      value={value / 2} // Converte de 0-10 para 0-5
      precision={0.5}
      max={5}
      onChange={handleChange}
      icon={<Star className={clsx(sizeClasses[size], "text-warning-500 dark:text-warning-400")} />}
      emptyIcon={
        <StarOutline
          className={clsx(sizeClasses[size], "text-neutral-300 dark:text-neutral-600")}
        />
      }
      className={clsx("gap-0.5", className)}
      {...props}
    />
  );
}
