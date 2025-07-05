// components/organisms/PublicProfile/FavoriteGames/FavoriteGames.tsx
import React from "react";
import { Card } from "@/components/atoms/Card/Card";

interface FavoriteGame {
  title: string;
  rating: number;
}

interface FavoriteGamesProps {
  games: FavoriteGame[];
}

export const FavoriteGames = ({ games }: FavoriteGamesProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Jogos Favoritos</h3>

      <div className="space-y-3">
        {games.map((game, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center">
                <span className="text-lg">🎮</span>
              </div>
              <div className="ml-3">
                <p className="font-medium dark:text-white">{game.title}</p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      {i < game.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-primary-500 text-white px-2 py-1 rounded font-bold">
              {game.rating}/5
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
