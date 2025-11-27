// src/components/organisms/_game/GameImportWizard/GameImportWizard.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { UploadStep } from "./UploadStep";
import { ColumnMappingStep } from "./ColumnMappingStep";
import { ConfirmationStep } from "./ConfirmationStep";
import { useGameImport, ImportSession } from "@/hooks/useGameImport";
import { useFileParser } from "@/hooks/useFileParser";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

type WizardStep = "upload" | "columnMapping" | "confirmation";

export function GameImportWizard() {
  const t = useTranslations("GameImport");
  const [currentStep, setCurrentStep] = useState<WizardStep>("upload");
  const [importSession, setImportSession] = useState<ImportSession | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    parseFile,
    parsedData,
    isParsing,
    rawData,
    detectedColumns,
    applyColumnMapping,
    clearData,
  } = useFileParser();
  const { uploadFile, useImportSession, executeImport, executeLoading } = useGameImport();

  const { data: sessionData } = useImportSession(importSession?.id || 0);

  // Atualizar sessão quando dados chegarem
  useEffect(() => {
    if (sessionData) {
      setImportSession(sessionData);

      // Controlar navegação baseado no status da sessão
      if (sessionData.status === "READY_FOR_REVIEW" && currentStep !== "confirmation") {
        setCurrentStep("confirmation");
        setIsProcessing(false); // Liberar loading quando avançar para próxima etapa
        showToast("Processamento concluído! Revise os matches.", "success");
      }

      if (sessionData.status === "COMPLETED") {
        showToast("Importação concluída com sucesso!", "success");
        // Redirecionar após sucesso
        setTimeout(() => {
          window.location.href = `/user/${user?.slug}/games`;
        }, 2000);
      }

      if (sessionData.status === "FAILED") {
        setIsProcessing(false);
        showToast("Erro no processamento da importação", "danger");
      }
    }
  }, [sessionData, currentStep, user, showToast]);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    try {
      await parseFile(file);
      setCurrentStep("columnMapping");
    } catch (error) {
      console.error("Error parsing file:", error);
      showToast("Erro ao processar arquivo", "danger");
    }
  };

  const handleColumnMappingConfirm = async (columnMapping: Record<string, string>) => {
    try {
      setIsProcessing(true); // Iniciar loading

      // Apply column mapping to get the final parsed data
      const mappedGames = applyColumnMapping(columnMapping);

      // Convert to JSON and upload
      const fileContent = JSON.stringify(mappedGames);
      const fileType = "JSON";
      const baseName = selectedFile?.name.replace(/\.[^.]+$/, "") || "import";
      const fileName = `${baseName}-mapped.json`;

      const session = await uploadFile({
        fileName,
        fileType,
        fileContent,
      });

      if (session?.id) {
        setImportSession(session);
        showToast("Arquivo enviado. Processando...", "success");
        // Não definir isProcessing = false aqui, esperar o backend processar
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setIsProcessing(false);
      showToast(error instanceof Error ? error.message : "Erro no upload", "danger");
    }
  };

  const handleExecuteImport = async () => {
    if (!importSession) return;

    try {
      await executeImport(importSession.id);
    } catch (error) {
      console.error("Execute import error:", error);
    } finally {
      window.location.href = `/user/${user?.slug}/games`;
    }
  };

  const handleRestart = () => {
    setCurrentStep("upload");
    setSelectedFile(null);
    setImportSession(null);
    clearData();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t("description")}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-6 justify-center flex-wrap">
          {["upload", "columnMapping", "confirmation"].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step
                    ? "bg-primary-500 text-white"
                    : currentStep > step
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep === step
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {t(`steps.${step}`)}
              </span>
              {index < 2 && (
                <div
                  className={`w-12 h-0.5 mx-4 hidden sm:block ${
                    currentStep > step ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === "upload" && (
          <UploadStep
            onFileSelect={handleFileSelect}
            isParsing={isParsing}
            parsedCount={parsedData.length}
          />
        )}

        {currentStep === "columnMapping" && (
          <ColumnMappingStep
            detectedColumns={detectedColumns}
            rawData={rawData}
            onConfirm={handleColumnMappingConfirm}
            onBack={handleRestart}
            isLoading={isProcessing}
            totalGames={rawData.length}
          />
        )}

        {currentStep === "confirmation" && importSession && (
          <ConfirmationStep
            session={sessionData || importSession}
            onRestart={handleRestart}
            onExecuteImport={handleExecuteImport}
            isExecuting={executeLoading}
          />
        )}
      </Card>
    </div>
  );
}
