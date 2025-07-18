// app/[locale]/user/[slug]/games/page.tsx
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

export default function GamesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <>
        <h2 className="text-xl font-bold mb-4 dark:text-white">Games Collection</h2>
        <p className="text-center py-8 text-gray-500 dark:text-gray-400">Games list coming soon</p>
      </>
    </Suspense>
  );
}
