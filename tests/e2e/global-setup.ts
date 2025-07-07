// tests/e2e/global-setup.ts
import { chromium } from "@playwright/test";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("🌐 Acessando app para injetar token");
  await page.goto("http://localhost:3000/en"); // qualquer rota pública

  const token = process.env.TEST_TOKEN;
  if (!token) {
    throw new Error("❌ TEST_TOKEN não definido no ambiente");
  }

  console.log("🔐 Inserindo token manualmente no localStorage...");
  await page.addInitScript((tokenVal) => {
    localStorage.setItem("gamo_token", tokenVal);
  }, token);

  // Recarrega a página para garantir que a aplicação leia o token
  await page.reload();

  console.log("💾 Salvando storageState com token");
  await page.context().storageState({ path: "tests/e2e/storageState.json" });

  await browser.close();
}

export default globalSetup;
