// components/molecules/RelationCard/RelationCard.tsx
import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/atoms/Card/Card";
import { Gamepad } from "lucide-react";
import Link from "next/link";
import { MinimalGame } from "@/@types/game";

interface RelationCardProps {
  game: MinimalGame;
}

export function RelationCard({ game }: RelationCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/game/${game.slug}`} passHref>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 !p-0 relative cursor-pointer">
        <div className="h-48 relative">
          {imageError ? (
            <div className="bg-gray-200 rounded-top-xl border-2 border-dashed border-gray-300 w-full h-full flex items-center justify-center dark:bg-gray-700 dark:border-gray-600">
              <Gamepad size={40} className="mx-auto" />
            </div>
          ) : (
            <Image
              src={game.imageUrl || ""}
              alt={game.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              priority={true}
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
            {game.name}
          </h3>
        </div>
      </Card>
    </Link>
  );
}
