// src/hooks/useFileParser.ts
"use client";

import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

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

            switch (fileType) {
              case "CSV": {
                if (typeof result !== "string") {
                  throw new Error("Conteúdo inválido para CSV");
                }
                output = parseCSV(result);
                break;
              }
              case "XLSX":
              case "XLS": {
                // FileReader.readAsArrayBuffer ensures result is ArrayBuffer
                if (!(result instanceof ArrayBuffer)) {
                  throw new Error("Conteúdo inválido para Excel");
                }
                output = parseExcel(result);
                break;
              }
              case "JSON": {
                if (typeof result !== "string") {
                  throw new Error("Conteúdo inválido para JSON");
                }
                output = parseJSON(result);
                break;
              }
              default:
                throw new Error("Formato de arquivo não suportado");
            }

            setParsedData(output);
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

  const parseCSV = (content: string): ParsedGame[] => {
    const results = Papa.parse<RawRow>(content, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim(),
    });

    return results.data.map((row, index) => normalizeRow(row, index));
  };

  const parseExcel = (content: ArrayBuffer): ParsedGame[] => {
    const workbook = XLSX.read(content, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json<RawRow>(firstSheet);

    return jsonData.map((row, index) => normalizeRow(row, index));
  };

  const parseJSON = (content: string): ParsedGame[] => {
    const parsed: unknown = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      throw new Error("JSON deve ser um array");
    }

    return parsed.map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        // Mantém comportamento robusto: se item não for objeto, cria linha vazia para cair no fallback
        return normalizeRow({}, index);
      }
      return normalizeRow(item as RawRow, index);
    });
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
        (row as RawRow).hasbox ?? (row as RawRow).caixa ?? (row as RawRow).temcaixa,
      ),
      hasManual: normalizeBoolean(
        (row as RawRow).hasmanual ?? (row as RawRow).manual ?? (row as RawRow).temmanual,
      ),
      condition: normalizeString((row as RawRow).condition ?? (row as RawRow).condicao),
      acceptsTrade: normalizeBoolean((row as RawRow).acceptstrade ?? (row as RawRow).troca),
      description: normalizeString((row as RawRow).description ?? (row as RawRow).descricao),
      abandoned: normalizeBoolean((row as RawRow).abandoned ?? (row as RawRow).abandonado),
      review: normalizeString((row as RawRow).review ?? (row as RawRow).avaliacao),
    };
  };

  return {
    parseFile,
    parsedData,
    isParsing,
    clearData: () => setParsedData([]),
  };
}
