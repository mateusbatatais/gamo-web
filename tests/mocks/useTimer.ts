// tests/mocks/useTimer.ts
import { vi } from "vitest";

export const mockUseTimer = vi.fn().mockImplementation((options) => {
  return [
    options.initialTime,
    {
      start: vi.fn(),
      pause: vi.fn(),
      reset: vi.fn(),
    },
  ];
});
