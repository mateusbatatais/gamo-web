// src/components/organisms/_game/GameImportWizard/GameImportWizard.tsx - FLUXO CORRIGIDO
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { UploadStep } from "./UploadStep";
import { ReviewStep } from "./ReviewStep";
import { ConfirmationStep } from "./ConfirmationStep";
import { useGameImport, ImportSession } from "@/hooks/useGameImport";
import { useFileParser } from "@/hooks/useFileParser";
import type { ParsedGame } from "@/hooks/useFileParser";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

type WizardStep = "upload" | "review" | "confirmation";

export function GameImportWizard() {
  const t = useTranslations("GameImport");
  const [currentStep, setCurrentStep] = useState<WizardStep>("upload");
  const [importSession, setImportSession] = useState<ImportSession | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();
  const { parseFile, parsedData, isParsing, clearData } = useFileParser();
  const { uploadFile, uploadLoading, useImportSession, executeImport, executeLoading } =
    useGameImport();

  const { data: sessionData } = useImportSession(importSession?.id || 0);

  // Atualizar sessão quando dados chegarem
  useEffect(() => {
    if (sessionData) {
      setImportSession(sessionData);

      // Controlar navegação baseado no status da sessão
      if (sessionData.status === "READY_FOR_REVIEW" && currentStep !== "confirmation") {
        setCurrentStep("confirmation");
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
        showToast("Erro no processamento da importação", "danger");
      }
    }
  }, [sessionData, currentStep, user, showToast]);

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          let content: string;

          if (file.type.includes("sheet")) {
            // Para Excel, converter para base64
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const bytes = new Uint8Array(arrayBuffer);
            let binary = "";
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            content = btoa(binary);
          } else {
            // Para CSV/JSON, usar texto diretamente
            content = e.target?.result as string;
          }

          resolve(content);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      if (file.type.includes("sheet")) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file, "UTF-8");
      }
    });
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    try {
      await parseFile(file);
      setCurrentStep("review");
    } catch (error) {
      console.error("Error parsing file:", error);
      showToast("Erro ao processar arquivo", "danger");
    }
  };

  const handleUpload = async (selected?: ParsedGame[]) => {
    if (!selectedFile && (!selected || selected.length === 0)) {
      showToast("Nenhum arquivo selecionado", "danger");
      return;
    }

    try {
      let fileContent: string;
      let fileType: "CSV" | "XLSX" | "JSON";
      let fileName: string;

      if (selected && selected.length > 0) {
        fileContent = JSON.stringify(selected);
        fileType = "JSON";
        const baseName = selectedFile?.name.replace(/\.[^.]+$/, "") || "import";
        fileName = `${baseName}-selected.json`;
      } else {
        const content = await readFileContent(selectedFile as File);
        fileContent = content;
        const ext = selectedFile!.name.split(".").pop()?.toUpperCase();
        if (!ext || !["CSV", "XLSX", "JSON"].includes(ext)) {
          throw new Error("Tipo de arquivo não suportado");
        }
        fileType = ext as "CSV" | "XLSX" | "JSON";
        fileName = selectedFile!.name;
      }

      const session = await uploadFile({
        fileName,
        fileType,
        fileContent,
      });

      if (session?.id) {
        setImportSession(session);
        showToast("Arquivo enviado. Processando...", "success");
      }
    } catch (error) {
      console.error("Upload error:", error);
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
          {["upload", "review", "confirmation"].map((step, index) => (
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

        {currentStep === "review" && (
          <ReviewStep
            parsedGames={parsedData}
            onConfirm={handleUpload}
            onBack={handleRestart}
            isLoading={uploadLoading}
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
