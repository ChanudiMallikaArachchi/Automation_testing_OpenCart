class CartPage {

  constructor(page) {
    this.page = page;

    this.cartTableRows = page.locator('.table-responsive table tbody tr');
    this.quantityInputs = page.locator('.table-responsive input[name*="quantity"]');
    this.updateButtons = page.locator('button[data-original-title="Update"], button:has(.fa-refresh), button:has-text("Refresh")');
    this.removeButtons = page.locator('button[data-original-title="Remove"], button:has(.fa-times-circle), button.btn-danger');

    this.alertSuccess = page.locator('.alert-success');
    this.alertDanger = page.locator('.alert-danger');

    this.couponAccordion = page.locator('a[href="#collapse-coupon"], a:has-text("Use Coupon Code")');
    this.couponInput = page.locator('input[name="coupon"], #input-coupon');
    this.applyCouponBtn = page.locator('#button-coupon');

    this.checkoutBtn = page.locator('a.btn-primary:has-text("Checkout"), a[href*="checkout/checkout"]').last();
    this.emptyCartMessage = page.locator('#content p').filter({ hasText: 'Your shopping cart is empty!' }).first();
  }

  async navigate() {
    await this.page.goto('index.php?route=checkout/cart', { waitUntil: 'domcontentloaded' });
  }

  getRow(itemIdentifier = 0) {
    if (typeof itemIdentifier === 'number') {
      return this.cartTableRows.nth(itemIdentifier);
    }
    return this.cartTableRows.filter({ hasText: itemIdentifier }).first();
  }

  async updateQuantity(itemIdentifier = 0, quantity = 1) {
    const row = this.getRow(itemIdentifier);
    const qtyInput = row.locator('input[name*="quantity"]').first();
    await qtyInput.fill(String(quantity));

    const updateBtn = row.locator('button[type="submit"], button:has(.fa-refresh), button[data-original-title="Update"]').first();
    await updateBtn.click();
    await this.page.waitForTimeout(1500);
  }

  async applyCoupon(couponCode) {
    const accordion = this.page.locator('a[href="#collapse-coupon"], a:has-text("Use Coupon Code")');
    if (await accordion.isVisible().catch(() => false)) {
      await accordion.click();
      await this.page.waitForTimeout(500);
    }
    await this.couponInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await this.couponInput.fill(couponCode);
    await this.applyCouponBtn.click();
    await this.page.waitForTimeout(1000);
  }

  async removeItem(itemIdentifier = 0) {
    const row = this.getRow(itemIdentifier);
    const removeBtn = row.locator('button[data-original-title="Remove"], button:has(.fa-times-circle), button.btn-danger, button[onclick*="cart.remove"]').first();
    await removeBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await removeBtn.click().catch(async () => {
      await removeBtn.click({ force: true });
    });
    await this.page.waitForTimeout(2000);
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
  }

  async getCartItemsCount() {
    return await this.cartTableRows.count();
  }
}

module.exports = { CartPage };