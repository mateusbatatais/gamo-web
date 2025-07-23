import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import clsx from "clsx";

export const GameCardSkeleton = ({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) => {
  return (
    <div
      className={clsx(
        "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm",
        orientation === "vertical" ? "max-w-sm" : "flex w-full",
      )}
    >
      <div
        className={clsx(
          "relative bg-gray-100 dark:bg-gray-800",
          orientation === "vertical" ? "w-full aspect-video" : "w-1/3 min-w-[160px]",
        )}
      >
        <Skeleton className="w-full h-full" animated />
      </div>
      <div className={clsx("p-4 w-full", orientation === "horizontal" && "flex-1")}>
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" animated />
          <Skeleton className="h-4 w-1/2" animated />
          <div className="space-y-1 mt-2">
            <Skeleton className="h-4 w-full" animated />
            <Skeleton className="h-4 w-4/5" animated />
          </div>
        </div>
        <div className="mt-4">
          <Skeleton className="h-10 w-full rounded-md" animated />
        </div>
      </div>
    </div>
  );
};
