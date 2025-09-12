// components/atoms/Counter/Counter.tsx
"use client";

import React from "react";
import { Button } from "../Button/Button";

interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

export function Counter({
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max = Infinity,
}: CounterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={onDecrement} disabled={value <= min} label="-" />
      <span className="w-8 text-center font-medium">{value}</span>
      <Button variant="outline" size="sm" onClick={onIncrement} disabled={value >= max} label="+" />
    </div>
  );
}
