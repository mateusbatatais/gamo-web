// tests/e2e/auth/signup.spec.ts
import { test, expect } from "@playwright/test";

const DEFAULT_LOCALE = "en";

test("Fluxo completo de cadastro", async ({ page }) => {
  // 1. Mock das APIs
  await mockAPIs(page);

  // 2. Executar fluxo de cadastro
  await completeSignupFlow(page);

  // 3. Testar reenvio de email sem espera
  await testEmailResend(page);
});

// Funções auxiliares
interface SignupResponse {
  userId: string;
  code: string;
}

interface ResendVerificationResponse {
  success: boolean;
}

async function mockAPIs(page: import("@playwright/test").Page): Promise<void> {
  // Mock da rota de cadastro
  await page.route("**/api/auth/signup", (route: import("@playwright/test").Route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        userId: "123",
        code: "USER_CREATED",
      } as SignupResponse),
    });
  });

  // Mock da rota de reenvio
  await page.route("**/api/auth/resend-verification", (route: import("@playwright/test").Route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
      } as ResendVerificationResponse),
    });
  });
}

interface CompleteSignupFlowPage {
  goto(url: string): Promise<import("@playwright/test").Response | null>;
  fill(selector: string, value: string): Promise<void>;
  click(selector: string): Promise<void>;
  waitForURL(url: string): Promise<void>;
  getByText(text: string): import("@playwright/test").Locator;
}

async function completeSignupFlow(page: CompleteSignupFlowPage): Promise<void> {
  // Acessar página de cadastro
  await page.goto(`/${DEFAULT_LOCALE}/signup`);

  // Preencher formulário
  await page.fill('input[name="name"]', "Novo Usuário");
  await page.fill('input[name="email"]', "novo.usuario@example.com");
  await page.fill('input[name="password"]', "SenhaSegura123!");

  // Submeter formulário
  await page.click('button[type="submit"]');

  // Verificar redirecionamento
  await page.waitForURL(`**/${DEFAULT_LOCALE}/signup/success?email=*`);

  // Verificar exibição do email
  await expect(page.getByText("novo.usuario@example.com")).toBeVisible();
}

interface ReactFiberNode {
  return?: ReactFiberNode & { stateNode?: ReactComponentInstance };
  stateNode?: ReactComponentInstance;
}

interface ReactComponentInstance {
  setState?: (state: { remainingTime: number; canResend: boolean }) => void;
}

async function testEmailResend(page: import("@playwright/test").Page): Promise<void> {
  await page.evaluate(() => {
    // Encontrar o componente pelo testId
    const component = document.querySelector('[data-testid="signup-success-page"]');
    if (component) {
      // Acessar a instância React (método específico para Next.js)
      const keys = Object.keys(component);
      const reactKey = keys.find((key) => key.startsWith("__reactFiber$"));

      if (reactKey) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fiberNode = (component as any)[reactKey] as ReactFiberNode;
        // Encontrar o estado do componente e modificar
        let instance = fiberNode.return?.stateNode;
        while (instance && !instance.setState) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          instance = (instance as any).return?.stateNode;
        }

        if (instance && instance.setState) {
          // Forçar o estado para "pode reenviar"
          instance.setState({
            remainingTime: 0,
            canResend: true,
          });
        }
      }
    }
  });

  await page.click('[data-testid="resend-button"]');
  await expect(page.getByTestId("resend-success-message")).toBeVisible();
}
