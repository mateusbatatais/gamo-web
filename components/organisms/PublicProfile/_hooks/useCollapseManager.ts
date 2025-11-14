// hooks/useCollapseManager.ts
"use client";

import { useState } from "react";

export interface UseCollapseManagerReturn {
  openGridId: number | null;
  openGridRowStart: number | null;
  openCompactId: number | null;
  openCompactRowStart: number | null;
  openListId: number | null;
  openTableId: number | null;

  handleToggleGrid: (gridIndex: number, id: number, gridCols: number) => void;
  handleToggleCompact: (gridIndex: number, id: number, compactCols: number) => void;
  handleToggleList: (id: number) => void;
  handleToggleTable: (id: number) => void;
}

export function useCollapseManager(): UseCollapseManagerReturn {
  const [openGridId, setOpenGridId] = useState<number | null>(null);
  const [openGridRowStart, setOpenGridRowStart] = useState<number | null>(null);
  const [openCompactId, setOpenCompactId] = useState<number | null>(null);
  const [openCompactRowStart, setOpenCompactRowStart] = useState<number | null>(null);
  const [openListId, setOpenListId] = useState<number | null>(null);
  const [openTableId, setOpenTableId] = useState<number | null>(null);

  const handleToggleGrid = (gridIndex: number, id: number, gridCols: number) => {
    const rowStart = gridIndex - (gridIndex % gridCols);
    if (openGridId === id) {
      setOpenGridId(null);
      setOpenGridRowStart(null);
      return;
    }
    if (openGridRowStart !== null && rowStart === openGridRowStart) {
      setOpenGridId(id);
      return;
    }
    setOpenGridId(id);
    setOpenGridRowStart(rowStart);
  };

  const handleToggleCompact = (gridIndex: number, id: number, compactCols: number) => {
    const rowStart = gridIndex - (gridIndex % compactCols);
    if (openCompactId === id) {
      setOpenCompactId(null);
      setOpenCompactRowStart(null);
      return;
    }
    if (openCompactRowStart !== null && rowStart === openCompactRowStart) {
      setOpenCompactId(id);
      return;
    }
    setOpenCompactId(id);
    setOpenCompactRowStart(rowStart);
  };

  const handleToggleList = (id: number) => {
    setOpenListId((prev) => (prev === id ? null : id));
  };

  const handleToggleTable = (id: number) => {
    setOpenTableId((prev) => (prev === id ? null : id));
  };

  return {
    openGridId,
    openGridRowStart,
    openCompactId,
    openCompactRowStart,
    openListId,
    openTableId,
    handleToggleGrid,
    handleToggleCompact,
    handleToggleList,
    handleToggleTable,
  };
}
