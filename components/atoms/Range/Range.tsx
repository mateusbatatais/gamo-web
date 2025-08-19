// components/atoms/InputRange/InputRange.tsx
"use client";

import React from "react";
import { Slider as MuiSlider, SliderProps as MuiSliderProps, Box, Typography } from "@mui/material";
import clsx from "clsx";

export interface InputRangeProps extends Omit<MuiSliderProps, "value" | "onChange"> {
  value: number;
  onChange: (newValue: number) => void;
  label?: string;
  className?: string;
  showValue?: boolean;
  step?: number;
}

export function Range({
  value,
  onChange,
  label,
  className,
  showValue = true,
  step = 0.1,
  ...props
}: InputRangeProps) {
  const handleChange = (event: Event, newValue: number | number[]) => {
    onChange(Array.isArray(newValue) ? newValue[0] : newValue);
  };

  return (
    <Box className={clsx("w-full", className)}>
      {label && (
        <Typography variant="body2" className="mb-2 text-neutral-700 dark:text-neutral-300">
          {label}
        </Typography>
      )}

      <div className="flex items-center gap-4">
        <MuiSlider
          value={value}
          onChange={handleChange}
          min={0}
          max={10}
          step={step}
          aria-label={label || "Range slider"}
          sx={{
            color: "var(--color-primary-500)",
            "& .MuiSlider-thumb": {
              width: 16,
              height: 16,
              backgroundColor: "var(--color-primary-500)",
              "&:hover, &.Mui-focusVisible": {
                boxShadow: "0 0 0 4px var(--color-primary-100)",
              },
              "&.Mui-active": {
                boxShadow: "0 0 0 8px var(--color-primary-100)",
              },
            },
            "& .MuiSlider-rail": {
              backgroundColor: "var(--color-neutral-300)",
              opacity: 1,
            },
            "& .MuiSlider-track": {
              border: "none",
            },
          }}
          {...props}
        />

        {showValue && (
          <Typography
            variant="body1"
            className="w-10 text-center text-neutral-700 dark:text-neutral-300"
          >
            {Math.round(value * 10)}%
          </Typography>
        )}
      </div>
    </Box>
  );
}
