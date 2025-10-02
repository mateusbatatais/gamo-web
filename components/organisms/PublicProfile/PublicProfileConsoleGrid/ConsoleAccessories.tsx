"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/atoms/Card/Card";
import { AccessoryActionButtons } from "../AccessoryActionButtons/AccessoryActionButtons";
import { UserConsole, UserAccessory } from "@/@types/collection.types";

// Minimal local type to safely access fields we actually render
interface AccessoryLite {
  id: number;
  variantName?: string;
  accessorySlug?: string;
  photoMain?: string;
}

function hasAccessories(
  item: UserConsole,
): item is UserConsole & { accessories: ReadonlyArray<AccessoryLite> } {
  const maybe = item as unknown as { accessories?: unknown };
  return Array.isArray(maybe.accessories) && maybe.accessories.length > 0;
}

function RenderAccessoriesTitle({ item }: { item?: UserConsole }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold dark:text-white">
        Acessórios
        {item?.consoleName && (
          <span className="ml-2 font-normal text-gray-500 dark:text-gray-400">
            — {item.consoleName}
          </span>
        )}
      </h3>
    </div>
  );
}

function AccessoriesCard({ acc, isOwner = false }: { acc: AccessoryLite; isOwner?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="h-36 bg-gray-100 dark:bg-gray-700 relative">
        <AccessoryActionButtons
          accessory={acc as unknown as UserAccessory}
          isOwner={isOwner}
          customClassName="absolute top-2 right-2 z-10"
        />
        {acc.photoMain ? (
          <Image
            src={acc.photoMain}
            alt={acc.variantName || ""}
            fill
            sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-2xl">🖥️</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <p className="font-medium dark:text-white">{acc.variantName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{acc.accessorySlug}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConsoleAccessoriesCompact({
  item,
  isOwner = false,
}: {
  item?: UserConsole;
  isOwner?: boolean;
}) {
  if (!item || !hasAccessories(item)) {
    return (
      <Card className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Nenhum acessório cadastrado para este console.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <RenderAccessoriesTitle item={item} />
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {item.accessories.map((acc) => (
          <div key={(acc as AccessoryLite).id} className="aspect-square">
            <AccessoriesCard acc={acc as AccessoryLite} isOwner={isOwner} />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ConsoleAccessoriesList({
  item,
  isOwner = false,
}: {
  item?: UserConsole;
  isOwner?: boolean;
}) {
  if (!item || !hasAccessories(item)) {
    return (
      <Card className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Nenhum acessório cadastrado para este console.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <RenderAccessoriesTitle item={item} />
      <div className="space-y-3">
        {item.accessories.map((acc) => {
          const a = acc as AccessoryLite;
          return (
            <Card key={a.id} className="!p-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative rounded-md overflow-hidden">
                  {a.photoMain ? (
                    <Image
                      src={a.photoMain}
                      alt={a.variantName || ""}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-xl">🖥️</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium dark:text-white truncate">{a.variantName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {a.accessorySlug}
                  </p>
                </div>
                <AccessoryActionButtons
                  accessory={a as unknown as UserAccessory}
                  isOwner={isOwner}
                  customClassName="flex-grow justify-end"
                />
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}

export function ConsoleAccessoriesTable({
  item,
  isOwner = false,
}: {
  item?: UserConsole;
  isOwner?: boolean;
}) {
  if (!item || !hasAccessories(item)) {
    return (
      <Card className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Nenhum acessório cadastrado para este console.
        </div>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto ps-10">
      <table className="w-full">
        <thead>
          <tr className="border-t border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <th className="p-2 text-left">Acessório</th>
            <th className="p-2 text-left">Slug</th>
            {isOwner && <th className="p-2 ">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {item.accessories.map((acc) => {
            const a = acc as AccessoryLite;
            return (
              <tr key={a.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {a.photoMain ? (
                        <Image
                          src={a.photoMain}
                          alt={a.variantName || ""}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span>🖥️</span>
                        </div>
                      )}
                    </div>
                    <span className="font-medium dark:text-white">{a.variantName}</span>
                  </div>
                </td>
                <td className="p-2 text-sm text-gray-600 dark:text-gray-300">{a.accessorySlug}</td>
                {isOwner && (
                  <td className="p-2 text-center">
                    <AccessoryActionButtons
                      accessory={a as unknown as UserAccessory}
                      isOwner={isOwner}
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
