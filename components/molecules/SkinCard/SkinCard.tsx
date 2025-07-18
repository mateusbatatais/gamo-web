// components/molecules/SkinCard/SkinCard.tsx

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { normalizeImageUrl } from "@/utils/validate-url";
import { AddToCollection } from "../AddToCollection/AddToCollection";
import { Card } from "@/components/atoms/Card/Card";
import { Badge } from "@/components/atoms/Badge/Badge";
import { Monitor } from "lucide-react";

interface SkinCardProps {
  skin: {
    id: number;
    slug: string;
    name: string;
    editionName?: string | null;
    limitedEdition?: boolean | null;
    material?: string | null;
    finish?: string | null;
    imageUrl?: string | null;
  };
  consoleVariantId: number;
  consoleId: number;
}

const useAddToCollectionFeedback = () => {
  const [recentlyAdded, setRecentlyAdded] = useState<number | null>(null);

  const triggerFeedback = (skinId: number) => {
    setRecentlyAdded(skinId);
    setTimeout(() => setRecentlyAdded(null), 2000); // Remove o feedback após 2 segundos
  };

  return { recentlyAdded, triggerFeedback };
};

export default function SkinCard({ skin, consoleId, consoleVariantId }: SkinCardProps) {
  const t = useTranslations("ConsoleDetails");
  const imageUrl = skin.imageUrl;
  const [imageError, setImageError] = useState(false);
  const { recentlyAdded, triggerFeedback } = useAddToCollectionFeedback();

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 !p-0 relative ${
        recentlyAdded === skin.id ? "ring-2 ring-green-500 scale-[1.02] shadow-xl" : ""
      }`}
    >
      <div className="h-48 relative">
        {imageError ? (
          <div className="bg-gray-200 rounded-top-xl border-2 border-dashed border-gray-300 w-full h-full flex items-center justify-center dark:bg-gray-700 dark:border-gray-600">
            <Monitor size={40} className="mx-auto" />
            <span className="sr-only">{t("noImage")}</span>
          </div>
        ) : (
          <Image
            src={normalizeImageUrl(imageUrl!)}
            alt={skin.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            priority={true}
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
          {skin.name}
        </h3>

        {skin.editionName && (
          <Badge status="primary" className="mb-2">
            {skin.editionName}
          </Badge>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {skin.limitedEdition && <Badge status="danger">{t("limitedEdition")}</Badge>}

          {skin.material && <Badge variant="soft">{skin.material}</Badge>}

          {skin.finish && <Badge variant="soft">{skin.finish}</Badge>}
        </div>

        <div className="mt-4">
          <AddToCollection
            consoleId={consoleId}
            consoleVariantId={consoleVariantId}
            skinId={skin.id}
            onAddSuccess={() => triggerFeedback(skin.id)}
          />
        </div>
      </div>
    </Card>
  );
}
