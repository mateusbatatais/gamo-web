import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

export function AccessoryCardSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 relative">
        <Skeleton className="w-full h-full" animated />
      </div>
      <div className="p-4 bg-white dark:bg-gray-900">
        <Skeleton className="h-6 w-3/4 mb-2" animated />
        <Skeleton className="h-4 w-1/2 mb-4" animated />
        <Skeleton className="h-10 w-full" animated />
      </div>
    </div>
  );
}
