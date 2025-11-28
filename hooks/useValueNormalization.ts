// hooks/useValueNormalization.ts
"use client";

import { CollectionStatus, MediaType, Condition } from "@/@types/collection.types";

interface NormalizedValues {
  status?: CollectionStatus | null;
  media?: MediaType | null;
  condition?: Condition | null;
  progress?: number | null;
  rating?: number | null;
  price?: number | null;
  hasBox?: boolean | null;
  hasManual?: boolean | null;
  acceptsTrade?: boolean | null;
  description?: string | null;
}

export function useValueNormalization() {
  // Mapeamentos de normalização
  const statusMap: Record<string, CollectionStatus> = {
    owned: "OWNED",
    tenho: "OWNED",
    possuo: "OWNED",
    selling: "SELLING",
    vendendo: "SELLING",
    venda: "SELLING",
    looking_for: "LOOKING_FOR",
    procurando: "LOOKING_FOR",
    busco: "LOOKING_FOR",
    previously_owned: "PREVIOUSLY_OWNED",
    "já tive": "PREVIOUSLY_OWNED",
    tive: "PREVIOUSLY_OWNED",
  };

  const mediaMap: Record<string, MediaType> = {
    físico: "PHYSICAL",
    physical: "PHYSICAL",
    fisico: "PHYSICAL",
    digital: "DIGITAL",
  };

  const conditionMap: Record<string, Condition> = {
    new: "NEW",
    novo: "NEW",
    used: "USED",
    usado: "USED",
    refurbished: "REFURBISHED",
    recondicionado: "REFURBISHED",
  };

  const booleanMap: Record<string, boolean> = {
    sim: true,
    yes: true,
    "1": true,
    true: true,
    não: false,
    nao: false,
    no: false,
    "0": false,
    false: false,
    "": false,
  };

  /**
   * Normaliza um valor de status
   */
  const normalizeStatus = (value: unknown): CollectionStatus | null => {
    if (!value) return null;
    const normalized = String(value).toLowerCase().trim();
    return statusMap[normalized] || null;
  };

  /**
   * Normaliza um valor de media
   */
  const normalizeMedia = (value: unknown): MediaType | null => {
    if (!value) return null;
    const normalized = String(value).toLowerCase().trim();
    return mediaMap[normalized] || null;
  };

  /**
   * Normaliza um valor de condition
   */
  const normalizeCondition = (value: unknown): Condition | null => {
    if (!value) return null;
    const normalized = String(value).toLowerCase().trim();
    return conditionMap[normalized] || null;
  };

  /**
   * Normaliza um valor booleano
   */
  const normalizeBoolean = (value: unknown): boolean | null => {
    if (value === null || value === undefined) return null;
    const normalized = String(value).toLowerCase().trim();
    if (normalized in booleanMap) {
      return booleanMap[normalized];
    }
    return null;
  };

  /**
   * Normaliza um número com validação de range
   */
  const normalizeNumber = (value: unknown, min?: number, max?: number): number | null => {
    if (!value && value !== 0) return null;

    const num = typeof value === "number" ? value : parseFloat(String(value));

    if (isNaN(num)) return null;
    if (min !== undefined && num < min) return null;
    if (max !== undefined && num > max) return null;

    return num;
  };

  /**
   * Normaliza todos os valores de um objeto
   */
  const normalizeValues = (data: Record<string, unknown>): NormalizedValues => {
    return {
      status: data.status ? normalizeStatus(data.status) : null,
      media: data.media ? normalizeMedia(data.media) : null,
      condition: data.condition ? normalizeCondition(data.condition) : null,
      progress: data.progress ? normalizeNumber(data.progress, 0, 10) : null,
      rating: data.rating ? normalizeNumber(data.rating, 0, 10) : null,
      price: data.price ? normalizeNumber(data.price, 0) : null,
      hasBox: data.hasBox !== undefined ? normalizeBoolean(data.hasBox) : null,
      hasManual: data.hasManual !== undefined ? normalizeBoolean(data.hasManual) : null,
      acceptsTrade: data.acceptsTrade !== undefined ? normalizeBoolean(data.acceptsTrade) : null,
      description: data.description ? String(data.description) : null,
    };
  };

  /**
   * Normaliza um array de objetos
   */
  const normalizeArray = (data: Record<string, unknown>[]): NormalizedValues[] => {
    return data.map((item) => normalizeValues(item));
  };

  return {
    normalizeStatus,
    normalizeMedia,
    normalizeCondition,
    normalizeBoolean,
    normalizeNumber,
    normalizeValues,
    normalizeArray,
  };
}
