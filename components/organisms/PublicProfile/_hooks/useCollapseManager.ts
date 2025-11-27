// hooks/useCollapseManager.ts
"use client";

import { useState } from "react";

export type ExpansionType = "accessories" | "games" | null;

export interface UseCollapseManagerReturn {
  openGridId: number | null;
  openGridRowStart: number | null;
  openGridType: ExpansionType;
  openCompactId: number | null;
  openCompactRowStart: number | null;
  openCompactType: ExpansionType;
  openListId: number | null;
  openListType: ExpansionType;
  openTableId: number | null;
  openTableType: ExpansionType;

  handleToggleGrid: (gridIndex: number, id: number, gridCols: number, type: ExpansionType) => void;
  handleToggleCompact: (
    gridIndex: number,
    id: number,
    compactCols: number,
    type: ExpansionType,
  ) => void;
  handleToggleList: (id: number, type: ExpansionType) => void;
  handleToggleTable: (id: number, type: ExpansionType) => void;
}

export function useCollapseManager(): UseCollapseManagerReturn {
  const [openGridId, setOpenGridId] = useState<number | null>(null);
  const [openGridRowStart, setOpenGridRowStart] = useState<number | null>(null);
  const [openGridType, setOpenGridType] = useState<ExpansionType>(null);

  const [openCompactId, setOpenCompactId] = useState<number | null>(null);
  const [openCompactRowStart, setOpenCompactRowStart] = useState<number | null>(null);
  const [openCompactType, setOpenCompactType] = useState<ExpansionType>(null);

  const [openListId, setOpenListId] = useState<number | null>(null);
  const [openListType, setOpenListType] = useState<ExpansionType>(null);

  const [openTableId, setOpenTableId] = useState<number | null>(null);
  const [openTableType, setOpenTableType] = useState<ExpansionType>(null);

  const handleToggleGrid = (
    gridIndex: number,
    id: number,
    gridCols: number,
    type: ExpansionType,
  ) => {
    const rowStart = gridIndex - (gridIndex % gridCols);

    // Se clicar no mesmo item e mesmo tipo, fecha
    if (openGridId === id && openGridType === type) {
      setOpenGridId(null);
      setOpenGridRowStart(null);
      setOpenGridType(null);
      return;
    }

    // Se clicar no mesmo item mas tipo diferente, apenas troca o tipo
    if (openGridId === id && openGridType !== type) {
      setOpenGridType(type);
      return;
    }

    // Se clicar em item diferente na mesma linha, apenas troca o item
    if (openGridRowStart !== null && rowStart === openGridRowStart) {
      setOpenGridId(id);
      setOpenGridType(type);
      return;
    }

    // Abre novo item
    setOpenGridId(id);
    setOpenGridRowStart(rowStart);
    setOpenGridType(type);
  };

  const handleToggleCompact = (
    gridIndex: number,
    id: number,
    compactCols: number,
    type: ExpansionType,
  ) => {
    const rowStart = gridIndex - (gridIndex % compactCols);

    if (openCompactId === id && openCompactType === type) {
      setOpenCompactId(null);
      setOpenCompactRowStart(null);
      setOpenCompactType(null);
      return;
    }

    if (openCompactId === id && openCompactType !== type) {
      setOpenCompactType(type);
      return;
    }

    if (openCompactRowStart !== null && rowStart === openCompactRowStart) {
      setOpenCompactId(id);
      setOpenCompactType(type);
      return;
    }

    setOpenCompactId(id);
    setOpenCompactRowStart(rowStart);
    setOpenCompactType(type);
  };

  const handleToggleList = (id: number, type: ExpansionType) => {
    if (openListId === id && openListType === type) {
      setOpenListId(null);
      setOpenListType(null);
      return;
    }

    if (openListId === id && openListType !== type) {
      setOpenListType(type);
      return;
    }

    setOpenListId(id);
    setOpenListType(type);
  };

  const handleToggleTable = (id: number, type: ExpansionType) => {
    if (openTableId === id && openTableType === type) {
      setOpenTableId(null);
      setOpenTableType(null);
      return;
    }

    if (openTableId === id && openTableType !== type) {
      setOpenTableType(type);
      return;
    }

    setOpenTableId(id);
    setOpenTableType(type);
  };

  return {
    openGridId,
    openGridRowStart,
    openGridType,
    openCompactId,
    openCompactRowStart,
    openCompactType,
    openListId,
    openListType,
    openTableId,
    openTableType,
    handleToggleGrid,
    handleToggleCompact,
    handleToggleList,
    handleToggleTable,
  };
}
