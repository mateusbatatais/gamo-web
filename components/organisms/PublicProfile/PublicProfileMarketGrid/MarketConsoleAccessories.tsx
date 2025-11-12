"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/atoms/Card/Card";
import { AccessoryCard } from "../AccessoryCard/AccessoryCard";
import { AccessoryCompactCard } from "../AccessoryCard/AccessoryCompactCard";
import { AccessoryListItem } from "../AccessoryCard/AccessoryListItem";
import { AccessoryActionButtons } from "../AccessoryActionButtons/AccessoryActionButtons";
import { UserConsole, UserAccessory } from "@/@types/collection.types";

function hasAccessories(
  item: UserConsole,
): item is UserConsole & { accessories: ReadonlyArray<UserAccessory> } {
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

export function MarketConsoleAccessoriesGrid({
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {item.accessories.map((acc) => (
          <AccessoryCard key={acc.id} accessory={acc} isOwner={isOwner} type="trade" />
        ))}
      </div>
    </Card>
  );
}

export function MarketConsoleAccessoriesCompact({
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
      <div className="flex flex-wrap gap-3">
        {item.accessories.map((acc) => (
          <div
            key={acc.id}
            className="
              box-border min-w-0
              flex-[0_0_calc(33.333%_-_.5rem)]
              md:flex-[0_0_calc(25%_-_.5625rem)]
              lg:flex-[0_0_calc(16.666%_-_.625rem)]
              xl:flex-[0_0_calc(12.5%_-_.65625rem)]
            "
          >
            <AccessoryCompactCard accessory={acc} isOwner={isOwner} type="trade" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MarketConsoleAccessoriesList({
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
        {item.accessories.map((acc) => (
          <AccessoryListItem key={acc.id} accessory={acc} isOwner={isOwner} type="trade" />
        ))}
      </div>
    </Card>
  );
}

export function MarketConsoleAccessoriesTable({
  item,
  isOwner = false,
  locale,
  t,
}: {
  item?: UserConsole;
  isOwner?: boolean;
  locale: string;
  t: (key: string) => string;
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
            <th className="p-2 text-left">Preço</th>
            <th className="p-2 text-left">Condição</th>
            {isOwner && <th className="p-2 ">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {item.accessories.map((acc) => (
            <tr key={acc.id} className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {acc.photoMain ? (
                      <Image
                        src={acc.photoMain}
                        alt={acc.variantName || ""}
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
                  <span className="font-medium dark:text-white">{acc.variantName}</span>
                </div>
              </td>
              <td className="p-2 text-sm text-gray-600 dark:text-gray-300">{acc.accessorySlug}</td>
              <td className="p-2">
                {acc.price ? (
                  <span className="font-medium">
                    {new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(
                      acc.price,
                    )}
                  </span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">-</span>
                )}
              </td>
              <td className="p-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {acc.condition ? t(`condition.${acc.condition.toLowerCase()}`) : "-"}
                </span>
              </td>
              {isOwner && (
                <td className="p-2 text-center">
                  <AccessoryActionButtons accessory={acc} isOwner={isOwner} type="trade" />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
