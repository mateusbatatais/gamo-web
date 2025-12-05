// components/molecules/ReportProblem/ReportProblem.tsx (versão com hook)
"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { AlertCircle, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useToast } from "@/contexts/ToastContext";
import { useReportProblem } from "@/hooks/useReportProblem";

interface ReportProblemProps {
  className?: string;
  trigger?: React.ReactElement;
}

interface ReportFormData {
  email: string;
  description: string;
}

export function ReportProblem({ className, trigger }: ReportProblemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ReportFormData>({
    email: "",
    description: "",
  });

  const t = useTranslations("ReportProblem");
  const { showToast } = useToast();
  const { mutate: submitReport, isPending: isSubmitting } = useReportProblem();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setFormData({ email: "", description: "" });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    if (!formData.description.trim()) {
      showToast(t("descriptionRequired"), "warning");
      return;
    }

    submitReport(
      {
        email: formData.email,
        description: formData.description,
        url: typeof window !== "undefined" ? window.location.href : "",
      },
      {
        onSuccess: () => {
          showToast(t("successMessage"), "success");
          handleClose();
        },
        onError: (error: Error) => {
          console.error("Error submitting report:", error);
          showToast(t("errorMessage"), "danger");
        },
      },
    );
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const dialogContent = (
    <Dialog
      title={t("reportProblem")}
      subtitle={t("reportProblemSubtitle")}
      open={isOpen}
      onClose={handleClose}
      size="md"
      icon={<AlertCircle className="w-5 h-5" />}
      actionButtons={{
        cancel: {
          label: t("cancel"),
          onClick: handleClose,
          disabled: isSubmitting,
        },
        confirm: {
          label: t("sendReport"),
          onClick: handleSubmit,
          loading: isSubmitting,
          icon: <Send className="w-4 h-4" />,
        },
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("emailLabel")}
          placeholder={t("emailPlaceholder")}
          value={formData.email}
          onChange={handleEmailChange}
          type="email"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("descriptionLabel")}
            <span className="text-danger-500 ml-1">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder={t("descriptionPlaceholder")}
            rows={5}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-vertical"
          />
        </div>

        {typeof window !== "undefined" && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>{t("currentPage")}:</p>
            <p className="text-xs break-all mt-1">{window.location.href}</p>
          </div>
        )}
      </form>
    </Dialog>
  );

  if (trigger) {
    return (
      <>
        {React.cloneElement(trigger, {
          onClick: (e: React.MouseEvent) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const props = (trigger as any).props;
            if (props && props.onClick) {
              props.onClick(e);
            }
            handleOpen();
          },
        })}
        {dialogContent}
      </>
    );
  }

  return (
    <>
      <div className="flex w-full justify-end mt-4">
        <Button
          variant="transparent"
          status="warning"
          size="sm"
          icon={<AlertCircle className="w-4 h-4" />}
          label={t("reportProblem")}
          onClick={handleOpen}
          className={className}
        />
      </div>
      {dialogContent}
    </>
  );
}
