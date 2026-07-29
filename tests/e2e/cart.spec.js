const { test, expect } = require('@playwright/test');
const { CartPage } = require('../../Pages/cart_page');
const { SearchPage } = require('../../Pages/search_page');

test.describe('Shopping Cart Operations', () => {
  let cartPage;
  let searchPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    searchPage = new SearchPage(page);

    await page.goto('index.php?route=common/home', { waitUntil: 'domcontentloaded' });
    await searchPage.performHeaderSearch('iPhone');
    await searchPage.addProductToCartByName('iPhone');
    
    await expect(page.locator('.alert-success, .alert')).toBeVisible();
    await cartPage.navigate();
  });

  test('Should update item quantity in cart', async () => {
    await cartPage.updateQuantity('iPhone', 2);

    await expect(cartPage.alertSuccess).toContainText('Success: You have modified your shopping cart!');
  });

  test('Should display error for invalid coupon code', async () => {
    await cartPage.applyCoupon('INVALID_COUPON_99');

    await expect(cartPage.alertDanger).toContainText('Warning: Coupon is either invalid, expired or reached its usage limit!');
  });

  test('Should remove item from cart', async () => {
    await cartPage.removeItem('iPhone');

    await expect(cartPage.emptyCartMessage).toBeVisible();
  });
});