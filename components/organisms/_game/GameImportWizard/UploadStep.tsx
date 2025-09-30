// src/components/organisms/_game/GameImportWizard/UploadStep.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button/Button";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { Tooltip } from "@/components/atoms/Tooltip/Tooltip";

interface UploadStepProps {
  onFileSelect: (file: File) => void;
  isParsing: boolean;
  parsedCount: number;
}

export function UploadStep({ onFileSelect, isParsing, parsedCount }: UploadStepProps) {
  const t = useTranslations("GameImport");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/json": [".json"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleTemplateDownload = () => {
    // Template em formato de tabela CSV
    const template = `gameName,platform,status,progress,rating,media,price,hasBox,hasManual,condition,acceptsTrade,description
"The Legend of Zelda: Breath of the Wild","Nintendo Switch",OWNED,10,10,PHYSICAL,,true,true,USED,false,"Excelente jogo de aventura"
"God of War","PlayStation 4",SELLING,10,9,PHYSICAL,100,true,false,USED,true,"Vendendo para comprar nova versão"
"Final Fantasy VII","PlayStation",LOOKING_FOR,0,0,PHYSICAL,150,true,true,USED,true,"Procurando versão original"
"Halo Infinite","Xbox Series X",OWNED,8,9,DIGITAL,,false,false,NEW,false,"Jogo digital na conta"
"The Witcher 3: Wild Hunt",PC,OWNED,10,10,PHYSICAL,,true,true,USED,false,"Completo com todas as DLCs"`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-colecao-jogos.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Área de Upload */}
      <Card className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }`}
        >
          <input {...getInputProps()} />

          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {isDragActive ? t("upload.dropHere") : t("upload.title")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t("upload.description")}
              </p>
            </div>

            <Button type="button" variant="outline" label={t("upload.browseFiles")} />
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>{t("upload.supportedFormats")}</p>
          <p>{t("upload.maxSize")}</p>
        </div>
      </Card>
      {/* Arquivo Selecionado */}
      {selectedFile && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {isParsing ? (
              <div className="flex items-center space-x-2">
                <Skeleton className="w-4 h-4 rounded-full" animated />
                <span className="text-sm text-gray-500">{t("upload.parsing")}</span>
              </div>
            ) : (
              <span className="text-sm text-green-600 dark:text-green-400">
                ✓ {t("upload.parsedSuccess", { count: parsedCount })}
              </span>
            )}
          </div>
        </Card>
      )}
      {/* Template Download */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {t("upload.templateTitle")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t("upload.templateDescription")}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleTemplateDownload}
            label={t("upload.downloadTemplate")}
          />
        </div>
      </Card>
      <h3 className="font-medium text-gray-900 dark:text-white mb-4">{t("upload.columnsGuide")}</h3>

      {/* Tabela de Exemplo Expandida */}
      <div className="mb-6 overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-medium">
                <div className="flex items-center gap-1">
                  gameName
                  <Tooltip title={t("upload.tooltips.gameName")}>
                    <svg
                      className="w-4 h-4 text-gray-400 cursor-help"
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
                  </Tooltip>
                </div>
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-medium">
                <div className="flex items-center gap-1">
                  platform
                  <Tooltip title={t("upload.tooltips.platform")}>
                    <svg
                      className="w-4 h-4 text-gray-400 cursor-help"
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
                  </Tooltip>
                </div>
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-medium">
                <div className="flex items-center gap-1">
                  status
                  <Tooltip title={t("upload.tooltips.status")}>
                    <svg
                      className="w-4 h-4 text-gray-400 cursor-help"
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
                  </Tooltip>
                </div>
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-medium">
                <div className="flex items-center gap-1">
                  progress
                  <Tooltip title={t("upload.tooltips.progress")}>
                    <svg
                      className="w-4 h-4 text-gray-400 cursor-help"
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
                  </Tooltip>
                </div>
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-medium">
                <div className="flex items-center gap-1">
                  rating
                  <Tooltip title={t("upload.tooltips.rating")}>
                    <svg
                      className="w-4 h-4 text-gray-400 cursor-help"
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
                  </Tooltip>
                </div>
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-medium">
                <div className="flex items-center gap-1">
                  media
                  <Tooltip title={t("upload.tooltips.media")}>
                    <svg
                      className="w-4 h-4 text-gray-400 cursor-help"
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
                  </Tooltip>
                </div>
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-medium">
                <div className="flex items-center gap-1">
                  price
                  <Tooltip title={t("upload.tooltips.price")}>
                    <svg
                      className="w-4 h-4 text-gray-400 cursor-help"
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
                  </Tooltip>
                </div>
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-medium">
                <div className="flex items-center gap-1">
                  hasBox
                  <Tooltip title={t("upload.tooltips.hasBox")}>
                    <svg
                      className="w-4 h-4 text-gray-400 cursor-help"
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
                  </Tooltip>
                </div>
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-medium">
                <div className="flex items-center gap-1">
                  hasManual
                  <Tooltip title={t("upload.tooltips.hasManual")}>
                    <svg
                      className="w-4 h-4 text-gray-400 cursor-help"
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
                  </Tooltip>
                </div>
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-medium">
                <div className="flex items-center gap-1">
                  condition
                  <Tooltip title={t("upload.tooltips.condition")}>
                    <svg
                      className="w-4 h-4 text-gray-400 cursor-help"
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
                  </Tooltip>
                </div>
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-medium">
                <div className="flex items-center gap-1">
                  acceptsTrade
                  <Tooltip title={t("upload.tooltips.acceptsTrade")}>
                    <svg
                      className="w-4 h-4 text-gray-400 cursor-help"
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
                  </Tooltip>
                </div>
              </th>
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-medium">
                <div className="flex items-center gap-1">
                  description
                  <Tooltip title={t("upload.tooltips.description")}>
                    <svg
                      className="w-4 h-4 text-gray-400 cursor-help"
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
                  </Tooltip>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                The Legend of Zelda: Breath of the Wild
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                Nintendo Switch
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">OWNED</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">10</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">10</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">PHYSICAL</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2"></td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">true</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">true</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">USED</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">false</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                Excelente jogo de aventura
              </td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">God of War</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                PlayStation 4
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">SELLING</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">10</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">9</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">PHYSICAL</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">100</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">true</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">false</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">USED</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">true</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                Vendendo para comprar nova versão
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                Final Fantasy VII
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">PlayStation</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">LOOKING_FOR</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">0</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">0</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">PHYSICAL</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">150</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">true</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">true</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">USED</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">true</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                Procurando versão original
              </td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                Halo Infinite
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                Xbox Series X
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">OWNED</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">8</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">9</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">DIGITAL</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2"></td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">false</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">false</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">NEW</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">false</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                Jogo digital na conta
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                The Witcher 3: Wild Hunt
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">PC</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">OWNED</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">10</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">10</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">PHYSICAL</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2"></td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">true</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">true</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">USED</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">false</td>
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                Completo com todas as DLCs
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Informação sobre obrigatoriedade */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 dark:text-blue-400 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {t("upload.requiredInfo.title")}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {t("upload.requiredInfo.description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
