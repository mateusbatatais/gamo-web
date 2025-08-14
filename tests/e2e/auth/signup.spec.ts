// tests/e2e/auth/signup.spec.ts
import { test, expect } from "@playwright/test";

const DEFAULT_LOCALE = "en";

test("Fluxo completo de cadastro", async ({ page }) => {
  // 1. Mock das APIs
  await mockAPIs(page);

  // 2. Executar fluxo de cadastro
  await completeSignupFlow(page);

  // 3. Testar reenvio de email
  await testEmailResend(page);
});

// Funções auxiliares corrigidas
interface SignupResponse {
  userId: string;
  code: string;
}

interface ResendVerificationResponse {
  success: boolean;
}

async function mockAPIs(page: import("@playwright/test").Page): Promise<void> {
  // Mock da rota de cadastro (corrigido - removido await desnecessário)
  await page.route("**/api/auth/signup", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        userId: "123",
        code: "USER_CREATED",
      } as SignupResponse),
    });
  });

  // Mock da rota de reenvio (corrigido)
  await page.route("**/api/auth/resend-verification", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
      } as ResendVerificationResponse),
    });
  });

  // Mock adicional para evitar chamadas não tratadas
  await page.route("**/api/auth/session", (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ user: null }),
    });
  });
}

async function completeSignupFlow(page: import("@playwright/test").Page): Promise<void> {
  // Acessar página de cadastro com wait for ready state
  await page.goto(`/${DEFAULT_LOCALE}/signup`);
  await page.waitForLoadState("networkidle");

  // Aguardar formulário estar visível
  await page.waitForSelector('input[name="name"]', { state: "visible", timeout: 15000 });
  await expect(page.locator('button[type="submit"]')).toBeEnabled();

  // Preencher formulário com verificações
  await page.fill('input[name="name"]', "Novo Usuário");
  await expect(page.locator('input[name="name"]')).toHaveValue("Novo Usuário");

  const testEmail = "novo.usuario@example.com";
  await page.fill('input[name="email"]', testEmail);
  await expect(page.locator('input[name="email"]')).toHaveValue(testEmail);

  const testPassword = "SenhaSegura123!";
  await page.fill('input[name="password"]', testPassword);
  await expect(page.locator('input[name="password"]')).toHaveValue(testPassword);

  // Submeter formulário com wait para a resposta
  await Promise.all([
    page.waitForResponse(
      (response) => response.url().includes("/api/auth/signup") && response.status() === 200,
    ),
    page.click('button[type="submit"]'),
  ]);

  // Verificar redirecionamento e conteúdo
  await page.waitForURL(`**/${DEFAULT_LOCALE}/signup/success*`, { timeout: 30000 });
  await expect(page.getByText(testEmail)).toBeVisible();
}

async function testEmailResend(page: import("@playwright/test").Page): Promise<void> {
  // Solução mais confiável que manipulação direta do estado React
  await page.evaluate(() => {
    localStorage.setItem("lastEmailSentTime", "0"); // Força permitir reenvio
  });

  // Aguardar botão estar disponível
  const resendButton = page.locator('[data-testid="resend-button"]');
  await resendButton.waitFor({ state: "visible", timeout: 40000 });

  // Disparar reenvio e aguardar feedback
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/auth/resend-verification") && response.status() === 200,
    ),
    resendButton.click(),
  ]);

  // Verificar mensagem de sucesso
  await expect(page.getByTestId("resend-success-message")).toBeVisible({
    timeout: 15000,
  });
}
