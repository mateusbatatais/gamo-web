"use client";

import React from "react";
import MarketItemCard from "@/components/molecules/MarketItemCard/MarketItemCard";
import { Card } from "@/components/atoms/Card/Card";
import { MarketItem } from "@/@types/catalog.types";

interface MarketListProps {
  items: MarketItem[];
  isLoading: boolean;
  title?: string;
  emptyMessage?: string;
}

export default function MarketList({ items, isLoading, title, emptyMessage }: MarketListProps) {
  if (isLoading) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center py-8">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-50 dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <MarketItemCard key={item.id} item={item} />
        ))}
      </div>
    </Card>
  );
}
