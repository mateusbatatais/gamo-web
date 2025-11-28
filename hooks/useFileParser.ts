// src/hooks/useFileParser.ts
"use client";

import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useValueNormalization } from "./useValueNormalization";

export interface ParsedGame {
  gameName: string;
  platform?: string; // ← NOVO CAMPO
  progress?: number;
  rating?: number;
  status?: string;
  media?: string;
  price?: number;
  hasBox?: boolean;
  hasManual?: boolean;
  condition?: string;
  acceptsTrade?: boolean;
  description?: string;
  abandoned?: boolean;
  review?: string;
}

// Generic record for parsed row values
type RawRow = Record<string, unknown>;

export function useFileParser() {
  const [parsedData, setParsedData] = useState<ParsedGame[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [rawData, setRawData] = useState<Record<string, unknown>[]>([]);
  const [detectedColumns, setDetectedColumns] = useState<string[]>([]);
  const { normalizeValues } = useValueNormalization();

  const parseFile = async (file: File): Promise<ParsedGame[]> => {
    setIsParsing(true);

    return new Promise((resolve, reject) => {
      const fileType = file.name.split(".").pop()?.toUpperCase();

      try {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            const result = e.target?.result;
            let output: ParsedGame[] = [];
            let raw: Record<string, unknown>[] = [];
            let columns: string[] = [];

            switch (fileType) {
              case "CSV": {
                if (typeof result !== "string") {
                  throw new Error("Conteúdo inválido para CSV");
                }
                const parsed = parseCSV(result);
                output = parsed.normalized;
                raw = parsed.raw;
                columns = parsed.columns;
                break;
              }
              case "XLSX":
              case "XLS": {
                // FileReader.readAsArrayBuffer ensures result is ArrayBuffer
                if (!(result instanceof ArrayBuffer)) {
                  throw new Error("Conteúdo inválido para Excel");
                }
                const parsed = parseExcel(result);
                output = parsed.normalized;
                raw = parsed.raw;
                columns = parsed.columns;
                break;
              }
              case "JSON": {
                if (typeof result !== "string") {
                  throw new Error("Conteúdo inválido para JSON");
                }
                const parsed = parseJSON(result);
                output = parsed.normalized;
                raw = parsed.raw;
                columns = parsed.columns;
                break;
              }
              default:
                throw new Error("Formato de arquivo não suportado");
            }

            setParsedData(output);
            setRawData(raw);
            setDetectedColumns(columns);
            resolve(output);
          } catch (error) {
            reject(error);
          } finally {
            setIsParsing(false);
          }
        };

        reader.onerror = () => {
          setIsParsing(false);
          reject(new Error("Erro ao ler arquivo"));
        };

        if (fileType === "XLSX" || fileType === "XLS") {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsText(file);
        }
      } catch (error) {
        setIsParsing(false);
        reject(error);
      }
    });
  };

  const parseCSV = (
    content: string,
  ): { normalized: ParsedGame[]; raw: Record<string, unknown>[]; columns: string[] } => {
    const results = Papa.parse<RawRow>(content, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim(),
    });

    const columns = results.meta.fields || [];
    const raw = results.data;
    const normalized = results.data.map((row, index) => normalizeRow(row, index));

    return { normalized, raw, columns };
  };

  const parseExcel = (
    content: ArrayBuffer,
  ): { normalized: ParsedGame[]; raw: Record<string, unknown>[]; columns: string[] } => {
    const workbook = XLSX.read(content, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json<RawRow>(firstSheet);

    const columns = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
    const raw = jsonData;
    const normalized = jsonData.map((row, index) => normalizeRow(row, index));

    return { normalized, raw, columns };
  };

  const parseJSON = (
    content: string,
  ): { normalized: ParsedGame[]; raw: Record<string, unknown>[]; columns: string[] } => {
    const parsed: unknown = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      throw new Error("JSON deve ser um array");
    }

    const raw = parsed.filter(
      (item): item is Record<string, unknown> =>
        item !== null && typeof item === "object" && !Array.isArray(item),
    );
    const columns = raw.length > 0 ? Object.keys(raw[0]) : [];
    const normalized = parsed.map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return normalizeRow({}, index);
      }
      return normalizeRow(item as RawRow, index);
    });

    return { normalized, raw, columns };
  };

  // Helpers de normalização com tipos seguros
  const normalizeNumber = (value: unknown): number | undefined => {
    if (value === undefined || value === null || value === "") return undefined;
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  };

  const normalizeBoolean = (value: unknown): boolean | undefined => {
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      return ["true", "sim", "yes", "1", "s", "y"].includes(value.toLowerCase());
    }
    return Boolean(value);
  };

  const normalizeString = (value: unknown): string | undefined => {
    if (value === undefined || value === null || value === "") return undefined;
    return String(value).trim();
  };

  const normalizeRow = (row: RawRow, index: number): ParsedGame => {
    // Buscar o nome do jogo em várias colunas possíveis
    const gameNameCandidate =
      normalizeString(row.game) ||
      normalizeString(row.name) ||
      normalizeString(row.title) ||
      normalizeString((row as RawRow).jogo) ||
      normalizeString((row as RawRow).gamename) ||
      normalizeString((row as RawRow)["game name"]) ||
      normalizeString((row as RawRow)["nome do jogo"]) ||
      // Se não encontrar em nenhuma coluna específica, procurar em qualquer coluna string > 3 chars
      (Object.values(row).find((val) => typeof val === "string" && (val as string).length > 3) as
        | string
        | undefined);

    const gameName =
      typeof gameNameCandidate === "string" ? gameNameCandidate : `Linha ${index + 1}`;

    // Buscar plataforma em várias colunas possíveis
    const platformCandidate =
      normalizeString((row as RawRow).platform) ||
      normalizeString((row as RawRow).plataforma) ||
      normalizeString((row as RawRow).console) ||
      normalizeString((row as RawRow).system) ||
      normalizeString((row as RawRow).sistema);

    return {
      gameName,
      platform: platformCandidate, // ← NOVO
      progress: normalizeNumber((row as RawRow).progress ?? (row as RawRow).progresso),
      rating: normalizeNumber(
        (row as RawRow).rating ?? (row as RawRow).nota ?? (row as RawRow).score,
      ),
      status: normalizeString((row as RawRow).status ?? (row as RawRow).estado),
      media: normalizeString(
        (row as RawRow).media ?? (row as RawRow).midia ?? (row as RawRow).tipo,
      ),
      price: normalizeNumber(
        (row as RawRow).price ?? (row as RawRow).preco ?? (row as RawRow).valor,
      ),
      hasBox: normalizeBoolean(
        (row as RawRow).hasBox ??
          (row as RawRow).hasbox ??
          (row as RawRow).caixa ??
          (row as RawRow).temcaixa,
      ),
      hasManual: normalizeBoolean(
        (row as RawRow).hasManual ??
          (row as RawRow).hasmanual ??
          (row as RawRow).manual ??
          (row as RawRow).temmanual,
      ),
      condition: normalizeString((row as RawRow).condition ?? (row as RawRow).condicao),
      acceptsTrade: normalizeBoolean(
        (row as RawRow).acceptsTrade ?? (row as RawRow).acceptstrade ?? (row as RawRow).troca,
      ),
      description: normalizeString((row as RawRow).description ?? (row as RawRow).descricao),
      abandoned: normalizeBoolean((row as RawRow).abandoned ?? (row as RawRow).abandonado),
      review: normalizeString((row as RawRow).review ?? (row as RawRow).avaliacao),
    };
  };

  const applyColumnMapping = (mapping: Record<string, string>): ParsedGame[] => {
    const mapped = rawData.map((row, index) => {
      const mappedRow: Record<string, unknown> = {};
      Object.entries(mapping).forEach(([fieldKey, columnName]) => {
        mappedRow[fieldKey] = row[columnName];
      });

      // Aplicar normalização de valores
      const normalized = normalizeValues(mappedRow);

      // Mesclar valores normalizados com o row mapeado
      const finalRow = {
        ...mappedRow,
        ...normalized,
      };

      return normalizeRow(finalRow as RawRow, index);
    });
    setParsedData(mapped);
    return mapped;
  };

  return {
    parseFile,
    parsedData,
    isParsing,
    rawData,
    detectedColumns,
    applyColumnMapping,
    clearData: () => {
      setParsedData([]);
      setRawData([]);
      setDetectedColumns([]);
    },
  };
}
