// hooks/useImageLoading.ts
"use client";

import { useState, useCallback } from "react";

export const useImageLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => setIsLoading(false), []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  return {
    isLoading,
    hasError,
    handleLoad,
    handleError,
    reset,
  };
};
