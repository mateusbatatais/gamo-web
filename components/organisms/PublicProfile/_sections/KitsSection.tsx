"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useTranslations } from "next-intl";
import { UserKit } from "@/@types/collection.types";
import { PaginationMeta } from "@/@types/catalog.types";
import { ViewMode } from "@/@types/catalog-state.types";
// import { Card } from "@/components/atoms/Card/Card";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { useDeleteUserKit } from "@/hooks/usePublicProfile";
import { Package } from "lucide-react";
import { KitCard } from "@/components/molecules/KitCard/KitCard";

interface KitsSectionProps {
  kits: UserKit[];
  kitsMeta: PaginationMeta | undefined;
  isOwner: boolean | undefined;
  type: string;
  viewMode: ViewMode;
  currentPage: number;
  onPageChange: (page: number) => void;
}

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
          <KitCard
            key={kit.id}
            kit={kit}
            isOwner={isOwner}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteKitMutation.isPending}
          />
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
