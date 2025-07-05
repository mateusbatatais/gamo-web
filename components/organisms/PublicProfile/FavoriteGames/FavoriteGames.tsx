// components/organisms/PublicProfile/FavoriteGames/FavoriteGames.tsx
import React from "react";

interface FavoriteGame {
  title: string;
  rating: number;
}

interface FavoriteGamesProps {
  games: FavoriteGame[];
}

export const FavoriteGames = ({ games }: FavoriteGamesProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Favorite Games</h3>

      <div className="space-y-3">
        {games.map((game, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
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
    </div>
  );
};
