"use client";

import React from "react";
import { Card } from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button/Button";
import { useRouter } from "next/navigation";

interface EmptyCardProps {
  text: string;
  buttonLabel: string;
  buttonLink: string;
  viewMode?: "card" | "table" | "list" | "compact";
  space?: boolean;
  isGame?: boolean;
}

export const EmptyCard = ({
  text,
  buttonLabel,
  buttonLink,
  viewMode = "card",
  space = false,
  isGame = false,
}: EmptyCardProps) => {
  const router = useRouter();

  // Versão Compact
  if (viewMode === "compact") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow !p-0 relative group aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="w-full h-full bg-gray-50 dark:bg-gray-800 relative flex items-center justify-center">
          <div className="text-center p-4">
            <span className="text-3xl text-gray-400 dark:text-gray-500 mb-1 block">📦</span>
            <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2">{text}</p>
          </div>
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex flex-col gap-2 items-center justify-center opacity-0 group-hover:opacity-100 z-10">
          <Button variant="primary" onClick={() => router.push(buttonLink)} size="sm">
            {buttonLabel}
          </Button>
          {isGame && (
            <Button
              variant="secondary"
              onClick={() => router.push(`/user/collection/games/import`)}
              size="sm"
            >
              Importar em massa
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // Versão List
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow !p-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex-shrink-0 bg-gray-50 dark:bg-gray-800 relative flex items-center justify-center">
            <span className="text-2xl text-gray-400 dark:text-gray-500">📦</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-gray-500 dark:text-gray-400 text-sm">{text}</p>
              </div>
            </div>

            <div className="flex justify-start mt-3 gap-2">
              <Button variant="primary" onClick={() => router.push(buttonLink)}>
                {buttonLabel}
              </Button>
              {isGame && (
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/user/collection/games/import`)}
                >
                  Importar em massa
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Versão Table
  if (viewMode === "table") {
    return (
      <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 border-dashed">
        {space && <td className="p-2 w-10"></td>}

        <td className="py-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex-shrink-0 bg-gray-50 dark:bg-gray-800 relative flex items-center justify-center">
              <span className="text-xl text-gray-400 dark:text-gray-500">📦</span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{text}</p>
            </div>
          </div>
        </td>

        <td className="p-2 text-end" colSpan={4}>
          <Button variant="primary" onClick={() => router.push(buttonLink)} size="sm">
            {buttonLabel}
          </Button>
          {isGame && (
            <Button
              variant="secondary"
              size="sm"
              className="ms-2"
              onClick={() => router.push(`/user/collection/games/import`)}
            >
              Importar em massa
            </Button>
          )}
        </td>
      </tr>
    );
  }

  // Versão padrão (Card)
  return (
    <div className="relative rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-50 dark:bg-gray-800 relative flex items-center justify-center">
        <div className="text-center p-4">
          <span className="text-5xl text-gray-400 dark:text-gray-500 mb-2 block">📦</span>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{text}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-center flex-col gap-2">
          <Button variant="primary" onClick={() => router.push(buttonLink)}>
            {buttonLabel}
          </Button>
          {isGame && (
            <Button
              variant="secondary"
              onClick={() => router.push(`/user/collection/games/import`)}
            >
              Importar em massa
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
