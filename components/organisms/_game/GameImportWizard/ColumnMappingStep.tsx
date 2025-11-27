// src/components/organisms/_game/GameImportWizard/ColumnMappingStep.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button/Button";
import { Select } from "@/components/atoms/Select/Select";

interface ColumnMappingStepProps {
  detectedColumns: string[];
  rawData: Record<string, unknown>[];
  onConfirm: (columnMapping: Record<string, string>) => void;
  onBack: () => void;
  isLoading: boolean;
  totalGames: number;
}

interface ExpectedField {
  key: string;
  label: string;
  required: boolean;
  type: "string" | "number" | "boolean";
}

// Função de similaridade de strings (Levenshtein simplificado)
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// Sugerir mapeamento automático baseado em similaridade
function suggestMapping(
  detectedColumns: string[],
  expectedFields: ExpectedField[],
): Record<string, string> {
  const mapping: Record<string, string> = {};
  const usedColumns = new Set<string>();

  // Variações de nomes para cada campo
  const fieldVariations: Record<string, string[]> = {
    gameName: ["game", "name", "title", "jogo", "gamename", "game name", "nome do jogo", "nome"],
    platform: ["platform", "plataforma", "console", "system", "sistema"],
    status: ["status", "estado", "state"],
    progress: ["progress", "progresso", "completion", "completude"],
    rating: ["rating", "nota", "score", "avaliação", "avaliacao"],
    media: ["media", "midia", "tipo", "type", "format", "formato"],
    price: ["price", "preco", "preço", "valor", "value"],
    hasBox: ["hasbox", "box", "caixa", "temcaixa", "tem caixa", "has box"],
    hasManual: ["hasmanual", "manual", "temmanual", "tem manual", "has manual"],
    condition: ["condition", "condicao", "condição", "estado"],
    acceptsTrade: ["acceptstrade", "trade", "troca", "aceita troca", "accepts trade"],
    description: ["description", "descricao", "descrição", "desc", "notes", "notas"],
  };

  expectedFields.forEach((field) => {
    let bestMatch = "";
    let bestScore = 0;

    const variations = fieldVariations[field.key] || [field.key];

    detectedColumns.forEach((column) => {
      if (usedColumns.has(column)) return;

      // Calcular similaridade com todas as variações
      variations.forEach((variation) => {
        const score = similarity(column.toLowerCase().trim(), variation);
        if (score > bestScore && score > 0.6) {
          // Threshold de 60%
          bestScore = score;
          bestMatch = column;
        }
      });
    });

    if (bestMatch) {
      mapping[field.key] = bestMatch;
      usedColumns.add(bestMatch);
    }
  });

  return mapping;
}

