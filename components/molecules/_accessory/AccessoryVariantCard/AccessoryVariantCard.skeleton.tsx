// components/molecules/AccessoryVariantCard/AccessoryVariantCard.skeleton.tsx
import { Card } from "@/components/atoms/Card/Card";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

export function AccessoryVariantCardSkeleton() {
  return (
    <Card className="overflow-hidden !p-0">
      <Skeleton className="h-48 rounded-none" />
      <div className="p-4">
        <Skeleton className="h-6 mb-2 w-3/4" />
        <div className="flex flex-wrap gap-2 mt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 mt-3 w-full" />
        <Skeleton className="h-4 mt-1 w-2/3" />
        <div className="mt-4 flex justify-end">
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}
