// app/[locale]/profile/collection/accessories/add/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useAccessories } from "@/hooks/useAccessories";
import { Accessory, AccessoryVariantDetail } from "@/@types/catalog.types";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import useAccessoryDetails from "@/hooks/useAccessoryDetails";
import { AccessoryForm } from "@/components/organisms/_accessory/AccessoryForm/AccessoryForm";
import { Card } from "@/components/atoms/Card/Card";
import { useAuth } from "@/contexts/AuthContext";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback/ImageWithFallback";
import { AutoComplete, AutoCompleteItem } from "@/components/atoms/AutoComplete/AutoComplete";

type Step = "accessory" | "variant" | "form";

interface SelectionSectionProps {
  title: string;
  children: React.ReactNode;
  isSelected: boolean;
  sectionRef?: React.RefObject<HTMLDivElement | null>;
}

function SelectionSection({ title, children, isSelected, sectionRef }: SelectionSectionProps) {
  return (
    <div
      ref={sectionRef}
      className={`p-4 rounded-lg border ${
        isSelected
          ? "border-primary-500 dark:border-primary-700 bg-primary-50 dark:bg-gray-800"
          : "border-gray-200 dark:border-gray-700"
      }`}
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
          ? "ring-1 ring-primary-500 dark:ring-primary-400 bg-primary-50 dark:bg-gray-700"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

export default function AddAccessoryPage() {
  const { user } = useAuth();

  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = useTranslations("AddAccessory");
  const { setItems } = useBreadcrumbs();

  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<AccessoryVariantDetail | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("accessory");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  // Refs para cada seção
  const accessorySectionRef = useRef<HTMLDivElement>(null);
  const variantSectionRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  const { data: accessories, isLoading: accessoriesLoading } = useAccessories({
    locale: locale || "pt",
    page: 1,
    perPage: 20,
    searchQuery,
  });

  const { data: accessoryDetails, isLoading: detailsLoading } = useAccessoryDetails(
    selectedAccessory?.slug || "",
    locale || "pt",
  );

  const type = searchParams.get("type");
  useEffect(() => {
    setItems([
      { label: user?.slug || "", href: `/user/${user?.slug}` },
      {
        label: t("title"),
      },
    ]);

    return () => setItems([]);
  }, [setItems, t, user]);

  // Função robusta para fazer scroll
  const scrollToSection = useCallback((sectionRef: React.RefObject<HTMLDivElement | null>) => {
    const attemptScroll = () => {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return true;
      }
      return false;
    };

    // Tenta imediatamente
    if (attemptScroll()) return;

    // Se não encontrou, tenta novamente após um delay
    const maxAttempts = 5;
    let currentAttempt = 0;

    const interval = setInterval(() => {
      currentAttempt++;
      if (attemptScroll() || currentAttempt >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);
  }, []);

  // useEffect para controlar o scroll baseado no currentStep
  useEffect(() => {
    const timer = setTimeout(() => {
      switch (currentStep) {
        case "variant":
          scrollToSection(variantSectionRef);
          break;
        case "form":
          scrollToSection(formSectionRef);
          break;
        default:
          break;
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [currentStep, scrollToSection]);

  const handleAccessorySelect = (item: AutoCompleteItem) => {
    const accessory = accessories?.items.find((acc) => acc.id === item.id);
    if (accessory) {
      setSelectedAccessory(accessory);
      setSelectedVariant(null);
      setCurrentStep("variant");
    }
  };

  const handleVariantSelect = (variant: AccessoryVariantDetail) => {
    setSelectedVariant(variant);
    setCurrentStep("form");
  };

  const autocompleteItems: AutoCompleteItem[] =
    accessories?.items.map((acc) => ({
      id: acc.id,
      label: acc.name,
      imageUrl: acc.imageUrl,
      type: acc.type,
    })) || [];

  return (
    <div className="container mx-auto max-w-6xl sm:px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t("title")}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <SelectionSection
            title={t("selectAccessory")}
            isSelected={currentStep === "accessory"}
            sectionRef={accessorySectionRef}
          >
            <AutoComplete
              items={autocompleteItems}
              onItemSelect={handleAccessorySelect}
              onSearch={setSearchQuery}
              loading={accessoriesLoading}
              placeholder={t("searchPlaceholder")}
            />
          </SelectionSection>

          {selectedAccessory && (
            <SelectionSection
              title={t("selectVariant")}
              isSelected={currentStep === "variant"}
              sectionRef={variantSectionRef}
            >
              {detailsLoading ? (
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
                  {accessoryDetails?.variants.map((variant) => (
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
                            packageSize={32}
                            fallbackClassName="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-[0.5rem] text-gray-600 dark:text-gray-400">
                            {variant.name}
                          </p>
                        </div>
                      </Card>
                    </SelectableItem>
                  ))}
                </div>
              )}
            </SelectionSection>
          )}
        </div>

        <div className="w-full lg:w-1/2">
          {currentStep === "form" && selectedVariant && (
            <div className="sticky top-4" ref={formSectionRef}>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {t("formTitle")}
                </h2>
                <AccessoryForm
                  mode="create"
                  type={type as "collection" | "trade" | undefined}
                  accessoryId={selectedAccessory!.id}
                  accessoryVariantId={selectedVariant.id}
                  accessorySlug={selectedAccessory!.slug}
                  onSuccess={() => {
                    window.location.href = `/user/${user?.slug}${type === "collection" ? "" : "/market"}`;
                  }}
                  onCancel={() => setCurrentStep("variant")}
                />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
