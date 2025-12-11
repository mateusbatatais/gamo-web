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

  // Click submit button
  await page.click('button[type="submit"]');

  try {
    // Wait for redirect - flexible pattern that matches any non-login page
    // Using waitForURL instead of deprecated waitForNavigation
    await page.waitForURL((url) => !url.pathname.includes("/login"), {
      timeout: 30000,
    });

    const currentUrl = page.url();
    console.log("Login successful! Redirected to:", currentUrl);
  } catch (error) {
    console.error("Login redirect timeout! Dumping page content...");
    const content = await page.content();
    const currentUrl = page.url();
    console.log("Current URL:", currentUrl);
    console.log("Page Content:", content.substring(0, 1000));
    throw error;
  }

  await page.context().storageState({ path: "tests/e2e/storageState.json" });
  await browser.close();
}

export default globalSetup;
