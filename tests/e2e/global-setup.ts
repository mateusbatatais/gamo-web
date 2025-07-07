import { chromium } from "@playwright/test";

/**
 * Aguarda até que o servidor Next.js esteja pronto, fazendo requisições repetidas.
 */
async function waitForServerReady(url: string, timeout = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch (_) {
      // aguarda antes de tentar de novo
    }
    await new Promise((res) => setTimeout(res, 1000));
  }
  throw new Error(`Servidor não respondeu dentro de ${timeout / 1000} segundos: ${url}`);
}

export default async function globalSetup() {
  const loginUrl = "http://localhost:3000/en/login";
  await waitForServerReady(loginUrl);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(loginUrl);
  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/en/account");

  await page.context().storageState({ path: "tests/e2e/storageState.json" });
  await browser.close();
}
