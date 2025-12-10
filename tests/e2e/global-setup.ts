// tests/e2e/global-setup.ts
import { chromium } from "@playwright/test";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Captura erros do console e falhas de rede para debug
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log(`[BROWSER ERROR] ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    console.log(`[PAGE ERROR] ${err.message}`);
  });
  page.on("response", async (response) => {
    if (response.status() >= 400 && response.url().includes("/api/")) {
      console.log(`[API ERROR] ${response.status()} ${response.url()}`);
      try {
        console.log(`[BODY] ${await response.text()}`);
      } catch (e) {
        console.log("[BODY] Could not read response body");
      }
    }
  });

  await page.goto("http://localhost:3000/en/login");

  // Adicione waitForSelector
  await page.waitForSelector('input[name="email"]', { state: "visible", timeout: 15000 });

  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);

  // Adicione verificação antes do click
  await page.click('button[type="submit"]');

  try {
    // Timeout maior para o redirecionamento
    await page.waitForURL("**/en/account", { timeout: 30000 });
  } catch (error) {
    console.error("Login redirect timeout! Dumping page content...");
    const content = await page.content();
    console.log("Page Content:", content); // Print HTML to logs
    throw error;
  }

  await page.context().storageState({ path: "tests/e2e/storageState.json" });
  await browser.close();
}

export default globalSetup;
