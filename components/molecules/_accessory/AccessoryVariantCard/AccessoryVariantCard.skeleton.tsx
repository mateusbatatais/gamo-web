// components/molecules/AccessoryVariantCard/AccessoryVariantCard.skeleton.tsx
import { Card } from "@/components/atoms/Card/Card";

export function AccessoryVariantCardSkeleton() {
  return (
    <Card className="overflow-hidden !p-0 animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-3 w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-1 w-2/3"></div>
        <div className="mt-4 flex justify-end">
          <div className="flex gap-1">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}
