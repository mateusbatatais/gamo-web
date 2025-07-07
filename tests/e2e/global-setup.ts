// tests/e2e/global-setup.ts
import { chromium } from "@playwright/test";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("🌐 Acessando tela de login...");
  await page.goto("http://localhost:3000/en/login");

  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle" }),
    page.click('button[type="submit"]'),
  ]);

  // Aceita qualquer /account com ou sem locale
  const url = page.url();
  console.log("🧭 URL após login:", url);

  const token = await page.evaluate(() => localStorage.getItem("gamo_token"));
  console.log("🔐 Token no localStorage:", token);

  if (!token) {
    throw new Error("❌ Token não encontrado após login — login pode ter falhado");
  }

  await page.context().storageState({ path: "tests/e2e/storageState.json" });

  await browser.close();
}

export default globalSetup;
