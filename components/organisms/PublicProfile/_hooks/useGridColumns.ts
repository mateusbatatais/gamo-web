// hooks/useGridColumns.ts
"use client";

import { useState, useEffect } from "react";

export function useGridColumns(mode: "normal" | "compact") {
  const [cols, setCols] = useState<number>(mode === "normal" ? 2 : 3);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;

      if (mode === "normal") {
        if (w >= 1024) setCols(4);
        else if (w >= 768) setCols(3);
        else setCols(2);
      } else {
        if (w >= 1536) setCols(8);
        else if (w >= 1024) setCols(6);
        else if (w >= 768) setCols(4);
        else setCols(3);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [mode]);

  return cols;
}
