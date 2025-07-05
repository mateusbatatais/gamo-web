// tests/e2e/auth.setup.ts
import { test as setup, expect } from "@playwright/test";

const DEFAULT_LOCALE = "en";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

setup("autenticar como administrador", async ({ page, context }) => {
  // Fazer login
  await page.goto(`/${DEFAULT_LOCALE}/login`);
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');

  // Aguardar redirecionamento para a conta
  await page.waitForURL(`**/${DEFAULT_LOCALE}/account`);

  // Verificar se o token está no localStorage
  const token = await page.evaluate(() => localStorage.getItem("gamo_token"));
  expect(token).toBeTruthy();

  // Salvar o estado de autenticação
  await context.storageState({ path: "playwright/.auth/admin.json" });
});
