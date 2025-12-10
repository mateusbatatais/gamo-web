// tests/e2e/global-setup.ts
import { chromium } from "@playwright/test";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

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
