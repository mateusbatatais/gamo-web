// components/organisms/PublicProfile/FavoriteItem/FavoriteItem.tsx
import React from "react";

interface FavoriteItemProps {
  title: string;
  value: string;
  icon: string;
}

export const FavoriteItem = ({ title, value, icon }: FavoriteItemProps) => (
  <div className="flex items-center gap-3 p-3 border rounded-lg dark:border-gray-700">
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="font-medium dark:text-white">{value}</p>
    </div>
  </div>
);
