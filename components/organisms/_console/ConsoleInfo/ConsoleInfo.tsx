// components/organisms/ConsoleInfo/ConsoleInfo.tsx
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { normalizeImageUrl } from "@/utils/validate-url";
import { Card } from "@/components/atoms/Card/Card";
import {
  Gamepad,
  Cpu,
  Monitor,
  Volume2,
  Wifi,
  HardDrive,
  Disc,
  Calendar,
  Package,
  RefreshCw,
  Download,
  Lightbulb,
  MemoryStick,
  Disc3,
} from "lucide-react";
import { Tooltip } from "@/components/atoms/Tooltip/Tooltip";
import { Badge } from "@/components/atoms/Badge/Badge";
import { MediaFormat, StorageOption } from "@/@types/catalog.types";

interface ConsoleInfoProps {
  consoleVariant: {
    imageUrl?: string | null;
    consoleName: string;
    name: string;
    brand: { id: number; slug: string; imageUrl?: string };
    generation?: number | null;
    type?: string | null;
    releaseDate?: string | null;
    storageOptions: StorageOption[];
    launchDate?: string | null;
    consoleDescription?: string | null;
    allDigital: boolean;
    cpu?: string | null;
    gpu?: string | null;
    ram?: string | null;
    resolution?: string | null;
    audio?: string | null;
    connectivity?: string | null;
    retroCompatible: boolean;
    retroCompatibilityNotes?: string | null;
    mediaFormats: MediaFormat[];
    notes: { id: number; text: string }[]; // Novo campo para curiosidades
  };
}

interface InfoBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  className?: string;
}

function InfoBadge({ icon, label, value, className = "" }: InfoBadgeProps) {
  return (
    <Tooltip title={label}>
      <div
        className={`flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg ${className}`}
      >
        <span className="text-gray-600 dark:text-gray-300">{icon}</span>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
      </div>
    </Tooltip>
  );
}

