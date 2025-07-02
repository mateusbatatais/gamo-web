// components/atoms/Card/Card.tsx
import React, { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        "border border-neutral-300 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm dark:border-gray-700",
        className,
      )}
    >
      {children}
    </div>
  );
}
