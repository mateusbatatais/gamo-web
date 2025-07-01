import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Carregar .env.local apenas em ambiente local
if (!process.env.CI) {
  dotenv.config({ path: path.resolve(__dirname, ".env.local") });
}

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      // Passar variáveis para o servidor de desenvolvimento
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    },
  },
});
