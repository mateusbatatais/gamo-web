// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("@/lib/firebase", async (importOriginal) => {
  const actual = await importOriginal<typeof importOriginal>();
  return {
    ...actual,
    auth: {}, // stub do auth
    googleProvider: class {}, // stub do GoogleAuthProvider
  };
});
