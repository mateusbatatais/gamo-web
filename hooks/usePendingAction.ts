// src/hooks/usePendingAction.ts
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function usePendingAction() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const pendingAction = sessionStorage.getItem("pendingAction");
      if (pendingAction) {
        const action = JSON.parse(pendingAction);

        // Aqui você pode executar a ação pendente
        console.log("Executar ação pendente:", action);
        // Exemplo: chamar API para completar a ação

        sessionStorage.removeItem("pendingAction");
      }
    }
  }, [user]);
}
