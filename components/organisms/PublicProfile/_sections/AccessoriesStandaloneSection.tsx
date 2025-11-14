// components/organisms/PublicProfile/sections/AccessoriesStandaloneSection.tsx
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
import { Card } from "@/components/atoms/Card/Card";
import { SortOption } from "@/@types/catalog-state.types";

interface AccessoriesStandaloneSectionProps {
  accessories: UserAccessory[];
  accessoriesMeta?: {
    totalPages: number;
  };
  isOwner: boolean | undefined;
  viewMode: ViewMode;
  accessoriesPage: number;
  accessoriesPerPage: number;
  accessoriesSort: string;
  onAccessoriesPageChange: (page: number) => void;
  onAccessoriesPerPageChange: (perPage: number) => void;
  onAccessoriesSortChange: (sort: string) => void;
  sortOptions: SortOption[];
  perPageOptions: { value: string; label: string }[];
  title: string;
  emptyMessage: string;
  addButtonText: string;
  addButtonLink: string;
}

export const AccessoriesStandaloneSection: React.FC<AccessoriesStandaloneSectionProps> = ({
  accessories,
  accessoriesMeta,
  isOwner,
  viewMode,
  accessoriesPage,
  accessoriesPerPage,
  accessoriesSort,
  onAccessoriesPageChange,
  onAccessoriesPerPageChange,
  onAccessoriesSortChange,
  sortOptions,
  perPageOptions,
  title,
  emptyMessage,
  addButtonText,
  addButtonLink,
}) => {
  const t = useTranslations("PublicProfile");

  // Se não há acessórios e não é o dono, não renderiza nada
  if (accessories.length === 0 && !isOwner) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">{title}</h2>

        <div className="flex items-center gap-4">
          <SortSelect
            options={sortOptions}
            value={accessoriesSort}
            onChange={onAccessoriesSortChange}
            className="w-40"
          />

          <Select
            options={perPageOptions}
            value={accessoriesPerPage.toString()}
            onChange={(e) => onAccessoriesPerPageChange(Number(e.target.value))}
            className="w-20"
            size="sm"
          />
        </div>
      </div>

      {accessories.length === 0 ? (
        <Card>
          <div className="py-12">
            <p className="text-center text-gray-500 dark:text-gray-400 mb-4">{emptyMessage}</p>
            {isOwner && (
              <EmptyCard
                text={t("txtAccessory")}
                buttonLabel={addButtonText}
                buttonLink={addButtonLink}
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
                <th className="p-2 text-left">Preço</th>
                <th className="p-2 text-left">Condição</th>
                {isOwner && <th className="p-2 text-left">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {isOwner && (
                <EmptyCard
                  text={t("txtAccessory")}
                  buttonLabel={addButtonText}
                  buttonLink={addButtonLink}
                  viewMode="table"
                />
              )}
              {accessories.map((accessory) => (
                <AccessoryTableRow key={accessory.id} accessory={accessory} isOwner={isOwner} />
              ))}
            </tbody>
          </table>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {isOwner && (
            <EmptyCard
              text={t("txtAccessory")}
              buttonLabel={addButtonText}
              buttonLink={addButtonLink}
              viewMode="list"
            />
          )}
          {accessories.map((accessory) => (
            <AccessoryListItem key={accessory.id} accessory={accessory} isOwner={isOwner} />
          ))}
        </div>
      ) : viewMode === "compact" ? (
        <div className="flex flex-wrap gap-3">
          {isOwner && (
            <EmptyCard
              text={t("txtAccessory")}
              buttonLabel={addButtonText}
              buttonLink={addButtonLink}
              viewMode="compact"
            />
          )}
          {accessories.map((accessory) => (
            <div
              key={accessory.id}
              className="
                box-border min-w-0
                flex-[0_0_calc(33.333%_-_.5rem)]
                md:flex-[0_0_calc(25%_-_.5625rem)]
                lg:flex-[0_0_calc(16.666%_-_.625rem)]
                xl:flex-[0_0_calc(12.5%_-_.65625rem)]
              "
            >
              <AccessoryCompactCard accessory={accessory} isOwner={isOwner} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isOwner && (
            <EmptyCard
              text={t("txtAccessory")}
              buttonLabel={addButtonText}
              buttonLink={addButtonLink}
              viewMode="card"
            />
          )}
          {accessories.map((accessory) => (
            <AccessoryCard key={accessory.id} accessory={accessory} isOwner={isOwner} />
          ))}
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
