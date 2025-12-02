"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useTranslations } from "next-intl";
import { UserKit } from "@/@types/collection.types";
import { PaginationMeta } from "@/@types/catalog.types";
import { ViewMode } from "@/@types/catalog-state.types";
import { Card } from "@/components/atoms/Card/Card";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { useDeleteUserKit } from "@/hooks/usePublicProfile";
import { Button } from "@/components/atoms/Button/Button";
import { Edit, Trash2, Package } from "lucide-react";

interface KitsSectionProps {
  kits: UserKit[];
  kitsMeta: PaginationMeta | undefined;
  isOwner: boolean;
  type: string;
  viewMode: ViewMode;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const KitsSection = ({
  kits,
  kitsMeta,
  isOwner,
  viewMode,
  currentPage,
  onPageChange,
}: KitsSectionProps) => {
  const t = useTranslations("PublicProfile");
  const router = useRouter();
  const deleteKitMutation = useDeleteUserKit();

  if (kits.length === 0) {
    return null;
  }

  const handleDelete = (id: number) => {
    if (confirm(t("confirmDeleteKit"))) {
      deleteKitMutation.mutate(id);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/marketplace/sell/kit/${id}`);
  };

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-6 h-6 text-primary-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("kits")}</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">({kitsMeta?.total || 0})</span>
      </div>

      <div
        className={
          viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
        }
      >
        {kits.map((kit) => (
          <Card key={kit.id} className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {kit.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                  {kit.description}
                </p>
              </div>
              <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(kit.price)}
              </div>
            </div>

            <div className="flex-1 space-y-3 mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">{t("items")}:</span>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {kit.items.games.length > 0 && (
                    <li>
                      {kit.items.games.length} {t("gamesLabel")}
                    </li>
                  )}
                  {kit.items.consoles.length > 0 && (
                    <li>
                      {kit.items.consoles.length} {t("consolesLabel")}
                    </li>
                  )}
                  {kit.items.accessories.length > 0 && (
                    <li>
                      {kit.items.accessories.length} {t("accessoriesLabel")}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {isOwner && (
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button
                  variant="transparent"
                  size="sm"
                  onClick={() => handleEdit(kit.id)}
                  icon={<Edit size={16} />}
                  className="text-gray-500 hover:text-primary-600"
                />
                <Button
                  variant="transparent"
                  size="sm"
                  onClick={() => handleDelete(kit.id)}
                  icon={<Trash2 size={16} />}
                  className="text-gray-500 hover:text-red-600"
                  loading={deleteKitMutation.isPending}
                />
              </div>
            )}
          </Card>
        ))}
      </div>

      {kitsMeta && kitsMeta.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={kitsMeta.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
