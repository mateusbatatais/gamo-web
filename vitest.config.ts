// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname) },
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  test: {
    environment: "jsdom",
    globals: true,
    // aqui você inclui tanto testes unitários quanto, se quiser, stories também
    include: [
      "components/**/*.test.ts",
      "components/**/*.test.tsx",
      // se quiser rodar stories como testes unitários:
      // 'components/**/*.stories.tsx',
    ],
    setupFiles: ["./vitest.setup.ts"],
  },
});
