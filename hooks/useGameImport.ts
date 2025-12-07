// src/hooks/useGameImport.ts - VERSÃO CORRIGIDA
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { Game } from "@/@types/catalog.types";
import { CollectionStatus, Condition, MediaType } from "@/@types/collection.types";

export interface ImportSession {
  id: number;
  userId: number;
  fileName: string;
  fileType: "CSV" | "XLSX" | "JSON";
  status:
    | "UPLOADED"
    | "PROCESSING"
    | "READY_FOR_REVIEW"
    | "IMPORTING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED";
  totalRows: number;
  processedRows: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  matches?: ImportMatch[];
}

export interface ImportMatch {
  id: number;
  sessionId: number;
  lineNumber: number;
  rawInput: string;
  normalized: string;
  confidence: number | null;
  matchStatus: "PENDING" | "AUTO_MATCHED" | "MANUAL_REVIEW" | "CONFIRMED" | "SKIPPED";
  suggestedGameId?: number | null;
  confirmedGameId?: number | null;
  suggestedGame?: {
    id: number;
    slug: string;
    name: string;
    imageUrl: string | null;
  };
  confirmedGame?: {
    id: number;
    slug: string;
    name: string;
    imageUrl: string | null;
  };
  userPlatform?: string;
  suggestedPlatformId?: number | null;
  confirmedPlatformId?: number | null;
  confirmedConsoleIds?: number[];

  userData: {
    progress?: number;
    rating?: number;
    status?: CollectionStatus;
    media?: MediaType;
    price?: number;
    hasBox?: boolean;
    hasManual?: boolean;
    condition?: Condition;
    acceptsTrade?: boolean;
    description?: string;
    abandoned?: boolean;
    review?: string;
  };
}

// Tipos auxiliares para Upload
type UploadFileData = { fileName: string; fileType: "CSV" | "XLSX" | "JSON"; fileContent: string };
type UploadResponse = { session: ImportSession } | ImportSession;

export function useGameImport() {
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Upload do arquivo - CORRIGIDO
  const uploadMutation = useMutation({
    mutationFn: async (fileData: UploadFileData): Promise<ImportSession> => {
      const response = await apiFetch<UploadResponse>(`/user-games-import/upload`, {
        method: "POST",
        body: fileData,
      });

      const session: ImportSession = "session" in response ? response.session : response;

      return session;
    },
    onSuccess: (session: ImportSession) => {
      console.log("✅ Upload successful, session:", session);
      queryClient.invalidateQueries({ queryKey: ["importSessions"] });
      showToast("Arquivo enviado com sucesso. Processando...", "success");
    },
    onError: (error: Error) => {
      console.error("❌ Upload error:", error);
      showToast(error.message || "Erro ao fazer upload do arquivo", "danger");
    },
  });

  // Tipos para a resposta do backend (antes da transformação)
  interface BackendImportMatch {
    id: number;
    userProgress?: number | null;
    userRating?: number | null;
    userStatus?: CollectionStatus | null;
    userMedia?: MediaType | null;
    userPrice?: number | null;
    userHasBox?: boolean | null;
    userHasManual?: boolean | null;
    userCondition?: Condition | null;
    userAcceptsTrade?: boolean | null;
    userDescription?: string | null;
    userAbandoned?: boolean | null;
    userReview?: string | null;
    [key: string]: unknown; // Para outros campos que não precisamos transformar
  }

  interface BackendImportSession extends Omit<ImportSession, "matches"> {
    matches?: BackendImportMatch[];
  }

  // Função para transformar dados do backend para o formato esperado pelo frontend
  const transformImportSession = (session: BackendImportSession): ImportSession => {
    return {
      ...session,
      matches: session.matches?.map((match) => ({
        ...match,
        userData: {
          progress: match.userProgress ?? undefined,
          rating: match.userRating ?? undefined,
          status: match.userStatus ?? undefined,
          media: match.userMedia ?? undefined,
          price: match.userPrice ?? undefined,
          hasBox: match.userHasBox ?? undefined,
          hasManual: match.userHasManual ?? undefined,
          condition: match.userCondition ?? undefined,
          acceptsTrade: match.userAcceptsTrade ?? undefined,
          description: match.userDescription ?? undefined,
          abandoned: match.userAbandoned ?? undefined,
          review: match.userReview ?? undefined,
        },
      })) as ImportMatch[],
    };
  };

  // Buscar sessão de importação - CORRIGIDO
  const useImportSession = (sessionId: number) => {
    return useQuery({
      queryKey: ["importSession", sessionId],
      queryFn: async () => {
        if (!sessionId) throw new Error("Session ID is required");

        const rawSession = await apiFetch<BackendImportSession>(
          `/user-games-import/session/${sessionId}`,
        );
        return transformImportSession(rawSession);
      },
      enabled: !!sessionId && !!user,
      refetchInterval: (query) => {
        const data = query.state.data as ImportSession;
        if (data && (data.status === "UPLOADED" || data.status === "PROCESSING")) {
          return 3000; // Poll a cada 3 segundos
        }
        return false;
      },
    });
  };

  // Confirmar matches - CORRIGIDO
  const confirmMatchesMutation = useMutation({
    mutationFn: async ({ sessionId, matches }: { sessionId: number; matches: unknown[] }) => {
      return apiFetch(`/user-games-import/session/${sessionId}/confirm`, {
        method: "PUT",
        body: { matches },
      });
    },
    onSuccess: () => {
      showToast("Matches confirmados com sucesso", "success");
      queryClient.invalidateQueries({ queryKey: ["importSession"] });
    },
    onError: (error: Error) => {
      showToast(error.message || "Erro ao confirmar matches", "danger");
    },
  });

  // Executar importação - CORRIGIDO
  const executeImportMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      return apiFetch<{ importedCount: number; totalMatches: number }>(
        `/user-games-import/session/${sessionId}/execute`,
        {
          method: "POST",
        },
      );
    },
    onSuccess: (data) => {
      showToast(`${data.importedCount} jogos importados com sucesso!`, "success");
      queryClient.invalidateQueries({ queryKey: ["userGamesPublic"] });
      queryClient.invalidateQueries({ queryKey: ["importSessions"] });
    },
    onError: (error: Error) => {
      showToast(error.message || "Erro ao importar jogos", "danger");
    },
  });

  // Buscar jogos alternativos
  const searchAlternativesMutation = useMutation({
    mutationFn: async (gameName: string): Promise<Game[]> => {
      const response = await apiFetch<{ items: Game[] }>(
        `/games?search=${encodeURIComponent(gameName)}&perPage=5`,
      );
      return response.items || [];
    },
  });

  return {
    // Upload
    uploadFile: uploadMutation.mutateAsync,
    uploadLoading: uploadMutation.isPending,

    // Sessão
    useImportSession,

    // Confirmação
    confirmMatches: confirmMatchesMutation.mutateAsync,
    confirmLoading: confirmMatchesMutation.isPending,

    // Execução
    executeImport: executeImportMutation.mutateAsync,
    executeLoading: executeImportMutation.isPending,

    // Busca
    searchAlternatives: searchAlternativesMutation.mutateAsync,
    searchLoading: searchAlternativesMutation.isPending,
  };
}
