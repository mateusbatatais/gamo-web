import React from "react";
import { Link } from "@/navigation";
import { SafeImage } from "@/components/atoms/SafeImage/SafeImage";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { TopUser } from "@/hooks/useTopUsers";
import { Trophy } from "lucide-react";

interface UserMosaicCardProps {
  user: TopUser;
  rank: number;
  type: "COLLECTION" | "SELLING";
}

export default function UserMosaicCard({ user, rank, type }: UserMosaicCardProps) {
  const { getSafeImageUrl } = useSafeImageUrl();
  const profileImageUrl = getSafeImageUrl(user.profileImage);

  // Ensure we have 6 slots for the mosaic, filling with placeholders if needed
  const mosaicItems = [...user.latestItems];
  while (mosaicItems.length < 6) {
    mosaicItems.push("");
  }
  const displayItems = mosaicItems.slice(0, 6);

  return (
    <Link
      href={`/user/${user.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
    >
      {/* Mosaic Header */}
      <div className="grid grid-cols-3 grid-rows-2 h-32 gap-0.5 bg-gray-100 dark:bg-gray-900">
        {displayItems.map((itemImage, index) => (
          <div
            key={index}
            className="relative w-full h-full overflow-hidden bg-gray-200 dark:bg-gray-800"
          >
            {itemImage ? (
              <SafeImage
                src={getSafeImageUrl(itemImage)}
                alt={`Item ${index + 1}`}
                fill
                sizes="100px"
                className="object-cover transition-transform group-hover:scale-110 duration-500"
              />
            ) : (
              <div className="w-full h-full opacity-10" />
            )}
          </div>
        ))}
      </div>

      {/* User Info */}
      <div className="relative px-4 pb-4 pt-12 text-center">
        {/* Profile Image */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="relative w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-md bg-white dark:bg-gray-700">
            <SafeImage
              src={profileImageUrl}
              alt={user.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          {/* Rank Badge */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white dark:border-gray-800 shadow-sm">
            #{rank}
          </div>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white truncate px-2 mb-1">{user.name}</h3>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Trophy
            size={14}
            className={type === "COLLECTION" ? "text-blue-500" : "text-green-500"}
          />
          <span className="font-medium">
            {user.totalItems} {type === "COLLECTION" ? "Items" : "Vendas"}
          </span>
        </div>
      </div>
    </Link>
  );
}
