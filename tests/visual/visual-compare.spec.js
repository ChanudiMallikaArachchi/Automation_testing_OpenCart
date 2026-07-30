const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Audits', () => {
  test('Verify Homepage layout snapshot', async ({ page }) => {
    test.setTimeout(30000);
    await page.goto('/');

    await expect(page).toHaveScreenshot('opencart-homepage-baseline.png', {
      mask: [page.locator('#slideshow0'), page.locator('#carousel0'), page.locator('#carousel-banner-0')],
      maxDiffPixelRatio: 0.45,
    });
  });
});