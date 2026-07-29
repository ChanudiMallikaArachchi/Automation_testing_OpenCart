const { test, expect } = require('@playwright/test');
const { ComparePage } = require('../../Pages/compare_page');
const { ProductDetailsPage } = require('../../Pages/product_details_page');

test.describe('Compare Products Module', () => {
  let comparePage;
  let productDetailsPage;

  test.beforeEach(async ({ page }) => {
    comparePage = new ComparePage(page);
    productDetailsPage = new ProductDetailsPage(page);
  });

  test('Should add multiple products to compare table side-by-side', async () => {

    await productDetailsPage.navigateToProduct('40');
    await productDetailsPage.addToCompare();
    await expect(productDetailsPage.alertSuccess).toContainText(/Success: You have added .* to your product comparison/);
    await productDetailsPage.page.waitForTimeout(1000);

    await productDetailsPage.navigateToProduct('43');
    await productDetailsPage.addToCompare();
    await expect(productDetailsPage.alertSuccess).toContainText(/Success: You have added .* to your product comparison/);
    await productDetailsPage.page.waitForTimeout(1000);

    await comparePage.navigate();
    const productNames = await comparePage.getComparedProductNames();

    expect(productNames.length).toBeGreaterThan(0);
  });

  test('Should display empty message when no products are selected', async ({ page }) => {
    await page.context().clearCookies();
    await comparePage.navigate();
    await expect(comparePage.emptyCompareMessage).toBeVisible();
  });
});