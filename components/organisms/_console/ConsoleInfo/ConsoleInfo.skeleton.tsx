// components/organisms/ConsoleInfo/ConsoleInfo.skeleton.tsx
import React from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

export const ConsoleInfoSkeleton = () => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Imagem */}
        <div className="w-full md:w-1/3">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>

        {/* Detalhes */}
        <div className="w-full md:w-2/3">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-4" />

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>

          <div className="mt-8">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
};
