const { test, expect } = require('@playwright/test');
const { ProductDetailsPage } = require('../../Pages/product_details_page');

test.describe('Product Details Module', () => {
  let productPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductDetailsPage(page);
  });

  test('Should load product information correctly', async ({ page }) => {

    await productPage.navigateToProduct('40');

    await expect(productPage.productTitle).toHaveText('iPhone');
    await expect(productPage.productPrice).toBeVisible();
    await expect(productPage.mainImage).toBeVisible();
  });

  test('Should validate mandatory options before adding to cart', async () => {

    await productPage.navigateToProduct('42');

    await productPage.addToCart();

    await expect(productPage.alertDanger).toBeVisible();
  });

  test('Should submit a product review successfully', async () => {
    await productPage.navigateToProduct('40');

    await productPage.submitReview({
      name: 'Tester User',
      review: 'This is an automated test review for product evaluation purposes.',
      rating: 5,
    });

    await expect(productPage.alertSuccess).toContainText('Thank you for your review');
  });

  test('Should show error when submitting an incomplete review', async () => {
    await productPage.navigateToProduct('40');

    await productPage.submitReview({
      name: 'Tester',
      review: 'Too short',
      rating: 4,
    });

    await expect(productPage.alertDanger).toContainText('Warning: Review Text must be between 25 and 1000 characters!');
  });

  test('Should add product to wishlist and show confirmation', async () => {
    await productPage.navigateToProduct('40');

    await productPage.addToWishlist();

    await expect(productPage.alertSuccess).toContainText('You must login or create an account to save iPhone to your wish list!');
  });
});