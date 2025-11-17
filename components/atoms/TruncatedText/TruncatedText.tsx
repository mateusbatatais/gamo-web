// components/atoms/TruncatedText/TruncatedText.tsx
import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  showMoreClassName?: string;
  translationNamespace?: string;
}

export default function TruncatedText({
  text,
  maxLength = 150,
  className = "",
  showMoreClassName = "text-primary-600 dark:text-primary-400 text-sm font-medium mt-1 hover:underline focus:outline-none",
  translationNamespace = "common",
}: TruncatedTextProps) {
  const t = useTranslations(translationNamespace);
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = text.length > maxLength;
  const displayText = expanded || !shouldTruncate ? text : text.slice(0, maxLength) + "...";

  return (
    <div className={className}>
      <p className="text-sm text-gray-600 dark:text-gray-300">{displayText}</p>
      {shouldTruncate && (
        <button onClick={() => setExpanded(!expanded)} className={showMoreClassName}>
          {expanded ? t("showLess") : t("showMore")}
        </button>
      )}
    </div>
  );
}
