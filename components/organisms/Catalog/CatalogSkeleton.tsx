// components/catalog/CatalogSkeleton.tsx
"use client";

import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

interface CatalogSkeletonProps {
  itemCount?: number;
  hasFilters?: boolean;
}

export const CatalogSkeleton = ({ itemCount = 6, hasFilters = true }: CatalogSkeletonProps) => {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Skeleton para filtros */}
      {hasFilters && (
        <div className="hidden lg:block w-full lg:w-1/4 pr-4">
          <div className="sticky top-[70px]">
            <div className="space-y-6">
              {/* Filtro 1 */}
              <div>
                <Skeleton className="h-6 w-1/2 mb-3" animated />
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2" rounded="sm" animated />
                      <Skeleton className="h-4 w-3/4" animated />
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtro 2 */}
              <div>
                <Skeleton className="h-6 w-1/2 mb-3" animated />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2" rounded="sm" animated />
                      <Skeleton className="h-4 w-3/4" animated />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Skeleton className="h-10 w-full mt-4 rounded-md" animated />
          </div>
        </div>
      )}

      {/* Skeleton para conteúdo */}
      <div className="w-full lg:w-3/4">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex justify-end items-end gap-4 flex-1">
            <Skeleton className="h-10 w-32 rounded-md" animated />
            <div className="flex space-x-1">
              <Skeleton className="w-10 h-10 rounded-md" animated />
              <Skeleton className="w-10 h-10 rounded-md" animated />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(itemCount)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" animated />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-full" animated />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