export default function ConsoleInfo({ consoleVariant }: ConsoleInfoProps) {
  const t = useTranslations("ConsoleDetails");
  const imageUrl = consoleVariant.imageUrl;
  const [imageError, setImageError] = useState(false);

  const formatStorageOptions = (options: StorageOption[]) => {
    return options
      .map((opt) => {
        let formatted = `${opt.value} ${opt.unit}`;
        if (opt.note) {
          formatted += ` (${opt.note})`;
        }
        return formatted;
      })
      .join(", ");
  };

  const formatMediaFormats = (formats: MediaFormat[]) => {
    return formats.map((f) => f.name).join(", ");
  };

  const formatReleaseDate = () => {
    if (!consoleVariant.releaseDate && !consoleVariant.launchDate) return "-";

    const consoleDate = consoleVariant.releaseDate
      ? new Date(consoleVariant.releaseDate).toLocaleDateString()
      : null;

    const variantDate =
      consoleVariant.launchDate && consoleVariant.launchDate !== consoleVariant.releaseDate
        ? new Date(consoleVariant.launchDate).toLocaleDateString()
        : null;

    if (consoleDate && variantDate) {
      return (
        <div className="flex flex-col">
          <span>
            {consoleDate} ({t("console")})
          </span>
          <span>
            {variantDate} ({consoleVariant.name})
          </span>
        </div>
      );
    }

    return consoleDate || variantDate || "-";
  };

  return (
    <Card className="mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Coluna da esquerda - Imagem, marca e geração */}
        <div className="md:w-1/3">
          <div className="w-full aspect-[4/3] relative mb-4">
            {imageError ? (
              <div className="absolute inset-0 bg-gray-200 border-2 border-dashed rounded-xl text-gray-400 flex items-center justify-center dark:bg-gray-700">
                <Gamepad size={40} className="mx-auto" />
                <span className="sr-only">{t("noImage")}</span>
              </div>
            ) : (
              <Image
                src={normalizeImageUrl(imageUrl!)}
                alt={`${consoleVariant.consoleName} ${consoleVariant.name}`}
                fill
                className="rounded-lg object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {/* Marca e geração abaixo da imagem */}
          <div className="flex flex-col items-center gap-3">
            <Image
              src={"/images/brands/" + consoleVariant.brand.slug + ".svg"}
              alt={consoleVariant.brand.slug}
              width={100}
              height={100}
              className="object-contain"
            />

            {consoleVariant.generation && (
              <Badge variant="solid" className="text-sm">
                {consoleVariant.generation}º Gen
              </Badge>
            )}
          </div>
        </div>

        {/* Coluna da direita - Informações detalhadas */}
        <div className="md:w-2/3">
          {/* Cabeçalho com nome e badges */}
          <div className="flex flex-col gap-4 mb-6">
            <h1 className="text-3xl font-bold">
              {consoleVariant.consoleName} {consoleVariant.name}
            </h1>

            <div className="flex flex-wrap gap-3">
              {/* Tipo */}
              {consoleVariant.type && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Package size={14} />
                  {consoleVariant.type}
                </Badge>
              )}

              {/* All Digital */}
              <Badge
                variant={consoleVariant.allDigital ? "soft" : "outline"}
                className="flex items-center gap-1"
              >
                {consoleVariant.allDigital ? <Download size={14} /> : <Disc3 size={14} />}
                {consoleVariant.allDigital ? t("allDigital") : t("physicalMedia")}
              </Badge>

              {/* Retrocompatibilidade */}
              <Badge
                variant={consoleVariant.retroCompatible ? "soft" : "outline"}
                className="flex items-center gap-1"
              >
                <RefreshCw size={14} />
                {consoleVariant.retroCompatible ? t("retroCompatible") : t("notRetroCompatible")}
              </Badge>
            </div>
          </div>

          {/* Especificações técnicas */}
          {(consoleVariant.cpu ||
            consoleVariant.gpu ||
            consoleVariant.ram ||
            consoleVariant.resolution ||
            consoleVariant.audio ||
            consoleVariant.connectivity) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">{t("specifications")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {consoleVariant.cpu && (
                  <InfoBadge icon={<Cpu size={18} />} label={t("cpu")} value={consoleVariant.cpu} />
                )}
                {consoleVariant.gpu && (
                  <InfoBadge
                    icon={<Monitor size={18} />}
                    label={t("gpu")}
                    value={consoleVariant.gpu}
                  />
                )}
                {consoleVariant.ram && (
                  <InfoBadge
                    icon={<MemoryStick size={18} />}
                    label={t("ram")}
                    value={consoleVariant.ram}
                  />
                )}
                {consoleVariant.resolution && (
                  <InfoBadge
                    icon={<Monitor size={18} />}
                    label={t("resolution")}
                    value={consoleVariant.resolution}
                  />
                )}
                {consoleVariant.audio && (
                  <InfoBadge
                    icon={<Volume2 size={18} />}
                    label={t("audio")}
                    value={consoleVariant.audio}
                  />
                )}
                {consoleVariant.connectivity && (
                  <InfoBadge
                    icon={<Wifi size={18} />}
                    label={t("connectivity")}
                    value={consoleVariant.connectivity}
                  />
                )}
              </div>
            </div>
          )}

          {/* Armazenamento e mídia */}
          {(consoleVariant.storageOptions.length > 0 || consoleVariant.mediaFormats.length > 0) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">{t("storageAndMedia")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {consoleVariant.storageOptions.length > 0 && (
                  <InfoBadge
                    icon={<HardDrive size={18} />}
                    label={t("storage")}
                    value={formatStorageOptions(consoleVariant.storageOptions)}
                  />
                )}
                {consoleVariant.mediaFormats.length > 0 && (
                  <InfoBadge
                    icon={<Disc size={18} />}
                    label={t("mediaFormats")}
                    value={formatMediaFormats(consoleVariant.mediaFormats)}
                  />
                )}
              </div>
            </div>
          )}

          {/* Notas de retrocompatibilidade */}
          {consoleVariant.retroCompatibilityNotes && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw size={18} className="text-gray-600 dark:text-gray-300" />
                <h3 className="text-lg font-semibold">{t("retroCompatibilityNotes")}</h3>
              </div>
              <p className="text-gray-900 dark:text-gray-100">
                {consoleVariant.retroCompatibilityNotes}
              </p>
            </div>
          )}

          {/* Data de lançamento (movida para baixo) */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} className="text-gray-600 dark:text-gray-300" />
              <h3 className="text-lg font-semibold">{t("releaseDates")}</h3>
            </div>
            <div className="text-gray-900 dark:text-gray-100">{formatReleaseDate()}</div>
          </div>

          {/* Curiosidades */}
          {consoleVariant.notes && consoleVariant.notes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={18} className="text-yellow-500" />
                <h3 className="text-lg font-semibold">
                  {t("funFactsAbout", { console: consoleVariant.consoleName })}
                </h3>
              </div>
              <ul className="space-y-2">
                {consoleVariant.notes.map((note) => (
                  <li key={note.id} className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span className="text-gray-900 dark:text-gray-100">{note.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* {consoleVariant.consoleDescription && (
            <div>
              <h3 className="text-lg font-semibold mb-2">{t("description")}</h3>
              <p className="text-gray-900 dark:text-gray-100">
                {consoleVariant.consoleDescription}
              </p>
            </div>
          )} */}
        </div>
      </div>
    </Card>
  );
}
