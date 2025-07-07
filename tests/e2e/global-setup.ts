// tests/e2e/global-setup.ts
import { chromium } from "@playwright/test";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("🌐 Acessando tela de login...");
  await page.goto("http://localhost:3000/en/login");

  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);

  await page.click('button[type="submit"]');
  console.log("🚀 Submeteu o formulário de login");

  // Espera até 10s para o token aparecer no localStorage
  const token = await page.waitForFunction(() => {
    return localStorage.getItem("gamo_token");
  }, { timeout: 10000 });

  const resolvedToken = await token.jsonValue();
  console.log("🔐 Token no localStorage:", resolvedToken);

  if (!resolvedToken) {
    throw new Error("❌ Token não encontrado após login — login pode ter falhado");
  }

  await page.context().storageState({ path: "tests/e2e/storageState.json" });
  console.log("✅ Estado de autenticação salvo");

  await browser.close();
}

export default globalSetup;
