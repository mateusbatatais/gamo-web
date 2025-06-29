// components/molecules/ConsoleCard/ConsoleCardSkeleton.tsx
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

export function ConsoleCardSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
      <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 relative">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-4 bg-white dark:bg-gray-900">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-1 w-full">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <Skeleton className="h-10 w-full mt-4 rounded-md" />
      </div>
    </div>
  );
}
