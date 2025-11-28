import React from "react";
import { useTranslations } from "next-intl";
import { useCompatibleUserConsoles } from "@/hooks/useCompatibleUserConsoles";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Spinner } from "@/components/atoms/Spinner/Spinner";

interface ConsoleSelectorProps {
  gameSlug: string;
  platformId?: number;
  selectedConsoleIds: number[];
  onChange: (ids: number[]) => void;
}

export const ConsoleSelector = ({
  gameSlug,
  platformId,
  selectedConsoleIds,
  onChange,
}: ConsoleSelectorProps) => {
  const t = useTranslations("TradeForm");
  const { data: compatibleConsoles, isLoading } = useCompatibleUserConsoles(gameSlug, platformId);

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner />
      </div>
    );
  }

  if (!compatibleConsoles || compatibleConsoles.length === 0) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          {t("noCompatibleConsoles")}
        </p>
      </div>
    );
  }

  const handleToggle = (consoleId: number) => {
    if (selectedConsoleIds.includes(consoleId)) {
      onChange(selectedConsoleIds.filter((id) => id !== consoleId));
    } else {
      onChange([...selectedConsoleIds, consoleId]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t("compatibleConsoles")}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {compatibleConsoles.map((uc) => (
          <button
            type="button"
            key={uc.id}
            className={`
              flex items-center p-3 rounded-lg border cursor-pointer transition-colors text-left w-full
              ${
                selectedConsoleIds.includes(uc.id)
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }
            `}
            onClick={() => handleToggle(uc.id)}
          >
            <Checkbox
              checked={selectedConsoleIds.includes(uc.id)}
              onChange={() => {}} // Handled by parent button
              containerClassName="mr-3 pointer-events-none"
              tabIndex={-1}
              readOnly
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {uc.console.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{uc.variant.name}</span>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{t("compatibleConsolesHelp")}</p>
    </div>
  );
};
