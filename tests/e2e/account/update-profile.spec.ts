// tests/e2e/account/update-profile.spec.ts
import { test, expect } from "@playwright/test";

const DEFAULT_LOCALE = "en";
// const TEST_USER = {
//   email: process.env.ADMIN_EMAIL!,
//   password: process.env.ADMIN_PASSWORD!,
// };

// test("Atualizar perfil do usuário", async ({ page }) => {
//   // 1. Fazer login
//   await page.route("**/api/auth/login", (route) => {
//     route.fulfill({
//       status: 200,
//       contentType: "application/json",
//       body: JSON.stringify({ token: "mock-jwt-token" }),
//     });
//   });

//   await page.goto(`/${DEFAULT_LOCALE}/login`);
//   await page.fill('input[name="email"]', TEST_USER.email);
//   await page.fill('input[name="password"]', TEST_USER.password);
//   await page.click('button[type="submit"]');
//   await page.waitForURL(`**/${DEFAULT_LOCALE}/account`);

//   // 2. Navegar para a página de detalhes da conta
//   await page.goto(`/${DEFAULT_LOCALE}/account/details`);
//   await page.waitForTimeout(5000);
//   await page.waitForSelector('input[data-testid="input-name"]');

//   // 3. Atualizar campos de texto
//   const newName = "Novo Nome de Teste";
//   const newSlug = "novo-slug";
//   const newDescription = "Nova descrição de teste";

//   await page.fill('input[data-testid="input-name"]', newName);
//   await page.fill('input[data-testid="input-slug"]', newSlug);
//   await page.fill('textarea[data-testid="input-textarea-description"]', newDescription);

//   // Mock das APIs de atualização
//   await page.route("**/api/user/profile", (route) => {
//     route.fulfill({
//       status: 200,
//       contentType: "application/json",
//       body: JSON.stringify({ success: true }),
//     });
//   });

//   await page.route("**/api/uploads/profile", (route) => {
//     route.fulfill({
//       status: 200,
//       contentType: "application/json",
//       body: JSON.stringify({ url: "https://example.com/new-profile.jpg" }),
//     });
//   });

//   // 4. Testar upload de imagem
//   // Criar um arquivo de imagem fake para upload
//   const fileChooserPromise = page.waitForEvent("filechooser");
//   await page.click('[data-testid="button-select-photo"]');
//   const fileChooser = await fileChooserPromise;

//   // Criar um arquivo de imagem fake
//   await fileChooser.setFiles({
//     name: "profile.jpg",
//     mimeType: "image/jpeg",
//     buffer: Buffer.from(
//       "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
//       "base64",
//     ),
//   });

//   // Aguardar o cropper aparecer e confirmar
//   await page.waitForSelector(".react-easy-crop-container");
//   await page.click("text=/confirmar|crop/i"); // Adaptar ao texto real do seu botão

//   // 5. Salvar alterações
//   await page.click('[data-testid="button-save"]');

//   // Verificar toast de sucesso
//   await expect(
//     page.locator('[role="alert"]').getByText(/perfil atualizado com sucesso/i),
//   ).toBeVisible();

//   // 6. Verificar se os valores persistiram (recarregar a página)
//   await page.reload();
//   await expect(page.locator('input[data-testid="input-name"]')).toHaveValue(newName);
//   await expect(page.locator('input[data-testid="input-slug"]')).toHaveValue(newSlug);
//   await expect(page.locator('textarea[data-testid="input-textarea-description"]')).toHaveValue(
//     newDescription,
//   );

//   // 7. Verificar se a nova imagem aparece
//   await expect(page.locator('img[alt="Avatar"]')).toHaveAttribute("src", /new-profile\.jpg/);
// });

test("Tentar atualizar perfil sem autenticação", async ({ page }) => {
  // Tentar acessar diretamente sem login
  await page.goto(`/${DEFAULT_LOCALE}/account/details`);

  // Verificar se foi redirecionado para login
  await page.waitForURL(`**/${DEFAULT_LOCALE}/login`);
  await expect(page.getByText(/Sign in to continue/i)).toBeVisible();
});
