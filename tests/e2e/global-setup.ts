import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("🔧 ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
  console.log("🔧 ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD ? "****" : "undefined");

  await page.goto("http://localhost:3000/en/login");
  await page.screenshot({ path: "login-page.png" });

  // Espia a resposta do endpoint de login
  page.on("response", async (res) => {
    if (res.url().includes("/api/auth/login")) {
      const body = await res.text();
      console.log(`🛰️ Login response: ${res.status()} ${res.url()}`);
      console.log("🛰️ Login response body:", body);
    }
  });

  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);
  await page.click('button[type="submit"]');

  // Espera um pouco para captura de estado pós-login
  await page.waitForTimeout(5000);

  const currentUrl = page.url();
  console.log("🧭 URL após login:", currentUrl);

  const html = await page.content();
  fs.writeFileSync(path.resolve("login-debug.html"), html, "utf-8");

  const token = await page.evaluate(() => localStorage.getItem("gamo_token"));
  console.log("🔐 Token no localStorage:", token);

  await page.screenshot({ path: "login-after-submit.png" });

  if (!token) {
    throw new Error("❌ Token não encontrado após login — login pode ter falhado");
  }

  await page.context().storageState({ path: "tests/e2e/storageState.json" });
  await browser.close();
}

export default globalSetup;
