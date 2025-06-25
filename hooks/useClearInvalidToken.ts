// src/hooks/useClearInvalidToken.ts
import { useEffect } from "react";

// src/hooks/useClearInvalidToken.ts
type TokenValidator = (token: string) => boolean;

const defaultValidator: TokenValidator = (token) =>
  /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);

export function useClearInvalidToken(validator: TokenValidator = defaultValidator) {
  useEffect(() => {
    try {
      const token = localStorage.getItem("gamo_token");
      if (!token || !validator(token)) {
        localStorage.removeItem("gamo_token");
      }
    } catch {
      localStorage.removeItem("gamo_token");
    }
  }, []);
}
