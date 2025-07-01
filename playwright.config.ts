import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Carregar .env.local apenas em ambiente local
if (!process.env.CI) {
  dotenv.config({ path: path.resolve(__dirname, ".env.local") });
}

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // Desativar paralelismo no CI
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Usar apenas 1 worker
  reporter: [["html"], ["list"]], // Adicionar reporter de console
  timeout: process.env.CI ? 180000 : 60000, // 3 minutos timeout global
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Timeouts aumentados para CI
    actionTimeout: process.env.CI ? 60000 : 30000,
    navigationTimeout: process.env.CI ? 120000 : 60000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Configurações específicas para CI
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: process.env.CI
            ? [
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--disable-setuid-sandbox",
                "--no-sandbox",
              ]
            : [],
        },
      },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: process.env.CI ? 300000 : 120000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      NEXT_PUBLIC_API_URL: "http://localhost:3000",
      NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
      // Forçar modo de desenvolvimento
      NODE_ENV: "development",
      // Logs detalhados
      DEBUG: "firebase:*",
      FIREBASE_DEBUG: "true",
    },
  },
});
