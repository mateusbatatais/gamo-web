// app/[locale]/profile/collection/consoles/add/page.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useConsoles } from "@/hooks/useConsoles";
import { ConsoleVariant, SkinDetail } from "@/@types/catalog.types";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import Image from "next/image";
import { normalizeImageUrl } from "@/utils/validate-url";
import { Monitor } from "lucide-react";
import useBrands from "@/hooks/filters/useBrands";
import useConsoleDetails from "@/hooks/useConsoleDetails";
import { ConsoleForm } from "@/components/organisms/_console/ConsoleForm/ConsoleForm";
import { Card } from "@/components/atoms/Card/Card";

type Step = "brand" | "variant" | "skin" | "form";

interface SelectionSectionProps {
  title: string;
  children: React.ReactNode;
  isSelected: boolean;
}

function SelectionSection({ title, children, isSelected }: SelectionSectionProps) {
  return (
    <div
      className={`p-4 rounded-lg border ${isSelected ? "border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20" : "border-gray-200 dark:border-gray-700"}`}
    >
      <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">{title}</h3>
      {children}
    </div>
  );
}

function SelectableItem({
  children,
  isSelected,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md ${className} ${
        isSelected
          ? "ring-2 ring-primary-500 dark:ring-primary-400 bg-primary-50 dark:bg-primary-900/20"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

export default function AddConsolePage() {
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = useTranslations("AddConsole");

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<ConsoleVariant | null>(null);
  const [selectedSkin, setSelectedSkin] = useState<SkinDetail | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("brand");

  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: variants, isLoading: variantsLoading } = useConsoles({
    locale: locale || "pt",
    page: 1,
    perPage: 100,
    selectedBrands: selectedBrand ? [selectedBrand] : [],
  });

  const { data: variantDetails, isLoading: detailsLoading } = useConsoleDetails(
    selectedVariant?.slug || "",
    locale || "pt",
  );

  const handleBrandSelect = (brandSlug: string) => {
    setSelectedBrand(brandSlug);
    setSelectedVariant(null);
    setSelectedSkin(null);
    setCurrentStep("variant");
  };

  const handleVariantSelect = (variant: ConsoleVariant) => {
    setSelectedVariant(variant);
    setSelectedSkin(null);
    setCurrentStep("skin");
  };

  const handleSkinSelect = (skin: SkinDetail | null) => {
    setSelectedSkin(skin);
    setCurrentStep("form");
  };

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t("title")}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Coluna de seleção */}
        <div className="flex-1 space-y-6">
          {/* Seção de Marcas */}
          <SelectionSection title={t("selectBrand")} isSelected={currentStep === "brand"}>
            {brandsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-md" animated />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {brands?.map((brand) => (
                  <SelectableItem
                    key={brand.slug}
                    isSelected={selectedBrand === brand.slug}
                    onClick={() => handleBrandSelect(brand.slug)}
                    className="p-3 rounded-md text-center font-medium capitalize"
                  >
                    <span
                      className={
                        selectedBrand === brand.slug
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-900 dark:text-white"
                      }
                    >
                      {brand.slug}
                    </span>
                  </SelectableItem>
                ))}
              </div>
            )}
          </SelectionSection>

          {/* Seção de Variantes (apenas se marca selecionada) */}
          {selectedBrand && (
            <SelectionSection title={t("selectVariant")} isSelected={currentStep === "variant"}>
              {variantsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="p-0 overflow-hidden">
                      <Skeleton className="h-32 w-full" animated />
                      <div className="p-3">
                        <Skeleton className="h-5 w-3/4 mb-2" animated />
                        <Skeleton className="h-4 w-1/2" animated />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {variants?.items.map((variant) => (
                    <SelectableItem
                      key={variant.id}
                      isSelected={selectedVariant?.id === variant.id}
                      onClick={() => handleVariantSelect(variant)}
                      className="p-0 overflow-hidden"
                    >
                      <Card className="h-full border-0">
                        <div className="h-32 relative">
                          {variant.imageUrl ? (
                            <Image
                              src={normalizeImageUrl(variant.imageUrl)}
                              alt={variant.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center">
                              <Monitor size={32} className="text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                            {variant.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {variant.consoleName}
                          </p>
                        </div>
                      </Card>
                    </SelectableItem>
                  ))}
                </div>
              )}
            </SelectionSection>
          )}

          {/* Seção de Skins (apenas se variante selecionada) */}
          {selectedVariant && (
            <SelectionSection title={t("selectSkin")} isSelected={currentStep === "skin"}>
              {detailsLoading ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {[...Array(10)].map((_, i) => (
                    <Card key={i} className="p-0 overflow-hidden">
                      <Skeleton className="h-24 w-full" animated />
                      <div className="p-2">
                        <Skeleton className="h-4 w-3/4" animated />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  <SelectableItem
                    isSelected={selectedSkin === null}
                    onClick={() => handleSkinSelect(null)}
                    className="mb-4 p-0 overflow-hidden"
                  >
                    <Card className="border-0">
                      <div className="h-24 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Monitor size={28} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <div className="p-2 text-center">
                        <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                          {t("defaultSkin")}
                        </h3>
                      </div>
                    </Card>
                  </SelectableItem>

                  {variantDetails?.skins && variantDetails.skins.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {variantDetails.skins.map((skin) => (
                        <SelectableItem
                          key={skin.id}
                          isSelected={selectedSkin?.id === skin.id}
                          onClick={() => handleSkinSelect(skin)}
                          className="p-0 overflow-hidden"
                        >
                          <Card className="border-0 h-full">
                            <div className="h-24 relative">
                              {skin.imageUrl ? (
                                <Image
                                  src={normalizeImageUrl(skin.imageUrl)}
                                  alt={skin.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="bg-gray-100 dark:bg-gray-800 w-full h-full flex items-center justify-center">
                                  <Monitor size={28} className="text-gray-400 dark:text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="p-2">
                              <h3 className="font-medium text-xs text-gray-900 dark:text-white line-clamp-2">
                                {skin.name}
                              </h3>
                              {skin.editionName && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                  {skin.editionName}
                                </p>
                              )}
                            </div>
                          </Card>
                        </SelectableItem>
                      ))}
                    </div>
                  )}
                </>
              )}
            </SelectionSection>
          )}
        </div>

        {/* Coluna do formulário */}
        <div className="w-full lg:w-1/2">
          {currentStep === "form" && selectedVariant && (
            <div className="sticky top-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {t("formTitle")}
                </h2>
                <ConsoleForm
                  mode="create"
                  consoleId={selectedVariant.consoleId}
                  consoleVariantId={selectedVariant.id}
                  variantSlug={selectedVariant.slug}
                  skinId={selectedSkin?.id || null}
                  onSuccess={() => {
                    window.location.href = `/${locale}/profile/collection`;
                  }}
                  onCancel={() => setCurrentStep("skin")}
                />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
