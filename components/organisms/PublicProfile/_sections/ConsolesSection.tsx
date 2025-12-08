// components/organisms/PublicProfile/sections/ConsolesSection.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { UserConsole } from "@/@types/collection.types";
import { ViewMode } from "@/@types/catalog-state.types";
import { PublicProfileConsoleCard } from "../PublicProfileConsoleCard/PublicProfileConsoleCard";
import { PublicProfileConsoleCompact } from "../PublicProfileConsoleCard/PublicProfileConsoleCompact";
import { PublicProfileConsoleList } from "../PublicProfileConsoleCard/PublicProfileConsoleList";
import { PublicProfileConsoleTable } from "../PublicProfileConsoleCard/PublicProfileConsoleTable";
import {
  ConsoleAccessories,
  ConsoleAccessoriesCompact,
  ConsoleAccessoriesList,
  ConsoleAccessoriesTable,
} from "../PublicProfileConsoleGrid/ConsoleAccessories";
import {
  ConsoleGames,
  ConsoleGamesCompact,
  ConsoleGamesList,
  ConsoleGamesTable,
} from "../PublicProfileConsoleGrid/ConsoleGames";
import { EmptyCard } from "../EmptyCard/EmptyCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { Button } from "@/components/atoms/Button/Button";
import { Settings2 } from "lucide-react";
import { Card } from "@/components/atoms/Card/Card";
import { UseCollapseManagerReturn } from "../_hooks/useCollapseManager";

interface ConsolesSectionProps {
  consoles: UserConsole[];
  consolesMeta?: {
    totalPages: number;
  };
  isOwner: boolean | undefined;
  type: string;
  viewMode: ViewMode;
  currentPage: number;
  onPageChange: (page: number) => void;
  collapseManager: UseCollapseManagerReturn;
  gridCols: number;
  compactCols: number;
  onFilterOpen: () => void;
  locale: string;
  userSlug: string;
}

