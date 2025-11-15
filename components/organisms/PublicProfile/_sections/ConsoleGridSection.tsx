// components/organisms/PublicProfile/sections/ConsoleGridSection.tsx
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
import { EmptyCard } from "../EmptyCard/EmptyCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { Card } from "@/components/atoms/Card/Card";
import { UseCollapseManagerReturn } from "../_hooks/useCollapseManager";

interface ConsoleGridSectionProps {
  consoles: UserConsole[];
  consolesMeta?: {
    totalPages: number;
  };
  isOwner: boolean | undefined;
  viewMode: ViewMode;
  currentPage: number;
  onPageChange: (page: number) => void;
  collapseManager: UseCollapseManagerReturn;
  gridCols: number;
  compactCols: number;
  locale: string;
  title: string;
  emptyMessage: string;
  addButtonText: string;
  addButtonLink: string;
}

export const ConsoleGridSection: React.FC<ConsoleGridSectionProps> = ({
  consoles,
  consolesMeta,
  isOwner,
  viewMode,
  currentPage,
  onPageChange,
  collapseManager,
  gridCols,
  compactCols,
  title,
  emptyMessage,
  addButtonText,
  addButtonLink,
}) => {
  const t = useTranslations("PublicProfile");

  const consoleHasAccessories = (item: UserConsole) =>
    Array.isArray(item.accessories) && item.accessories.length > 0;

  return (
    <div className="mb-8">
      {/* Header da Seção */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
      </div>

      {/* Conteúdo */}
      {consoles.length === 0 ? (
        <Card>
          <div className="py-12">
            <p className="text-center text-gray-500 dark:text-gray-400 mb-4">{emptyMessage}</p>
            {isOwner && (
              <EmptyCard
                text={t("txtConsole")}
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
                <th className="p-2 w-10" />
                <th className="p-2 text-left">Console</th>
                <th className="p-2 text-left">Skin</th>
                {isOwner && <th className="p-2 text-left">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {isOwner && (
                <tr>
                  <td colSpan={isOwner ? 4 : 3}>
                    <EmptyCard
                      text={t("txtConsole")}
                      buttonLabel={addButtonText}
                      buttonLink={addButtonLink}
                      viewMode="table"
                      space={true}
                    />
                  </td>
                </tr>
              )}
              {consoles.map((consoleItem: UserConsole) => {
                const isExpanded = collapseManager.openTableId === consoleItem.id;
                const canExpand = consoleHasAccessories(consoleItem);
                return (
                  <React.Fragment key={consoleItem.id}>
                    <PublicProfileConsoleTable
                      consoleItem={consoleItem}
                      isOwner={isOwner}
                      isExpanded={isExpanded}
                      onToggleAccessories={
                        canExpand
                          ? () => collapseManager.handleToggleTable(consoleItem.id as number)
                          : undefined
                      }
                    />
                    {isExpanded && (
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <td colSpan={isOwner ? 4 : 3} className="p-4">
                          <ConsoleAccessoriesTable item={consoleItem} isOwner={isOwner} />
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
              buttonLabel={addButtonText}
              buttonLink={addButtonLink}
              viewMode="list"
            />
          )}
          {consoles.map((consoleItem: UserConsole) => {
            const isOpen = collapseManager.openListId === consoleItem.id;
            return (
              <div key={consoleItem.id} className="flex flex-col gap-2">
                <PublicProfileConsoleList
                  consoleItem={consoleItem}
                  isOwner={isOwner}
                  isExpanded={isOpen}
                  onToggleAccessories={() =>
                    collapseManager.handleToggleList(consoleItem.id as number)
                  }
                />
                {isOpen && (
                  <div>
                    <ConsoleAccessoriesList item={consoleItem} isOwner={isOwner} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : viewMode === "compact" ? (
        <div className="flex flex-wrap gap-3">
          {isOwner && (
            <div className="box-border min-w-0 flex flex-col flex-[0_0_calc(33.333%_-_.5rem)] md:flex-[0_0_calc(25%_-_.5625rem)] lg:flex-[0_0_calc(16.666%_-_.625rem)] xl:flex-[0_0_calc(12.5%_-_.65625rem)]">
              <EmptyCard
                text={t("txtConsole")}
                buttonLabel={addButtonText}
                buttonLink={addButtonLink}
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

            const shouldRenderAccessoriesRow =
              collapseManager.openCompactRowStart !== null &&
              isRowEnd &&
              gridIndex >= collapseManager.openCompactRowStart &&
              gridIndex < collapseManager.openCompactRowStart + compactCols;

            return (
              <div key={consoleItem.id} className="contents">
                <div className="box-border min-w-0 flex flex-col flex-[0_0_calc(33.333%_-_.5rem)] md:flex-[0_0_calc(25%_-_.5625rem)] lg:flex-[0_0_calc(16.666%_-_.625rem)] xl:flex-[0_0_calc(12.5%_-_.65625rem)]">
                  <PublicProfileConsoleCompact
                    consoleItem={consoleItem}
                    isOwner={isOwner}
                    isExpanded={isOpen}
                    onToggleAccessories={() =>
                      collapseManager.handleToggleCompact(
                        gridIndex,
                        consoleItem.id as number,
                        compactCols,
                      )
                    }
                  />
                </div>

                {shouldRenderAccessoriesRow && (
                  <div className="basis-full">
                    <ConsoleAccessoriesCompact
                      item={consoles.find((c) => c.id === collapseManager.openCompactId)}
                      isOwner={isOwner}
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
            <div className="box-border min-w-0 flex-[0_0_calc(50%_-_.75rem)] md:flex-[0_0_calc(33.333%_-_1rem)] lg:flex-[0_0_calc(25%_-_1.125rem)] flex flex-col">
              <EmptyCard
                text={t("txtConsole")}
                buttonLabel={addButtonText}
                buttonLink={addButtonLink}
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

            const shouldRenderAccessoriesRow =
              collapseManager.openGridRowStart !== null &&
              isRowEnd &&
              gridIndex >= collapseManager.openGridRowStart &&
              gridIndex < collapseManager.openGridRowStart + gridCols;

            return (
              <div key={consoleItem.id} className="contents">
                <div className="box-border min-w-0 flex-[0_0_calc(50%_-_.75rem)] md:flex-[0_0_calc(33.333%_-_1rem)] lg:flex-[0_0_calc(25%_-_1.125rem)] flex flex-col">
                  <PublicProfileConsoleCard
                    consoleItem={consoleItem}
                    isOwner={isOwner}
                    isExpanded={isOpen}
                    onToggleAccessories={() =>
                      collapseManager.handleToggleGrid(
                        gridIndex,
                        consoleItem.id as number,
                        gridCols,
                      )
                    }
                  />
                </div>

                {shouldRenderAccessoriesRow && (
                  <div className="basis-full">
                    <ConsoleAccessories
                      item={consoles.find((c) => c.id === collapseManager.openGridId)}
                      isOwner={isOwner}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Paginação */}
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
