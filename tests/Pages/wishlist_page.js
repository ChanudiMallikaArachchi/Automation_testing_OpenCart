class WishlistPage {
 
  constructor(page) {
    this.page = page;

    this.wishlistTable = page.locator('table.table-bordered');
    this.rows = page.locator('div.table-responsive tbody tr, table.table-bordered tbody tr, #content table tbody tr');
    this.emptyWishlistMessage = page.locator('#content p', {
      hasText: 'Your wish list is empty.',
    });

    this.alertSuccess = page.locator('.alert-success, .alert').first();
    this.wishlistHeaderLink = page.locator('#wishlist-total');
  }

  async navigate() {
    await this.page.goto('index.php?route=account/wishlist', { waitUntil: 'domcontentloaded' });
  }

  async getItemRow(productName) {
    return this.rows.filter({ hasText: productName });
  }

  async addProductToCart(productName) {
    const row = await this.getItemRow(productName);
    await row.locator('button[formaction*="cart.add"], button[onclick*="cart.add"], button[data-original-title*="Add to Cart"], button:has(.fa-shopping-cart)').click();
  }

  async removeItem(productName) {
    const row = await this.getItemRow(productName);
    await row.locator('a[href*="wishlist.remove"], a[href*="remove="], a.btn-danger, button.btn-danger').click();
  }
}

module.exports = { WishlistPage };