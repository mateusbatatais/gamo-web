// components/LogRocketInit.tsx
"use client";

import { initLogRocket } from "@/lib/logrocket";
import { useEffect } from "react";

export default function LogRocketInit() {
  useEffect(() => {
    initLogRocket();
  }, []);

  return null;
}
