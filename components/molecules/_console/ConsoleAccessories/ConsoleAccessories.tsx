// components/organisms/ConsoleAccessories/ConsoleAccessories.tsx
import React from "react";
import { useTranslations } from "next-intl";
import { Collapse } from "@/components/atoms/Collapse/Collapse";
import { useAccessoryVariantsByConsole } from "@/hooks/useAccessoriesByConsole";
import { Card } from "@/components/atoms/Card/Card";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import AccessoryVariantCard from "../../_accessory/AccessoryVariantCard/AccessoryVariantCard";

interface ConsoleAccessoriesProps {
  consoleId: number;
}

export default function ConsoleAccessories({ consoleId }: ConsoleAccessoriesProps) {
  const t = useTranslations("ConsoleDetails");
  const [isExpanded, setIsExpanded] = React.useState(false);

  const {
    data: accessories,
    isLoading,
    error,
  } = useAccessoryVariantsByConsole(consoleId, isExpanded);

  const handleToggle = (open: boolean) => {
    setIsExpanded(open);
  };

  return (
    <section className="mb-8">
      <Collapse title={t("viewAccessories")} defaultOpen={false} onToggle={handleToggle}>
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card className="p-4 text-center text-red-500">{t("failedToLoadAccessories")}</Card>
        )}

        {accessories && accessories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {accessories.map((accessory) => (
              <AccessoryVariantCard
                key={accessory.id}
                variant={{
                  id: accessory.id,
                  accessoryId: accessory.accessoryId,
                  slug: accessory.slug || "",
                  name: accessory.name,
                  description: accessory.description,
                  editionName: accessory.editionName,
                  imageUrl: accessory.imageUrl,
                  limitedEdition: false, // Adaptar conforme API
                  material: undefined,
                  finish: undefined,
                }}
                accessoryId={accessory.accessoryId}
              />
            ))}
          </div>
        )}

        {accessories && accessories.length === 0 && (
          <Card className="p-4 text-center text-gray-500">{t("noAccessoriesAvailable")}</Card>
        )}
      </Collapse>
    </section>
  );
}
