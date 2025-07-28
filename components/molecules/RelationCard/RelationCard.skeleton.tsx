// components/molecules/RelationCard/RelationCard.skeleton.tsx
import { Card } from "@/components/atoms/Card/Card";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

export function RelationCardSkeleton() {
  return (
    <Card className="overflow-hidden !p-0">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4" />
      </div>
    </Card>
  );
}
