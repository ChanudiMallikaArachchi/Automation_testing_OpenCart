class CheckoutPage {

  constructor(page) {
    this.page = page;

    this.continueBillingBtn = page.locator('#button-payment-address, #button-guest');
    this.continueShippingAddressBtn = page.locator('#button-shipping-address');
    this.continueShippingMethodBtn = page.locator('#button-shipping-method');
    this.continuePaymentMethodBtn = page.locator('#button-payment-method');
    this.agreeTermsCheckbox = page.locator('input[name="agree"]');
    this.confirmOrderBtn = page.locator('#button-confirm');

    this.successHeading = page.locator('#content h1');
  }

  async fillGuestShippingAddress(details) {
    await this.completeCheckout(details);
  }

  async completeCheckout(details) {
    if (!this.page.url().includes('checkout/checkout')) {
      await this.page.goto('index.php?route=checkout/checkout', { waitUntil: 'domcontentloaded' });
    }

    const billingBtn = this.page.locator('#button-payment-address, #button-guest, #button-account').first();
    await billingBtn.waitFor({ state: 'attached', timeout: 15000 });

    const newAddressRadio = this.page.locator('input[name="payment_address"][value="new"]').first();
    if (await newAddressRadio.isVisible().catch(() => false)) {
      await newAddressRadio.check({ force: true }).catch(() => {});
      await this.page.waitForTimeout(500);
    }

    const firstNameInput = this.page.locator('#input-payment-firstname, #input-firstname').first();
    await firstNameInput.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});

    if (await firstNameInput.isVisible().catch(() => false)) {
      await firstNameInput.fill(details.firstName);
      await this.page.locator('#input-payment-lastname, #input-lastname').first().fill(details.lastName);
      await this.page.locator('#input-payment-address-1, #input-shipping-address-1, #input-address-1').first().fill(details.address);
      await this.page.locator('#input-payment-city, #input-city').first().fill(details.city);
      await this.page.locator('#input-payment-postcode, #input-postcode').first().fill(details.postcode);

      const countrySelect = this.page.locator('#input-payment-country, #input-country').first();
      if (await countrySelect.isVisible()) {
        await countrySelect.selectOption({ label: details.country }).catch(() => {});
        await this.page.waitForTimeout(1000);
        const zoneSelect = this.page.locator('#input-payment-zone, #input-zone').first();
        await this.page.waitForFunction(
          (sel) => sel && sel.options.length > 1,
          await zoneSelect.elementHandle()
        ).catch(() => {});
        await zoneSelect.selectOption({ index: 1 }).catch(() => {});
      }
    }

    await billingBtn.click();
    await this.page.waitForTimeout(1500);

    const shippingAddressBtn = this.page.locator('#button-shipping-address').first();
    if (await shippingAddressBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await shippingAddressBtn.click().catch(() => {});
      await this.page.waitForTimeout(1000);
    }

    const shippingMethodHeader = this.page.locator('a[href="#collapse-shipping-method"], a[href*="shipping-method"]').first();
    if (await shippingMethodHeader.isVisible({ timeout: 3000 }).catch(() => false)) {
      await shippingMethodHeader.click().catch(() => {});
      await this.page.waitForTimeout(500);
    }
    await this.page.evaluate(() => {
      const btn = document.querySelector('#button-shipping-method');
      if (btn) btn.click();
    }).catch(() => {});
    await this.page.waitForTimeout(1500);

    const paymentMethodHeader = this.page.locator('a[href="#collapse-payment-method"], a[href*="payment-method"]').first();
    if (await paymentMethodHeader.isVisible({ timeout: 3000 }).catch(() => false)) {
      await paymentMethodHeader.click().catch(() => {});
      await this.page.waitForTimeout(500);
    }
    const agreeCheckbox = this.page.locator('input[name="agree"]').first();
    if (await agreeCheckbox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await agreeCheckbox.check({ force: true }).catch(() => {});
      await this.page.waitForTimeout(500);
    }
    await this.page.evaluate(() => {
      const btn = document.querySelector('#button-payment-method');
      if (btn) btn.click();
    }).catch(() => {});
    await this.page.waitForTimeout(1500);

    const confirmHeader = this.page.locator('a[href="#collapse-checkout-confirm"], a[href*="confirm"]').first();
    if (await confirmHeader.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmHeader.click().catch(() => {});
      await this.page.waitForTimeout(500);
    }
    await this.page.evaluate(() => {
      const btn = document.querySelector('#button-confirm, input[value="Confirm Order"]');
      if (btn) btn.click();
    }).catch(() => {});

    await this.page.waitForURL(/checkout\/success/, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
  }

  async confirmOrder() {
    const confirmBtn = this.page.locator('#button-confirm').first();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
    }
  }
}

module.exports = { CheckoutPage };
