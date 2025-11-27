// components/organisms/PublicProfile/sections/AccessoriesSection.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { UserAccessory } from "@/@types/collection.types";
import { ViewMode } from "@/@types/catalog-state.types";
import { AccessoryTableRow } from "../AccessoryCard/AccessoryTableRow";
import { AccessoryListItem } from "../AccessoryCard/AccessoryListItem";
import { AccessoryCompactCard } from "../AccessoryCard/AccessoryCompactCard";
import { AccessoryCard } from "../AccessoryCard/AccessoryCard";
import { EmptyCard } from "../EmptyCard/EmptyCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { Select } from "@/components/atoms/Select/Select";
import { Button } from "@/components/atoms/Button/Button";
import { Settings2 } from "lucide-react";
import { Card } from "@/components/atoms/Card/Card";
import { SortOption } from "@/@types/catalog-state.types";

interface AccessoriesSectionProps {
  accessories: UserAccessory[];
  accessoriesMeta?: {
    totalPages: number;
    total?: number;
  };
  isOwner: boolean | undefined;
  type: string;
  viewMode: ViewMode;
  accessoriesPage: number;
  accessoriesPerPage: number;
  accessoriesSort: string;
  onAccessoriesPageChange: (page: number) => void;
  onAccessoriesPerPageChange: (perPage: number) => void;
  onAccessoriesSortChange: (sort: string) => void;
  onFilterOpen: () => void;
  sortOptions: SortOption[];
  perPageOptions: { value: string; label: string }[];
}

export const AccessoriesSection: React.FC<AccessoriesSectionProps> = ({
  accessories,
  accessoriesMeta,
  isOwner,
  type,
  viewMode,
  accessoriesPage,
  accessoriesPerPage,
  accessoriesSort,
  onAccessoriesPageChange,
  onAccessoriesPerPageChange,
  onAccessoriesSortChange,
  onFilterOpen,
  sortOptions,
  perPageOptions,
}) => {
  const t = useTranslations("PublicProfile");

  // Se não há acessórios e não é o dono, não renderiza nada
  if (accessories.length === 0 && !isOwner) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">
          {type === "selling" ? t("accessoriesForSale") : t("accessoriesLookingFor")}
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={onFilterOpen}
          icon={<Settings2 size={16} />}
        />
      </div>

      {/* Controles de ordenação e paginação para acessórios */}
      <div className="flex justify-end items-center mb-4 gap-4">
        <SortSelect
          options={sortOptions}
          value={accessoriesSort}
          onChange={onAccessoriesSortChange}
          className="w-full sm:w-auto"
        />
        {accessoriesMeta?.total !== undefined && accessoriesMeta.total > 20 && (
          <Select
            options={perPageOptions}
            value={accessoriesPerPage.toString()}
            onChange={(e) => onAccessoriesPerPageChange(Number(e.target.value))}
            className="w-20"
            size="sm"
          />
        )}
      </div>

      {accessories.length === 0 ? (
        <Card>
          <div className="py-12">
            <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
              {type === "selling" ? t("noAccessoriesForSale") : t("noAccessoriesLookingFor")}
            </p>
            {isOwner && (
              <EmptyCard
                text={t("txtAccessory")}
                buttonLabel={type === "selling" ? t("txtSellAccessory") : t("txtLookForAccessory")}
                buttonLink="/user/collection/accessories/add?type=trade"
                viewMode="list"
              />
            )}
          </div>
        </Card>
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="p-2 text-left">Acessório</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Console</th>
                <th className="p-2 text-left">Preço</th>
                <th className="p-2 text-left">Condição</th>
                <th className="p-2 text-left">Aceita Troca</th>
                {isOwner && <th className="p-2 text-left">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {isOwner && (
                <tr>
                  <td colSpan={6 + (isOwner ? 1 : 0)}>
                    <EmptyCard
                      text={t("txtAccessory")}
                      buttonLabel={
                        type === "selling" ? t("txtSellAccessory") : t("txtLookForAccessory")
                      }
                      buttonLink="/user/collection/accessories/add?type=trade"
                      viewMode="table"
                      space={false}
                    />
                  </td>
                </tr>
              )}
              {accessories.map((accessory) => (
                <AccessoryTableRow
                  key={`accessory-${accessory.id}`}
                  accessory={accessory}
                  isOwner={isOwner}
                  type="trade"
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {isOwner && (
            <EmptyCard
              text={t("txtAccessory")}
              buttonLabel={type === "selling" ? t("txtSellAccessory") : t("txtLookForAccessory")}
              buttonLink="/user/collection/accessories/add?type=trade"
              viewMode="list"
            />
          )}
          {accessories.map((accessory) => (
            <AccessoryListItem
              key={accessory.id}
              accessory={accessory}
              isOwner={isOwner}
              type="trade"
            />
          ))}
        </div>
      ) : (
        <div
          className={`grid ${
            viewMode === "grid"
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
          } gap-6`}
        >
          {isOwner && (
            <EmptyCard
              text={t("txtAccessory")}
              buttonLabel={type === "selling" ? t("txtSellAccessory") : t("txtLookForAccessory")}
              buttonLink="/user/collection/accessories/add?type=trade"
              viewMode={viewMode === "grid" ? "card" : "compact"}
            />
          )}
          {accessories.map((accessory) =>
            viewMode === "compact" ? (
              <AccessoryCompactCard
                key={accessory.id}
                accessory={accessory}
                isOwner={isOwner}
                type="trade"
              />
            ) : (
              <AccessoryCard
                key={accessory.id}
                accessory={accessory}
                isOwner={isOwner}
                type="trade"
              />
            ),
          )}
        </div>
      )}

      {accessoriesMeta && accessoriesMeta.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={accessoriesPage}
            totalPages={accessoriesMeta.totalPages}
            onPageChange={onAccessoriesPageChange}
          />
        </div>
      )}
    </div>
  );
};
