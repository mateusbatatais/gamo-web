// components/molecules/Filter/MediaFormatFilter/MediaFormatFilter.tsx
"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import useMediaFormats from "@/hooks/useMediaFormats";

interface MediaFormatFilterProps {
  selectedMediaFormats: string[];
  onMediaFormatChange: (selectedMediaFormats: string[]) => void;
}

const MediaFormatFilter = ({
  selectedMediaFormats,
  onMediaFormatChange,
}: MediaFormatFilterProps) => {
  const { data: mediaFormats, isLoading, error } = useMediaFormats();
  const t = useTranslations();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedMediaFormats = checked
      ? [...selectedMediaFormats, value]
      : selectedMediaFormats.filter((format) => format !== value);

    onMediaFormatChange(newSelectedMediaFormats);
  };

  if (isLoading)
    return (
      <div>
        <Skeleton className="h-6 w-1/2 mb-3" animated />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2" rounded="sm" animated />
              <Skeleton className="h-4 w-3/4" animated />
            </div>
          ))}
        </div>
      </div>
    );

  if (error) return <div>{error.message}</div>;
  if (!mediaFormats) return null;

  return (
    <div className="mb-4">
      <p className="font-medium text-lg">{t("filters.mediaFormats.label")}</p>
      {mediaFormats.map((format) => (
        <div key={format.slug} className="flex items-center">
          <Checkbox
            name="mediaFormat"
            value={format.slug}
            checked={selectedMediaFormats.includes(format.slug)}
            onChange={handleCheckboxChange}
            label={format.name}
          />
        </div>
      ))}
    </div>
  );
};

export default MediaFormatFilter;
