// hooks/useTimer.ts
import { useState, useEffect, useCallback } from "react";

type TimerOptions = {
  initialTime: number;
  onComplete?: () => void;
  onTick?: (remainingTime: number) => void;
  autoStart?: boolean;
};

type TimerControls = {
  start: () => void;
  pause: () => void;
  reset: (newTime?: number) => void;
};

export const useTimer = (options: TimerOptions): [number, TimerControls] => {
  const { initialTime, onComplete, onTick, autoStart = true } = options;

  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(autoStart);

  const tick = useCallback(() => {
    if (remainingTime <= 1) {
      setRemainingTime(0);
      setIsActive(false);
      onComplete?.();
      return;
    }

    setRemainingTime((prev) => prev - 1);
    onTick?.(remainingTime - 1);
  }, [remainingTime, onComplete, onTick]);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(
    (newTime?: number) => {
      setIsActive(autoStart);
      setRemainingTime(newTime ?? initialTime);
    },
    [autoStart, initialTime],
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isActive && remainingTime > 0) {
      intervalId = setInterval(tick, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, remainingTime, tick]);

  return [remainingTime, { start, pause, reset }];
};
