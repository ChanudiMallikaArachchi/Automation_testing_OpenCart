const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../../Pages/register_page');
const { CheckoutPage } = require('../../Pages/checkout_page');

test.describe('End-to-End Checkout Workflow', () => {
  test('Should complete purchase flow as an authenticated user', async ({ page }) => {
    test.setTimeout(90000);

    const registerPage = new RegisterPage(page);
    const checkoutPage = new CheckoutPage(page);

    const userEmail = `buyer_${Date.now()}@example.com`;

    await registerPage.navigate();
    await registerPage.registerUser({
      firstName: 'Jane',
      lastName: 'Smith',
      email: userEmail,
      password: 'Password123!',
    });
    await expect(page.locator('#content')).toContainText(/Your new account has been successfully created|Your Account Has Been Created/);

    // Add HP LP3065 (product_id 47) which has stock in demo DB
    await page.goto('index.php?route=product/product&product_id=47', { waitUntil: 'domcontentloaded' });
    const dateInput = page.locator('#input-option225');
    if (await dateInput.isVisible().catch(() => false)) {
      await dateInput.fill('2026-12-31');
    }
    await page.locator('#button-cart').click();
    await expect(page.locator('.alert-success, .alert')).toBeVisible();

    await page.goto('index.php?route=checkout/cart', { waitUntil: 'domcontentloaded' });
    
    // Check if redirect or checkout button
    const checkoutLink = page.locator('a.btn-primary:has-text("Checkout"), a[href*="checkout/checkout"]').last();
    if (await checkoutLink.isVisible().catch(() => false)) {
      await checkoutLink.click();
    } else {
      await page.goto('index.php?route=checkout/checkout', { waitUntil: 'domcontentloaded' });
    }

    await checkoutPage.completeCheckout({
      firstName: 'Jane',
      lastName: 'Smith',
      address: '123 Test Street',
      city: 'London',
      postcode: 'E1 6AN',
      country: 'United Kingdom',
      zone: 'Greater London',
    });

    await expect(page.locator('#content')).toContainText(/Your order has been placed|Your order has been processed|Order/i, { timeout: 20000 });
  });
});