export function ColumnMappingStep({
  detectedColumns,
  rawData,
  onConfirm,
  onBack,
  isLoading,
  totalGames,
}: ColumnMappingStepProps) {
  const t = useTranslations("GameImport");
  const [progress, setProgress] = useState(0);

  const expectedFields: ExpectedField[] = [
    { key: "gameName", label: t("columnMapping.fields.gameName"), required: true, type: "string" },
    { key: "platform", label: t("columnMapping.fields.platform"), required: false, type: "string" },
    { key: "status", label: t("columnMapping.fields.status"), required: false, type: "string" },
    { key: "progress", label: t("columnMapping.fields.progress"), required: false, type: "number" },
    { key: "rating", label: t("columnMapping.fields.rating"), required: false, type: "number" },
    { key: "media", label: t("columnMapping.fields.media"), required: false, type: "string" },
    { key: "price", label: t("columnMapping.fields.price"), required: false, type: "number" },
    { key: "hasBox", label: t("columnMapping.fields.hasBox"), required: false, type: "boolean" },
    {
      key: "hasManual",
      label: t("columnMapping.fields.hasManual"),
      required: false,
      type: "boolean",
    },
    {
      key: "condition",
      label: t("columnMapping.fields.condition"),
      required: false,
      type: "string",
    },
    {
      key: "acceptsTrade",
      label: t("columnMapping.fields.acceptsTrade"),
      required: false,
      type: "boolean",
    },
    {
      key: "description",
      label: t("columnMapping.fields.description"),
      required: false,
      type: "string",
    },
  ];

  // Sugerir mapeamento automático
  const suggestedMapping = useMemo(
    () => suggestMapping(detectedColumns, expectedFields),
    [detectedColumns],
  );

  const [columnMapping, setColumnMapping] = useState<Record<string, string>>(suggestedMapping);
  const [validationError, setValidationError] = useState<string>("");

  // Atualizar quando sugestões mudarem
  useEffect(() => {
    setColumnMapping(suggestedMapping);
  }, [suggestedMapping]);

  // Animar barra de progresso quando isLoading muda
  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          // Progresso simulado: sobe rápido até 30%, depois mais devagar
          if (prev < 30) return prev + 2;
          if (prev < 60) return prev + 1;
          if (prev < 90) return prev + 0.5;
          return prev; // Para em 90% e espera o backend
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setProgress(100); // Completa quando termina
      setTimeout(() => setProgress(0), 500); // Reset após animação
    }
  }, [isLoading]);

  const handleMappingChange = (fieldKey: string, columnName: string) => {
    setColumnMapping((prev) => {
      const newMapping = { ...prev };
      if (columnName === "" || columnName === "_ignore_") {
        delete newMapping[fieldKey];
      } else {
        newMapping[fieldKey] = columnName;
      }
      return newMapping;
    });
    setValidationError("");
  };

  const handleConfirm = () => {
    // Validar que gameName está mapeado
    if (!columnMapping.gameName) {
      setValidationError(t("columnMapping.validation.gameNameRequired"));
      return;
    }

    onConfirm(columnMapping);
  };

  // Gerar preview dos dados mapeados
  const previewData = useMemo(() => {
    return rawData.slice(0, 3).map((row) => {
      const mappedRow: Record<string, unknown> = {};
      Object.entries(columnMapping).forEach(([fieldKey, columnName]) => {
        mappedRow[fieldKey] = row[columnName];
      });
      return mappedRow;
    });
  }, [rawData, columnMapping]);

  // Opções para os selects
  const columnOptions = [
    { value: "_ignore_", label: t("columnMapping.ignore") },
    ...detectedColumns.map((col) => ({ value: col, label: col })),
  ];

  return (
    <div className="space-y-6 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-8 max-w-md mx-4 w-full">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <div className="text-center w-full">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("columnMapping.processing.title")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {t("columnMapping.processing.description")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {totalGames} {totalGames === 1 ? "jogo" : "jogos"}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  {Math.round(progress)}%
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("columnMapping.title")}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t("columnMapping.description")}
        </p>
      </Card>

      {/* Validation Error */}
      {validationError && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{validationError}</p>
          </div>
        </Card>
      )}

      {/* Mapping Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  {t("columnMapping.expectedField")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  {t("columnMapping.spreadsheetColumn")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  {t("columnMapping.status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {expectedFields.map((field) => {
                const mappedColumn = columnMapping[field.key];
                const isAutoMapped = suggestedMapping[field.key] === mappedColumn;

                return (
                  <tr
                    key={field.key}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900 dark:text-white">{field.label}</span>
                        {field.required && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
                            {t("columnMapping.required")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={mappedColumn || "_ignore_"}
                        onChange={(e) => handleMappingChange(field.key, e.target.value)}
                        options={columnOptions}
                        className="min-w-[200px]"
                        disabled={isLoading}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {mappedColumn ? (
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            isAutoMapped
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          }`}
                        >
                          {isAutoMapped
                            ? t("columnMapping.autoMapped")
                            : t("columnMapping.manuallyMapped")}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                          {t("columnMapping.notMapped")}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Preview */}
      {previewData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
            {t("columnMapping.preview")}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {Object.keys(columnMapping).map((fieldKey) => {
                    const field = expectedFields.find((f) => f.key === fieldKey);
                    return (
                      <th
                        key={fieldKey}
                        className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        {field?.label || fieldKey}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    {Object.keys(columnMapping).map((fieldKey) => (
                      <td
                        key={fieldKey}
                        className="px-3 py-2 text-gray-900 dark:text-white max-w-xs truncate"
                      >
                        {String(row[fieldKey] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            {t("columnMapping.previewNote", { count: rawData.length })}
          </p>
        </Card>
      )}

      {/* Info */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {t("columnMapping.tips.title")}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {t("columnMapping.tips.description")}
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          label={t("columnMapping.actions.back")}
          disabled={isLoading}
        />

        <Button
          type="button"
          onClick={handleConfirm}
          loading={isLoading}
          disabled={!columnMapping.gameName || isLoading}
          label={t("columnMapping.actions.confirm")}
        />
      </div>
    </div>
  );
}
