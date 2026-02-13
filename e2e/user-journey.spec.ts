import { test, expect } from '@playwright/test';

test('Full User Journey', async ({ page }) => {
    // 1. Initial Load & Name Screen
    await page.goto('/');
    // Check for main title which is more stable
    await expect(page.getByText("Valentine's")).toBeVisible();
    await expect(page.locator('input#name')).toBeVisible();
    await page.fill('input#name', 'TestUser');
    await page.click('button[type="submit"]');

    // 2. Proposal Screen
    await expect(page.getByText('BE MY VALENTINE?')).toBeVisible();

    // Test "No" button evasion (optional/hard to test precisely, simplified check)
    const noBtn = page.getByText('NO');
    await expect(noBtn).toBeVisible();

    // Answer "Yes"
    await page.click('text=YES');

    // 3. Game Screen
    // Verify game canvas loads
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.getByText('Catch hearts, dodge tools!')).toBeVisible();

    // Wait for score to update (simulating gameplay is hard without custom logic, 
    // but we can verify the HUD exists)
    await expect(page.getByText('Target: 25 ❤️')).toBeVisible();

    // Cheat: Manually trigger game finish by evaluating script if possible, 
    // or just wait for timeout if we had one. 
    // For now, we'll just check that the game screen loaded successfully.
    // To truly test the flow, we might need a "debug skip" or just interact with the canvas.

    // NOTE: Interacting with canvas in Playwright is complex. 
    // We will assume if the canvas and HUD are present, the game loaded.
});
