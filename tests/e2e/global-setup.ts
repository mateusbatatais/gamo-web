import { chromium } from "@playwright/test";
import http from "http";

async function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode && res.statusCode < 500) {
          console.log(`🟢 Servidor respondeu com ${res.statusCode}`);
          resolve();
        } else {
          retry();
        }
      }).on("error", retry);
    };

    const retry = () => {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Timeout esperando ${url}`));
      } else {
        setTimeout(check, 1000);
      }
    };

    check();
  });
}

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 🔁 Aguarda o servidor estar no ar
  await waitForServer("http://localhost:3000/en/login", 60000);

  // Acessa a página de login
  await page.goto("http://localhost:3000/en/login");

  // Preenche e submete o formulário
  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);
  await page.click('button[type="submit"]');

  // Aguarda carregamento completo
  await page.waitForLoadState("networkidle");

  // Debug: mostra URL final e verifica token
  const finalUrl = page.url();
  console.log("🧭 URL após login:", finalUrl);

  const token = await page.evaluate(() => localStorage.getItem("gamo_token"));
  console.log("🔐 Token no localStorage:", token);

  if (!token) {
    throw new Error("❌ Token não encontrado após login — login pode ter falhado");
  }

  // Salva estado de autenticação
  await page.context().storageState({ path: "tests/e2e/storageState.json" });

  await browser.close();
}

export default globalSetup;
