// tests/e2e/global-setup.ts
import { chromium } from "@playwright/test";
import { promises as fs } from "fs";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("[global-setup] ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
  console.log("[global-setup] ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD ? '***' : 'NOT SET');

  await page.goto("http://localhost:3000/en/login");
  console.log("[global-setup] Navigated to login page");

  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);
  console.log("[global-setup] Filled email");

  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);
  console.log("[global-setup] Filled password");

  await page.click('button[type="submit"]');
  console.log("[global-setup] Clicked submit");

  // Screenshot after submit for debugging
  await page.screenshot({ path: 'tests/e2e/login-after-submit.png', fullPage: true });
  console.log("[global-setup] Screenshot taken after submit");

  // Save HTML after submit for debugging
  const html = await page.content();
  await fs.writeFile('tests/e2e/login-after-submit.html', html);
  console.log("[global-setup] HTML saved after submit");

  await page.waitForURL("**/en/account", { timeout: 60000 });
  console.log("[global-setup] Navigated to /en/account");

  await page.context().storageState({ path: "tests/e2e/storageState.json" });

  await browser.close();
}

export default globalSetup;
