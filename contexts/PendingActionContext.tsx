"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface PendingAction {
  type: string;
  payload: unknown;
}

interface PendingActionContextType {
  setPendingAction: (action: PendingAction) => void;
  executePendingAction: () => void;
  hasPendingAction: boolean;
}

const PendingActionContext = createContext<PendingActionContextType | undefined>(undefined);

export function PendingActionProvider({ children }: { children: ReactNode }) {
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const storedAction = sessionStorage.getItem("pendingAction");
    if (storedAction) {
      setPendingAction(JSON.parse(storedAction));
    }
  }, []);

  useEffect(() => {
    if (user && pendingAction) {
      executePendingAction();
    }
  }, [user, pendingAction]);

  const handleSetPendingAction = (action: PendingAction) => {
    setPendingAction(action);
    sessionStorage.setItem("pendingAction", JSON.stringify(action));
  };

  const executePendingAction = () => {
    if (!pendingAction) return;

    // Aqui você pode implementar a lógica para diferentes tipos de ações
    console.log("Executando ação pendente:", pendingAction);

    // Exemplo: Disparar evento global para componentes ouvirem
    window.dispatchEvent(
      new CustomEvent("pendingActionExecuted", {
        detail: pendingAction,
      }),
    );

    // Limpar após execução
    setPendingAction(null);
    sessionStorage.removeItem("pendingAction");
  };

  return (
    <PendingActionContext.Provider
      value={{
        setPendingAction: handleSetPendingAction,
        executePendingAction,
        hasPendingAction: !!pendingAction,
      }}
    >
      {children}
    </PendingActionContext.Provider>
  );
}

export function usePendingAction() {
  const context = useContext(PendingActionContext);
  if (context === undefined) {
    throw new Error("usePendingAction must be used within a PendingActionProvider");
  }
  return context;
}
