"use client";

import React from "react";

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
    <div className="flex items-center space-x-1">
      <button
        className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onDecrement}
        disabled={value <= min}
      >
        -
      </button>
      <span className="w-6 text-center text-sm font-medium">{value}</span>
      <button
        className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onIncrement}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
