// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { mockUseTimer } from "./tests/mocks/useTimer";

vi.mock("@/lib/firebase", async (importOriginal) => {
  const actual = await importOriginal<typeof importOriginal>();
  return {
    ...actual,
    auth: {}, // stub do auth
    googleProvider: class {}, // stub do GoogleAuthProvider
  };
});

// Mock global do useTimer
vi.mock("@/hooks/useTimer", () => ({
  useTimer: mockUseTimer,
}));
