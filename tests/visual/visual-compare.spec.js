const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Audits', () => {
  test('Verify Homepage layout snapshot', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveScreenshot('opencart-homepage-baseline.png', {
      mask: [page.locator('#carousel-banner-0')],
      maxDiffPixelRatio: 0.20,
    });
  });
});