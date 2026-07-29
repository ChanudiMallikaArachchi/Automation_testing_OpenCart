class ProductDetailsPage {
    
  constructor(page) {
    this.page = page;

    this.productTitle = page.locator('#content h1');
    this.productPrice = page.locator('#content h2:has-text("$"), #content span.price-new, #content .price-new').first();
    this.brandLink = page.locator('#content ul.list-unstyled').first().locator('a');
    this.quantityInput = page.locator('#input-quantity');
    this.addToCartBtn = page.locator('#button-cart');
    this.addToWishlistBtn = page.locator('button[formaction*="wishlist.add"], button[onclick*="wishlist.add"], button[data-original-title*="Wish List"], button[title*="Wish List"], button:has(.fa-heart)').first();
    this.compareProductBtn = page.locator('button[formaction*="compare.add"], button[onclick*="compare.add"], button[data-original-title*="Compare"], button[title*="Compare"], button:has(.fa-exchange)').first();

    this.mainImage = page.locator('.image.magnific-popup img, .magnific-popup img, ul.thumbnails li img, #content .thumbnail img').first();
    this.additionalThumbnails = page.locator('.image-additional a, ul.thumbnails a');

    this.optionSelect = (label) => page.locator(`label:has-text("${label}") + select`);
    this.optionRadio = (value) => page.locator(`input[type="radio"][value="${value}"]`);
    this.optionCheckbox = (value) => page.locator(`input[type="checkbox"][value="${value}"]`);

    this.reviewTab = page.locator('a[href="#tab-review"], a[href*="tab-review"]');
    this.reviewerNameInput = page.locator('#input-name, input[name="name"]');
    this.reviewTextInput = page.locator('#input-review, #input-text, textarea[name="text"]');
    this.ratingRadio = (rating) => page.locator(`input[name="rating"][value="${rating}"]`);
    this.submitReviewBtn = page.locator('#button-review');
    
    this.alertSuccess = page.locator('.alert-success').first();
    this.alertDanger = page.locator('.alert-danger, .text-danger, .has-error').first();
    this.optionError = (fieldId) => page.locator(`#error-${fieldId}, .text-danger`);
  }

  async navigateToProduct(productPath) {
    await this.page.goto(`index.php?route=product/product&product_id=${productPath}`, { waitUntil: 'domcontentloaded' });
  }

  async setQuantity(qty) {
    await this.quantityInput.fill(String(qty));
  }

  async addToCart() {
    await this.addToCartBtn.click();
  }

  async addToWishlist() {
    await this.addToWishlistBtn.click();
  }

  async addToCompare() {
    await this.compareProductBtn.click();
  }

  async submitReview({ name, review, rating = 5 }) {
    await this.reviewTab.click();
    await this.reviewerNameInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await this.reviewerNameInput.fill(name || '');
    await this.reviewTextInput.fill(review || '');
    const ratingRadio = this.ratingRadio(rating);
    await ratingRadio.check({ force: true }).catch(async () => {
      await ratingRadio.click({ force: true });
    });
    await this.submitReviewBtn.click();
    await this.page.waitForTimeout(1000);
  }
}

module.exports = { ProductDetailsPage };