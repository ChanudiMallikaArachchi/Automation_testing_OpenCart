const { test, expect } = require('@playwright/test');
const { SearchPage } = require('../../Pages/search_page');

test.describe('Product Search Module', () => {
  let searchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await page.goto('index.php?route=common/home', { waitUntil: 'domcontentloaded' });
  });

  test('Should search for an existing product and display accurate results', async () => {
    const searchTerm = 'MacBook';

    await searchPage.performHeaderSearch(searchTerm);

    await expect(searchPage.pageHeading).toContainText(`Search - ${searchTerm}`);

    const count = await searchPage.getProductCount();
    expect(count).toBeGreaterThan(0);

    const productNames = await searchPage.getProductNames();
    productNames.forEach((name) => {
      expect(name.toLowerCase()).toContain(searchTerm.toLowerCase());
    });
  });

  test('Should display zero results message for invalid keywords', async () => {
    await searchPage.performHeaderSearch('NonExistentProductXYZ123');

    await expect(searchPage.noResultsMessage).toBeVisible();
    expect(await searchPage.getProductCount()).toBe(0);
  });

  test('Should add a product to the cart directly from search results', async ({ page }) => {
    await searchPage.performHeaderSearch('iPhone');

    await searchPage.addProductToCartByName('iPhone');

    const alertSuccess = page.locator('.alert-success, .alert');
    await expect(alertSuccess).toContainText(/Success: You have added .* to your shopping cart!/);
  });
});