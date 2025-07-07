// tests/e2e/global-setup.ts
import { chromium } from "@playwright/test";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:3000/en/login");
  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/en/account");

  await page.context().storageState({ path: "tests/e2e/storageState.json" });

  await browser.close();
}

export default globalSetup;
