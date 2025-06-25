// src/utils/authErrors.ts
interface AuthError {
  code?: string;
  message?: string;
  [key: string]: unknown;
}

type TranslateFunction = (key: string, defaultValue?: string) => string;

export const translateAuthError = (err: AuthError, t: TranslateFunction) => {
  if (!err || typeof err !== "object") return t("common.error");

  // Tratamento para códigos de erro padrão
  if (err.code) {
    const key = err.code
      .toLowerCase()
      .split("_")
      .map((word: string, i: number) => (i > 0 ? word[0].toUpperCase() + word.slice(1) : word))
      .join("");

    return t(`errors.${key}`, t("common.error"));
  }

  return err.message || t("common.error");
};
