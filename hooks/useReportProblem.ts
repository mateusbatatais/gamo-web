// hooks/useReportProblem.ts - Versão final
"use client";

import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

interface ReportProblemData {
  email?: string;
  description: string;
  url: string;
}

interface ReportProblemResponse {
  message: string;
}

export function useReportProblem() {
  const { apiFetch } = useApiClient();

  return useMutation<ReportProblemResponse, Error, ReportProblemData>({
    mutationFn: async (data: ReportProblemData) => {
      return apiFetch<ReportProblemResponse>("/report-problem", {
        method: "POST",
        body: data,
      });
    },
  });
}
