// app/[locale]/profile/collection/consoles/add/page.tsx
"use client";

import { useEffect, useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";

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
      className={`w-full cursor-pointer text-left transition-all focus:outline-none rounded-md ${className} ${
        isSelected
          ? "ring-2 ring-primary-500 dark:ring-primary-400 bg-primary-50 dark:bg-primary-900/20"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

function ImageWithFallback({
  src,
  alt,
  monitorSize = 32,
  fallbackClassName = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  imgClassName = "object-cover",
}: {
  src?: string | null;
  alt: string;
  monitorSize?: number;
  fallbackClassName?: string;
  sizes?: string;
  imgClassName?: string;
}) {
  const [error, setError] = useState(false);

  if (src && !error) {
    return (
      <Image
        src={normalizeImageUrl(src)}
        alt={alt}
        fill
        className={imgClassName}
        onError={() => setError(true)}
        sizes={sizes}
      />
    );
  }

  return (
    <div className={fallbackClassName}>
      <Monitor size={monitorSize} className="text-gray-400 dark:text-gray-500" />
    </div>
  );
}

export default function AddConsolePage() {
  const { user } = useAuth();

  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = useTranslations("AddConsole");
  const { setItems } = useBreadcrumbs();

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

  useEffect(() => {
    setItems([
      { label: user?.slug || "", href: `/user/${user?.slug}` },
      {
        label: t("title"),
      },
    ]);

    return () => setItems([]);
  }, [setItems, t, user]);

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
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {brands?.map((brand) => (
                  <SelectableItem
                    key={brand.slug}
                    isSelected={selectedBrand === brand.slug}
                    onClick={() => handleBrandSelect(brand.slug)}
                    className="p-3 rounded-md text-center font-medium capitalize"
                  >
                    <Image
                      src={"/images/brands/" + brand.slug + ".svg"}
                      alt={brand.slug}
                      width={60}
                      height={60}
                      className={
                        selectedBrand === brand.slug
                          ? "object-contain m-auto text-primary-600 dark:text-primary-400"
                          : "object-contain m-auto text-gray-900 dark:text-white"
                      }
                    />
                  </SelectableItem>
                ))}
              </div>
            )}
          </SelectionSection>

          {selectedBrand && (
            <SelectionSection title={t("selectVariant")} isSelected={currentStep === "variant"}>
              {variantsLoading ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-2">
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
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-2">
                  {variants?.items.map((variant) => (
                    <SelectableItem
                      key={variant.id}
                      isSelected={selectedVariant?.id === variant.id}
                      onClick={() => handleVariantSelect(variant)}
                      className="p-0 overflow-hidden"
                    >
                      <Card className="h-full border-0 !p-0">
                        <div className="h-20 relative">
                          <ImageWithFallback
                            src={variant.imageUrl}
                            alt={variant.name}
                            monitorSize={32}
                            fallbackClassName="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-[0.5rem] text-gray-600 dark:text-gray-400">
                            {variant.consoleName} ({variant.name})
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
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-2">
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
                  {variantDetails?.skins && variantDetails.skins.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-2">
                      {variantDetails.skins.map((skin) => (
                        <SelectableItem
                          key={skin.id}
                          isSelected={selectedSkin?.id === skin.id}
                          onClick={() => handleSkinSelect(skin)}
                          className="p-0 overflow-hidden"
                        >
                          <Card className="border-0 h-full !p-0">
                            <div className="h-24 relative">
                              <ImageWithFallback
                                src={skin.imageUrl}
                                alt={skin.name}
                                monitorSize={28}
                                fallbackClassName="bg-gray-100 dark:bg-gray-800 w-full h-full flex items-center justify-center"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                            <div className="p-2">
                              <p className="font-medium text-[0.5rem] text-gray-900 dark:text-white line-clamp-2">
                                {skin.name}
                              </p>
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
                  consoleId={variantDetails?.consoleId || 0}
                  consoleVariantId={selectedVariant.id}
                  variantSlug={selectedVariant.slug}
                  skinId={selectedSkin?.id || null}
                  onSuccess={() => {
                    window.location.href = `/user/${user?.slug}`;
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
