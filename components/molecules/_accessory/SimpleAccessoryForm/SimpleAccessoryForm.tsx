"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { useUserAccessoryMutation } from "@/hooks/useUserAccessoryMutation";
import { useUserConsoles } from "@/hooks/useUserConsoles";
import { Spinner } from "@/components/atoms/Spinner/Spinner";

interface SimpleAccessoryFormProps {
  accessoryId: number;
  accessoryVariantId: number;
  onSuccess: () => void;
  onCancel: () => void;
  formId?: string;
  hideButtons?: boolean;
}

export const SimpleAccessoryForm = ({
  accessoryId,
  accessoryVariantId,
  onSuccess,
  onCancel,
  formId,
  hideButtons = false,
}: SimpleAccessoryFormProps) => {
  const t = useTranslations("SimpleAccessoryForm");
  const { data: userConsoles, isLoading } = useUserConsoles(accessoryId);
  const { createUserAccessory, isPending } = useUserAccessoryMutation();
  const [selectedConsoleIds, setSelectedConsoleIds] = useState<number[]>([]);

  const handleCheckboxChange = (consoleId: number) => {
    setSelectedConsoleIds((prev) =>
      prev.includes(consoleId) ? prev.filter((id) => id !== consoleId) : [...prev, consoleId],
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await createUserAccessory({
      accessoryId,
      accessoryVariantId,
      status: "OWNED",
      condition: "USED",
      compatibleUserConsoleIds: selectedConsoleIds,
    });
    onSuccess();
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-300">{t("description")}</p>
      {userConsoles?.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("noConsoles")}</p>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {userConsoles?.map((userConsole) => (
            <Checkbox
              key={userConsole.id}
              label={`${userConsole.name} (${userConsole.status})`}
              checked={selectedConsoleIds.includes(userConsole.id)}
              onChange={() => handleCheckboxChange(userConsole.id)}
            />
          ))}
        </div>
      )}

      {!hideButtons && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} label={t("cancel")} />
          <Button
            loading={isPending}
            onClick={() => handleSubmit()}
            label={t("add")}
            disabled={isPending}
          />
        </div>
      )}
    </form>
  );
};
