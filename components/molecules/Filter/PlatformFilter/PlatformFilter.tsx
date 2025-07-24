// components/molecules/Filter/PlatformFilter.tsx
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { useTranslations } from "next-intl";
import React from "react";

interface PlatformFilterProps {
  selectedPlatforms: string[];
  onPlatformChange: (selectedPlatforms: string[]) => void;
}

const PlatformFilter = ({ selectedPlatforms, onPlatformChange }: PlatformFilterProps) => {
  const t = useTranslations();
  // Esta lista pode vir de uma API ou ser estática
  const platforms = [
    { value: "pc", label: t("filters.platforms.pc") },
    { value: "playstation", label: t("filters.platforms.playstation") },
    { value: "xbox", label: t("filters.platforms.xbox") },
    { value: "nintendo", label: t("filters.platforms.nintendo") },
    { value: "mobile", label: t("filters.platforms.mobile") },
  ];

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedPlatforms = checked
      ? [...selectedPlatforms, value]
      : selectedPlatforms.filter((platform) => platform !== value);

    onPlatformChange(newSelectedPlatforms);
  };

  return (
    <div className="mb-4">
      <p className="font-medium text-lg">{t("filters.platforms.label")}</p>
      {platforms.map((platform) => (
        <div key={platform.value} className="flex items-center">
          <Checkbox
            name="platform"
            value={platform.value}
            checked={selectedPlatforms.includes(platform.value)}
            onChange={handleCheckboxChange}
            label={platform.label}
          />
        </div>
      ))}
    </div>
  );
};

export default PlatformFilter;
