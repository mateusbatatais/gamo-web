import { chromium } from "@playwright/test";
import fs from "fs";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Captura logs do console
  const consoleLogs: string[] = [];
  page.on("console", (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  console.log("🌐 Acessando tela de login...");
  await page.goto("http://localhost:3000/en/login");

  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);

  console.log("🚀 Submeteu o formulário de login");

  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle" }),
    page.click('button[type="submit"]'),
  ]);

  try {
    const token = await page.waitForFunction(() => {
      return localStorage.getItem("gamo_token");
    }, { timeout: 10000 });

    const tokenValue = await token.jsonValue();

    if (!tokenValue) {
      throw new Error("Token retornou null");
    }

    await page.context().storageState({ path: "tests/e2e/storageState.json" });
  } catch (error) {
    console.error("❌ Erro ao obter token:", error);

    // Captura visual do erro
    await page.screenshot({ path: "login-error.png" });
    const html = await page.content();
    fs.writeFileSync("login-error.html", html, "utf8");

    // Captura logs do console
    fs.writeFileSync("login-console.log", consoleLogs.join("\n"), "utf8");

    console.log("📸 Screenshot, HTML e console log salvos para inspeção");
    throw new Error("❌ Token não encontrado após login — login pode ter falhado");
  }

  await browser.close();
}

export default globalSetup;
