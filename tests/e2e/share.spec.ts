import { test, expect } from "@playwright/test";

test.describe("Share Popover", () => {
  test("should open share popover and show options on game details page", async ({ page }) => {
    // Navigate to a game page (assuming 'god-of-war-ragnarok' exists or similar, using a mock or a known path)
    // If we don't know a valid slug, we might need to rely on the dev environment data.
    // For now, let's try a known path or just visit the catalog and click a game if easier.

    // Visiting game catalog to find a game
    await page.goto("/game-catalog");

    // Click on the first game card
    await page.locator('a[href^="/game/"]').first().click();

    // Wait for the share button to be visible
    // The share button has accessible name "Compartilhar" (or translated) via aria-label
    const shareButton = page.getByRole("button", { name: /share|compartilhar/i });
    await expect(shareButton).toBeVisible();

    // Click share
    await shareButton.click({ force: true });

    // Wait for the Popover to appear (MUI Popover root usually has role presentation)
    // We can also wait for a generic selector if role is ambiguous
    await expect(page.locator(".MuiPopover-root")).toBeVisible();

    // Check if popover content is visible
    // Using count check to verify 3 buttons are present (Link, WhatsApp, X)
    await expect(page.locator(".MuiPopover-paper button")).toHaveCount(3);

    // Optional: Verify accessibility labels exist
    const buttons = page.locator(".MuiPopover-paper button");
    await expect(buttons.nth(0)).toHaveAttribute("aria-label", /copy|copiar/i);
    await expect(buttons.nth(1)).toHaveAttribute("aria-label", /whatsapp/i);
    await expect(buttons.nth(2)).toHaveAttribute("aria-label", /x|twitter/i);

    // Test Copy Link (mock clipboard?)
    // Playwright has limited clipboard support but we can check if button is clickable
    await buttons.nth(0).click();

    // Check if "Copiado!" or checkmark appears (we used a Check icon)
    // We didn't add text "Copiado!", but the icon changes to Check (lucide-react Check)
    // We can check if the Check icon is present.
    // The default icon is LinkIcon, successful click shows Check icon.

    // Wait for state change - we might not be able to catch it easily without specific selector
    // But verify the popover doesn't close on Copy Link (implementation: it keeps open?)
    // Logic: `handleCopyLink` sets copied state, timeout resets it. It does NOT close popover.
    // `handleWhatsApp` and `handleX` DO close popover.

    // Verification of copying is hard in E2E without granting permissions.
    // We'll trust the unit test for the logic and just verify UI interaction here.
  });
});
