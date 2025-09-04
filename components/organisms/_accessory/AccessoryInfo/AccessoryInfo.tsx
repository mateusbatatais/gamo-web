// components/organisms/AccessoryInfo/AccessoryInfo.tsx
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { normalizeImageUrl } from "@/utils/validate-url";
import { Card } from "@/components/atoms/Card/Card";
import { Calendar, Package, Gamepad } from "lucide-react";
import { Badge } from "@/components/atoms/Badge/Badge";
import { AccessoryDetail } from "@/@types/catalog.types";

interface AccessoryInfoProps {
  accessory: AccessoryDetail;
}

export default function AccessoryInfo({ accessory }: AccessoryInfoProps) {
  const t = useTranslations("AccessoryDetails");
  const imageUrl = accessory.imageUrl;
  const [imageError, setImageError] = useState(false);

  const formatReleaseDate = () => {
    if (!accessory.releaseDate) return "-";
    return new Date(accessory.releaseDate).toLocaleDateString();
  };

  return (
    <Card className="mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Coluna da esquerda - Imagem */}
        <div className="md:w-1/3">
          <div className="w-full aspect-square relative mb-4">
            {imageError ? (
              <div className="absolute inset-0 bg-gray-200 border-2 border-dashed rounded-xl text-gray-400 flex items-center justify-center dark:bg-gray-700">
                <Package size={40} className="mx-auto" />
                <span className="sr-only">{t("noImage")}</span>
              </div>
            ) : (
              <Image
                src={normalizeImageUrl(imageUrl!)}
                alt={accessory.name}
                fill
                className="rounded-lg object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            )}
          </div>
        </div>

        {/* Coluna da direita - Informações detalhadas */}
        <div className="md:w-2/3">
          {/* Cabeçalho com nome e badges */}
          <div className="flex flex-col gap-4 mb-6">
            <h1 className="text-3xl font-bold">{accessory.name}</h1>

            <div className="flex flex-wrap gap-3">
              {/* Tipo */}
              <Badge variant="outline" className="flex items-center gap-1">
                <Package size={14} />
                {accessory.type}
              </Badge>

              {/* Subtipo */}
              {accessory.subType && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Package size={14} />
                  {accessory.subType}
                </Badge>
              )}
            </div>
          </div>

          {/* Descrição */}
          {accessory.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{t("description")}</h3>
              <p className="text-gray-900 dark:text-gray-100">{accessory.description}</p>
            </div>
          )}

          {/* Data de lançamento */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} className="text-gray-600 dark:text-gray-300" />
              <h3 className="text-lg font-semibold">{t("releaseDate")}</h3>
            </div>
            <div className="text-gray-900 dark:text-gray-100">{formatReleaseDate()}</div>
          </div>

          {/* Consoles compatíveis */}
          {accessory.consoles.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Gamepad size={18} className="text-gray-600 dark:text-gray-300" />
                <h3 className="text-lg font-semibold">{t("compatibleConsoles")}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {accessory.consoles.map((console) => (
                  <Badge key={console.id} variant="soft">
                    {console.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
