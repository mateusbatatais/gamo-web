import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { useTranslations } from "next-intl";

interface MediaFilterProps {
  selectedMedia: string[];
  onMediaChange: (selectedMedia: string[]) => void;
}

const MediaFilter = ({ selectedMedia, onMediaChange }: MediaFilterProps) => {
  const t = useTranslations("filters");

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onMediaChange([...selectedMedia, value]);
    } else {
      onMediaChange(selectedMedia.filter((item) => item !== value));
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">{t("media")}</h4>
      <div className="space-y-2">
        <Checkbox
          label={t("physical")}
          checked={selectedMedia.includes("PHYSICAL")}
          onChange={(e) => handleCheckboxChange("PHYSICAL", e.target.checked)}
        />
        <Checkbox
          label={t("digital")}
          checked={selectedMedia.includes("DIGITAL")}
          onChange={(e) => handleCheckboxChange("DIGITAL", e.target.checked)}
        />
      </div>
    </div>
  );
};

export default MediaFilter;
