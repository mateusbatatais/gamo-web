// tests/e2e/global-setup.ts
import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Get API URL from environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  console.log("🔐 Authenticating via API...");

  try {
    // Login via API to get the auth token
    const response = await page.request.post(`${apiUrl}/api/auth/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      },
    });

    if (!response.ok()) {
      const errorText = await response.text();
      console.error("❌ Login failed:", errorText);
      throw new Error(`Login failed with status ${response.status()}: ${errorText}`);
    }

    const responseData = await response.json();
    const token = responseData.token;

    if (!token) {
      throw new Error("No token received from login API");
    }

    console.log("✓ Login successful! Token received.");

    // Navigate to the app to set localStorage
    await page.goto("http://localhost:3000/en");

    // Wait for page to be ready
    await page.waitForLoadState("domcontentloaded");

    // Set the auth token in localStorage
    await page.evaluate((authToken) => {
      localStorage.setItem("gamo_token", authToken);
    }, token);

    console.log("✓ Auth token set in localStorage");

    // Save the authenticated state
    await context.storageState({ path: "tests/e2e/storageState.json" });

    console.log("✓ Storage state saved to tests/e2e/storageState.json");
  } catch (error) {
    console.error("❌ Global setup failed:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
