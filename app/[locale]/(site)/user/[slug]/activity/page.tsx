// app/[locale]/user/[slug]/activity/page.tsx
import { ProfileRecentlyPlayed } from "@/components/organisms/PublicProfile/ProfileRecentlyPlayed/ProfileRecentlyPlayed";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

interface ActivityPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function ActivityPage({}: ActivityPageProps) {
  // Dados mockados - substituir por chamada à API
  const recentlyPlayed = [
    { title: "The Last of Us Part II", platform: "PS5", date: "Jun 04", hours: 12 },
    { title: "Cyberpunk 2077", platform: "PC", date: "Jun 03", hours: 28 },
    { title: "Elden Ring", platform: "Xbox Series X", date: "Jun 03", hours: 45 },
    { title: "Hollow Knight", platform: "Switch", date: "Jun 01", hours: 15 },
    { title: "God of War Ragnarök", platform: "PS5", date: "May 26", hours: 22 },
  ];

  return (
    <>
      <div className="p-4 border-b dark:border-gray-700 mb-4">
        <h2 className="text-xl font-bold dark:text-white">Atividade Recente</h2>
      </div>
      <div>
        <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
          <ProfileRecentlyPlayed items={recentlyPlayed} />
        </Suspense>
      </div>
    </>
  );
}
