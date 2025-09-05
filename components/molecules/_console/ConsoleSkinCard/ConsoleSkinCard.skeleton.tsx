// components/molecules/ConsoleSkinCard/ConsoleSkinCard.skeleton.tsx
import React from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

export const ConsoleSkinCardSkeleton = () => {
  return (
    <div className="border border-neutral-300 rounded-lg overflow-hidden shadow-sm">
      <Skeleton className="h-48 w-full" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    </div>
  );
};