export const ConsolesSection: React.FC<ConsolesSectionProps> = ({
  consoles,
  consolesMeta,
  isOwner,
  type,
  viewMode,
  currentPage,
  onPageChange,
  collapseManager,
  gridCols,
  compactCols,
  onFilterOpen,
  locale,
  userSlug,
}) => {
  const t = useTranslations("PublicProfile");

  const consoleHasAccessories = (item: UserConsole) =>
    Array.isArray(item.accessories) && item.accessories.length > 0;

  const consoleHasGames = (item: UserConsole) => Array.isArray(item.games) && item.games.length > 0;

  // Se não há consoles e não é o dono, não renderiza nada
  if (consoles.length === 0 && !isOwner) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">
          {type === "selling" ? t("consolesForSale") : t("consolesLookingFor")}
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={onFilterOpen}
          icon={<Settings2 size={16} />}
        />
      </div>

      {consoles.length === 0 ? (
        <Card>
          <div className="py-12">
            <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
              {type === "selling" ? t("noConsolesForSale") : t("noConsolesLookingFor")}
            </p>
            {isOwner && (
              <EmptyCard
                text={t("txtConsole")}
                buttonLabel={type === "selling" ? t("txtSellConsole") : t("txtLookForConsole")}
                buttonLink={`/user/collection/consoles/add?type=trade&status=${
                  type === "selling" ? "SELLING" : "LOOKING_FOR"
                }`}
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
                <th className="p-2 w-10" />
                <th className="p-2 text-left">Console</th>
                <th className="p-2 text-left">Skin</th>
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
                      text={t("txtConsole")}
                      buttonLabel={
                        type === "selling" ? t("txtSellConsole") : t("txtLookForConsole")
                      }
                      buttonLink={`/user/collection/consoles/add?type=trade&status=${
                        type === "selling" ? "SELLING" : "LOOKING_FOR"
                      }`}
                      viewMode="table"
                      space={false}
                    />
                  </td>
                </tr>
              )}
              {consoles.map((consoleItem: UserConsole) => {
                const isExpanded = collapseManager.openTableId === consoleItem.id;
                const canExpand =
                  consoleHasAccessories(consoleItem) || consoleHasGames(consoleItem);
                return (
                  <React.Fragment key={consoleItem.id}>
                    <PublicProfileConsoleTable
                      type="trade"
                      consoleItem={consoleItem}
                      isOwner={isOwner}
                      isMarketGrid={true}
                      isExpanded={isExpanded}
                      expandedType={collapseManager.openTableType}
                      onToggleAccessories={
                        canExpand
                          ? () =>
                              collapseManager.handleToggleTable(
                                consoleItem.id as number,
                                "accessories",
                              )
                          : undefined
                      }
                      onToggleGames={
                        canExpand
                          ? () =>
                              collapseManager.handleToggleTable(consoleItem.id as number, "games")
                          : undefined
                      }
                    />
                    {isExpanded && collapseManager.openTableType === "accessories" && (
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <td colSpan={6 + (isOwner ? 1 : 0)} className="p-4">
                          <ConsoleAccessoriesTable
                            item={consoleItem}
                            isOwner={isOwner}
                            sale={true}
                            locale={locale}
                          />
                        </td>
                      </tr>
                    )}
                    {isExpanded && collapseManager.openTableType === "games" && (
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <td colSpan={6 + (isOwner ? 1 : 0)} className="p-4">
                          <ConsoleGamesTable
                            item={consoleItem}
                            isOwner={isOwner}
                            sale={true}
                            userSlug={userSlug}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {isOwner && (
            <EmptyCard
              text={t("txtConsole")}
              buttonLabel={type === "selling" ? t("txtSellConsole") : t("txtLookForConsole")}
              buttonLink={`/user/collection/consoles/add?type=trade&status=${
                type === "selling" ? "SELLING" : "LOOKING_FOR"
              }`}
              viewMode="list"
            />
          )}
          {consoles.map((consoleItem: UserConsole) => {
            const isOpen = collapseManager.openListId === consoleItem.id;
            return (
              <div key={consoleItem.id} className="flex flex-col gap-2">
                <PublicProfileConsoleList
                  type="trade"
                  consoleItem={consoleItem}
                  isOwner={isOwner}
                  isExpanded={isOpen}
                  expandedType={collapseManager.openListType}
                  onToggleAccessories={() =>
                    collapseManager.handleToggleList(consoleItem.id as number, "accessories")
                  }
                  onToggleGames={() =>
                    collapseManager.handleToggleList(consoleItem.id as number, "games")
                  }
                />
                {isOpen && collapseManager.openListType === "accessories" && (
                  <div>
                    <ConsoleAccessoriesList item={consoleItem} isOwner={isOwner} sale={true} />
                  </div>
                )}
                {isOpen && collapseManager.openListType === "games" && (
                  <div>
                    <ConsoleGamesList
                      item={consoleItem}
                      isOwner={isOwner}
                      sale={true}
                      userSlug={userSlug}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : viewMode === "compact" ? (
        <div className="flex flex-wrap gap-3">
          {isOwner && (
            <div
              className="
                box-border min-w-0 flex flex-col
                flex-[0_0_calc(33.333%_-_.5rem)]
                md:flex-[0_0_calc(25%_-_.5625rem)]
                lg:flex-[0_0_calc(16.666%_-_.625rem)]
                xl:flex-[0_0_calc(12.5%_-_.65625rem)]
              "
            >
              <EmptyCard
                text={t("txtConsole")}
                buttonLabel={type === "selling" ? t("txtSellConsole") : t("txtLookForConsole")}
                buttonLink={`/user/collection/consoles/add?type=trade&status=${
                  type === "selling" ? "SELLING" : "LOOKING_FOR"
                }`}
                viewMode="compact"
              />
            </div>
          )}
          {consoles.map((consoleItem: UserConsole, index: number) => {
            const isOpen = collapseManager.openCompactId === consoleItem.id;

            const gridIndex = isOwner ? index + 1 : index;
            const rowStart = gridIndex - (gridIndex % compactCols);
            const rowEndIndex = rowStart + (compactCols - 1);
            const isRowEnd =
              gridIndex === rowEndIndex ||
              gridIndex === (isOwner ? consoles.length : consoles.length - 1);

            const shouldRenderRow =
              collapseManager.openCompactRowStart !== null &&
              isRowEnd &&
              gridIndex >= collapseManager.openCompactRowStart &&
              gridIndex < collapseManager.openCompactRowStart + compactCols;

            return (
              <div key={consoleItem.id} className="contents">
                <div
                  className="
                    box-border min-w-0 flex flex-col
                    flex-[0_0_calc(33.333%_-_.5rem)]
                    md:flex-[0_0_calc(25%_-_.5625rem)]
                    lg:flex-[0_0_calc(16.666%_-_.625rem)]
                    xl:flex-[0_0_calc(12.5%_-_.65625rem)]
                  "
                >
                  <PublicProfileConsoleCompact
                    type="trade"
                    consoleItem={consoleItem}
                    isOwner={isOwner}
                    isExpanded={isOpen}
                    expandedType={collapseManager.openCompactType}
                    onToggleAccessories={() =>
                      collapseManager.handleToggleCompact(
                        gridIndex,
                        consoleItem.id as number,
                        compactCols,
                        "accessories",
                      )
                    }
                    onToggleGames={() =>
                      collapseManager.handleToggleCompact(
                        gridIndex,
                        consoleItem.id as number,
                        compactCols,
                        "games",
                      )
                    }
                  />
                </div>

                {shouldRenderRow && collapseManager.openCompactType === "accessories" && (
                  <div className="basis-full">
                    <ConsoleAccessoriesCompact
                      item={consoles.find((c) => c.id === collapseManager.openCompactId)}
                      isOwner={isOwner}
                      sale={true}
                      columnIndex={
                        (consoles.findIndex((c) => c.id === collapseManager.openCompactId) +
                          (isOwner ? 1 : 0)) %
                        compactCols
                      }
                      totalColumns={compactCols}
                    />
                  </div>
                )}
                {shouldRenderRow && collapseManager.openCompactType === "games" && (
                  <div className="basis-full">
                    <ConsoleGamesCompact
                      item={consoles.find((c) => c.id === collapseManager.openCompactId)}
                      isOwner={isOwner}
                      sale={true}
                      userSlug={userSlug}
                      columnIndex={
                        (consoles.findIndex((c) => c.id === collapseManager.openCompactId) +
                          (isOwner ? 1 : 0)) %
                        compactCols
                      }
                      totalColumns={compactCols}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {isOwner && (
            <div
              className="
                box-border min-w-0
                flex-[0_0_calc(50%_-_.75rem)]
                md:flex-[0_0_calc(33.333%_-_1rem)]
                lg:flex-[0_0_calc(25%_-_1.125rem)]
                flex flex-col
              "
            >
              <EmptyCard
                text={t("txtConsole")}
                buttonLabel={type === "selling" ? t("txtSellConsole") : t("txtLookForConsole")}
                buttonLink={`/user/collection/consoles/add?type=trade&status=${
                  type === "selling" ? "SELLING" : "LOOKING_FOR"
                }`}
                viewMode="card"
              />
            </div>
          )}
          {consoles.map((consoleItem: UserConsole, index: number) => {
            const isOpen = collapseManager.openGridId === consoleItem.id;

            const gridIndex = isOwner ? index + 1 : index;
            const rowStart = gridIndex - (gridIndex % gridCols);
            const rowEndIndex = rowStart + (gridCols - 1);
            const isRowEnd =
              gridIndex === rowEndIndex ||
              gridIndex === (isOwner ? consoles.length : consoles.length - 1);

            const shouldRenderRow =
              collapseManager.openGridRowStart !== null &&
              isRowEnd &&
              gridIndex >= collapseManager.openGridRowStart &&
              gridIndex < collapseManager.openGridRowStart + gridCols;

            return (
              <div key={consoleItem.id} className="contents">
                <div
                  className="
                    box-border min-w-0
                    flex-[0_0_calc(50%_-_.75rem)]
                    md:flex-[0_0_calc(33.333%_-_1rem)]
                    lg:flex-[0_0_calc(25%_-_1.125rem)]
                    flex flex-col
                  "
                >
                  <PublicProfileConsoleCard
                    type="trade"
                    consoleItem={consoleItem}
                    isOwner={isOwner}
                    isExpanded={isOpen}
                    expandedType={collapseManager.openGridType}
                    onToggleAccessories={() =>
                      collapseManager.handleToggleGrid(
                        gridIndex,
                        consoleItem.id as number,
                        gridCols,
                        "accessories",
                      )
                    }
                    onToggleGames={() =>
                      collapseManager.handleToggleGrid(
                        gridIndex,
                        consoleItem.id as number,
                        gridCols,
                        "games",
                      )
                    }
                  />
                </div>

                {shouldRenderRow && collapseManager.openGridType === "accessories" && (
                  <div className="basis-full">
                    <ConsoleAccessories
                      item={consoles.find((c) => c.id === collapseManager.openGridId)}
                      isOwner={isOwner}
                      sale={true}
                      columnIndex={
                        (consoles.findIndex((c) => c.id === collapseManager.openGridId) +
                          (isOwner ? 1 : 0)) %
                        gridCols
                      }
                      totalColumns={gridCols}
                    />
                  </div>
                )}
                {shouldRenderRow && collapseManager.openGridType === "games" && (
                  <div className="basis-full">
                    <ConsoleGames
                      item={consoles.find((c) => c.id === collapseManager.openGridId)}
                      isOwner={isOwner}
                      sale={true}
                      userSlug={userSlug}
                      columnIndex={
                        (consoles.findIndex((c) => c.id === collapseManager.openGridId) +
                          (isOwner ? 1 : 0)) %
                        gridCols
                      }
                      totalColumns={gridCols}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {consolesMeta && consolesMeta.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={consolesMeta.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
