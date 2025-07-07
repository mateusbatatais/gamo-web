// tests/e2e/global-setup.ts
import { chromium } from "@playwright/test";
import fs from "fs";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("🌐 Acessando tela de login...");
  await page.goto("http://localhost:3000/en/login");

  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);
  await page.click('button[type="submit"]');
  console.log("🚀 Submeteu o formulário de login");

  try {
    const tokenHandle = await page.waitForFunction(() => {
      return localStorage.getItem("gamo_token");
    }, { timeout: 10000 });

    const token = await tokenHandle.jsonValue();
    console.log("🔐 Token no localStorage:", token);

    if (!token) throw new Error("Token é null");

    await page.context().storageState({ path: "tests/e2e/storageState.json" });
    console.log("✅ Estado de autenticação salvo");

  } catch (err) {
    console.error("❌ Erro ao obter token:", err);

    const html = await page.content();
    fs.writeFileSync("login-error.html", html);
    await page.screenshot({ path: "login-error.png", fullPage: true });
    console.log("📸 Screenshot e HTML salvos para inspeção");

    throw new Error("❌ Token não encontrado após login — login pode ter falhado");
  }

  await browser.close();
}

export default globalSetup;
