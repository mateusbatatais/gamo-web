// components/molecules/BetaAlert/BetaAlert.tsx
"use client";

import React, { useEffect, useState } from "react";
import Alert from "../Alert/Alert";

export default function BetaAlert() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if running in browser environment
    if (typeof window !== "undefined") {
      const hasClosedBetaAlert = localStorage.getItem("hasClosedBetaAlert");
      if (!hasClosedBetaAlert) {
        setShow(true);
      }
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasClosedBetaAlert", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <Alert
      type="warning"
      position="bottom-center"
      message="BetaAlert.message"
      needTranslate={true}
      onClose={handleClose}
      fullWidth={true}
    />
  );
}
