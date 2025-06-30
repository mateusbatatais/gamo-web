// components/molecules/ConsoleCard/ConsoleCardSkeleton.tsx
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

export function ButtonSkeleton() {
  return (
    <div className="flex items-center justify-center">
      <Skeleton className="h-10 w-32 rounded-md" />
      <Skeleton className="h-10 w-32 rounded-md ml-4" />
    </div>
  );
}
