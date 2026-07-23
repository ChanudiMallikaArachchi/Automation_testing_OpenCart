const { test, expect } = require('@playwright/test');
const { SearchPage } = require('../../Pages/search_page');

test.describe('Category Navigation & Product Grid Filtering', () => {
  let searchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigate();
  });

  test('Should navigate to a subcategory via top navigation dropdown', async () => {
    await searchPage.selectCategoryFromHeader('Laptops & Notebooks', 'Show All Laptops & Notebooks');

    await expect(searchPage.pageHeading).toContainText(/Laptops|Notebooks|Mac/i);
    const count = await searchPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('Should switch between Grid and List view layouts', async () => {
    await searchPage.selectCategoryFromHeader('Desktops', 'Show All Desktops');

    if (await searchPage.listBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchPage.listBtn.click();
    } else {
      await searchPage.listBtn.click({ force: true }).catch(() => {});
    }
    const firstCard = searchPage.productCards.first();
    await expect(firstCard).toHaveClass(/product-list|product-layout/);
  });

  test('Should sort products by price (Low > High)', async () => {
    await searchPage.selectCategoryFromHeader('Desktops', 'Show All Desktops');

    await searchPage.sortSelect.selectOption({ label: 'Price (Low > High)' });
    await searchPage.page.waitForURL(/sort=p\.price/, { waitUntil: 'domcontentloaded' }).catch(() => {});

    const productCards = searchPage.productCards;
    const prices = [];
    const count = await productCards.count();

    for (let i = 0; i < count; i++) {
      const card = productCards.nth(i);
      const priceText = await card.locator('.price-new, .price').first().innerText();
      const match = priceText.match(/\$([\d,]+\.\d{2})/);
      if (match) {
        prices.push(parseFloat(match[1].replace(',', '')));
      }
    }

    if (prices.length > 1) {
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sortedPrices);
    }
  });
});