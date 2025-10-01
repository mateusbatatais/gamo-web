// components/molecules/TradeSection/TradeSection.tsx
"use client";

import React from "react";
import { Select } from "@/components/atoms/Select/Select";
import { Input } from "@/components/atoms/Input/Input";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { CollectionFormData } from "@/@types/form.types";

interface TradeSectionProps {
  conditionOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  formData: CollectionFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  t: (key: string) => string;
  showPrice?: boolean;
  showStatus?: boolean;
}

export const TradeSection = ({
  conditionOptions,
  statusOptions,
  formData,
  handleChange,
  t: translate,
  showPrice = true,
  showStatus = true,
}: TradeSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {showStatus && (
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label={translate("status")}
            options={statusOptions}
          />
        )}

        <Select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          label={translate("condition")}
          options={conditionOptions}
        />

        {showPrice && (
          <Input
            name="price"
            value={formData.price}
            onChange={handleChange}
            label={translate("price")}
            placeholder={translate("pricePlaceholder")}
            type="number"
            min="0"
            step="0.01"
          />
        )}
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">{translate("extras")}</label>
        <div className="flex gap-2 flex-col sm:flex-row sm:gap-4">
          <Checkbox
            name="acceptsTrade"
            checked={formData.acceptsTrade}
            onChange={handleChange}
            label={translate("acceptsTrade")}
          />
          <Checkbox
            name="hasBox"
            checked={formData.hasBox}
            onChange={handleChange}
            label={translate("hasBox")}
          />
          <Checkbox
            name="hasManual"
            checked={formData.hasManual}
            onChange={handleChange}
            label={translate("hasManual")}
          />
        </div>
      </div>
    </div>
  );
};
