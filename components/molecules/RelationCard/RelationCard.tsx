// components/molecules/RelationCard/RelationCard.tsx
import React from "react";
import Image from "next/image";
import { Card } from "@/components/atoms/Card/Card";
import { Gamepad } from "lucide-react";
import Link from "next/link";
import { MinimalGame } from "@/@types/game";

interface RelationCardProps {
  game: MinimalGame;
}

export function RelationCard({ game }: RelationCardProps) {
  return (
    <Link href={`/game/${game.slug}`} passHref>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 !p-0 relative cursor-pointer h-40 group">
        {/* Overlay gradiente para o texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />

        {/* Overlay adicional no hover */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-300 z-20" />

        {game.imageUrl ? (
          <Image
            src={game.imageUrl}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16.66vw, 12.5vw"
          />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center dark:bg-gray-700">
            <Gamepad size={24} />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-30 p-3">
          <h3 className="font-semibold text-white text-sm line-clamp-3 drop-shadow-md group-hover:text-primary-light transition-colors">
            {game.name}
          </h3>

          {/* Indicador de hover */}
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Card>
    </Link>
  );
}
