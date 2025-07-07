import { chromium } from "@playwright/test";
import http from "http";

async function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http
        .get(url, (res) => {
          if (res.statusCode && res.statusCode < 500) {
            resolve();
          } else {
            retry();
          }
        })
        .on("error", retry);
    };

    const retry = () => {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Timeout waiting for ${url}`));
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

  await waitForServer("http://localhost:3000/en/login", 60000);

  await page.goto("http://localhost:3000/en/login");
  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/en/account", { timeout: 60000 });

  await page.context().storageState({ path: "tests/e2e/storageState.json" });

  await browser.close();
}

export default globalSetup;
