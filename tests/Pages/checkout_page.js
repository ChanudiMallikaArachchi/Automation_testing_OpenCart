class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
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

    //Billing details
    const billingBtn = this.page.locator('#button-payment-address, #button-guest, #button-account').first();
    await billingBtn.waitFor({ state: 'attached', timeout: 15000 });

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
        await countrySelect.selectOption({ label: details.country });
        await this.page.waitForTimeout(1000);
        const zoneSelect = this.page.locator('#input-payment-zone, #input-zone').first();
        await zoneSelect.selectOption({ label: details.zone }).catch(async () => {
          await zoneSelect.selectOption({ index: 1 });
        });
      }
    }

    await billingBtn.click();
    await this.page.waitForTimeout(1500);

    //Delivery Address
    const shippingAddressBtn = this.page.locator('#button-shipping-address').first();
    if (await shippingAddressBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await shippingAddressBtn.click();
      await this.page.waitForTimeout(1500);
    }

    //Delivery Method
    const shippingMethodBtn = this.page.locator('#button-shipping-method').first();
    await shippingMethodBtn.waitFor({ state: 'visible', timeout: 15000 });
    await shippingMethodBtn.click();
    await this.page.waitForTimeout(1500);

    //Payment Method
    const paymentMethodBtn = this.page.locator('#button-payment-method').first();
    await paymentMethodBtn.waitFor({ state: 'visible', timeout: 15000 });
    const agreeCheckbox = this.page.locator('input[name="agree"]').first();
    if ((await agreeCheckbox.count()) > 0) {
      await agreeCheckbox.check({ force: true }).catch(() => {});
    }
    await paymentMethodBtn.click();
    await this.page.waitForTimeout(1500);

    //Confirm Order
    const confirmBtn = this.page.locator('#button-confirm').first();
    await confirmBtn.waitFor({ state: 'visible', timeout: 15000 });
    await confirmBtn.click();

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
