// components/organisms/GameInfo/GameInfo.skeleton.tsx
import { Card } from "@/components/atoms/Card/Card";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

export function GameInfoSkeleton() {
  return (
    <Card className="mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 w-full aspect-square relative">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="md:w-2/3">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </div>
    </Card>
  );
}
