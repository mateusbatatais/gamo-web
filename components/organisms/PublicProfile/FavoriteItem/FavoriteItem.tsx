// components/organisms/PublicProfile/FavoriteItem/FavoriteItem.tsx
import React from "react";
import clsx from "clsx";

interface FavoriteItemProps {
  title: string;
  value: string;
  icon: string;
  className?: string;
}

export const FavoriteItem = ({ title, value, icon, className }: FavoriteItemProps) => (
  <div
    className={clsx(
      "flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700",
      className,
    )}
  >
    <span className="text-xl w-8 h-8 flex items-center justify-center">{icon}</span>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="font-medium dark:text-white">{value}</p>
    </div>
  </div>
);
