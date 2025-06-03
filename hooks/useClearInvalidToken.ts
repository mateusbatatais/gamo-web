// src/hooks/useClearInvalidToken.ts
import { useEffect } from "react";

export function useClearInvalidToken() {
  useEffect(() => {
    try {
      const token = localStorage.getItem("gamo_token");
      if (!token || token === "null" || token.trim() === "") {
        localStorage.removeItem("gamo_token");
      }
      // (Opcional) Se quiser validar a estrutura básico JWT, faça um regex simples:
      else if (
        !/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token)
      ) {
        localStorage.removeItem("gamo_token");
      }
    } catch {
      // Se der qualquer erro ao ler localStorage, só removemos mesmo.
      localStorage.removeItem("gamo_token");
    }
  }, []);
}
