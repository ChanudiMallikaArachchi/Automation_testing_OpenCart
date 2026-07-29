const { test, expect } = require('@playwright/test');
const { WishlistPage } = require('../../Pages/wishlist_page');
const { RegisterPage } = require('../../Pages/register_page');
const { ProductDetailsPage } = require('../../Pages/product_details_page');

test.describe('Wishlist Module', () => {
  let wishlistPage;
  let productDetailsPage;

  test.beforeEach(async ({ page }) => {
    wishlistPage = new WishlistPage(page);
    productDetailsPage = new ProductDetailsPage(page);
  });

  test('Should redirect guest user to Login page when accessing Wishlist', async ({ page }) => {
    await wishlistPage.navigate();
    await expect(page).toHaveURL(/.*route=account\/login/);
  });

  test('Should add product to Wishlist as authenticated user and transfer to Cart', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const email = `wishlist_user_${Date.now()}@example.com`;

    // 1. Register user
    await registerPage.navigate();
    await registerPage.registerUser({
      firstName: 'Wish',
      lastName: 'Tester',
      email: email,
      password: 'Password123!',
    });

    // 2. Add product (iPhone) to Wishlist from details page
    await productDetailsPage.navigateToProduct('40');
    await productDetailsPage.addToWishlist();
    await expect(productDetailsPage.alertSuccess).toContainText('Success: You have added iPhone to your wish list!');

    // 3. Open Wishlist and verify product presence
    await wishlistPage.navigate();
    const itemRow = await wishlistPage.getItemRow('iPhone');
    await expect(itemRow).toBeVisible();

    // 4. Move product from Wishlist to Cart
    await wishlistPage.addProductToCart('iPhone');
    await expect(wishlistPage.alertSuccess).toContainText('Success: You have added iPhone to your shopping cart!');
  });

  test('Should remove item from Wishlist', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Register & Add item
    await registerPage.navigate();
    await registerPage.registerUser({
      firstName: 'Remove',
      lastName: 'Tester',
      email: `remove_wish_${Date.now()}@example.com`,
      password: 'Password123!',
    });
    await expect(page.locator('#content')).toContainText(/Your new account has been successfully created|Your Account Has Been Created/);

    await productDetailsPage.navigateToProduct('40');
    await productDetailsPage.addToWishlist();
    await expect(page.locator('.alert-success, .alert')).toContainText(/added iPhone to your wish list/i);

    await wishlistPage.navigate();
    await wishlistPage.removeItem('iPhone');

    await expect(wishlistPage.emptyWishlistMessage).toBeVisible();
  });
});