class ReturnPage {
  
  constructor(page) {
    this.page = page;

    this.firstNameInput = page.locator('#input-firstname');
    this.lastNameInput = page.locator('#input-lastname');
    this.emailInput = page.locator('#input-email');
    this.telephoneInput = page.locator('#input-telephone');
    this.orderIdInput = page.locator('#input-order-id');
    this.dateOrderedInput = page.locator('#input-date-ordered');
    this.productNameInput = page.locator('#input-product');
    this.productCodeInput = page.locator('#input-model');
    this.quantityInput = page.locator('#input-quantity');

    this.returnReasonRadio = (reasonId) =>
      page.locator(`input[name="return_reason_id"][value="${reasonId}"]`);

    this.openedYesRadio = page.locator('input[name="opened"][value="1"]');
    this.openedNoRadio = page.locator('input[name="opened"][value="0"]');

    this.faultDetailInput = page.locator('#input-comment');
    this.submitBtn = page.locator('input[type="submit"], button[type="submit"], input.btn-primary');

    this.successMessage = page.locator('#content p', {
      hasText: 'Thank you for submitting your return request.',
    });
    this.alertDanger = page.locator('.alert-danger, .alert');
    this.orderIdError = page.locator('#error-order-id, .text-danger').first();
  }

  async navigate() {
    await this.page.goto('index.php?route=account/return/add', { waitUntil: 'domcontentloaded' });
  }

  async fillReturnForm(data) {
    if (data.firstName) await this.firstNameInput.fill(data.firstName);
    if (data.lastName) await this.lastNameInput.fill(data.lastName);
    if (data.email) await this.emailInput.fill(data.email);
    if (data.telephone) await this.telephoneInput.fill(data.telephone);
    if (data.orderId) await this.orderIdInput.fill(data.orderId);
    if (data.productName) await this.productNameInput.fill(data.productName);
    if (data.productCode) await this.productCodeInput.fill(data.productCode);
    if (data.quantity) await this.quantityInput.fill(String(data.quantity));

    if (data.reasonId) await this.returnReasonRadio(data.reasonId).check();
    if (data.isOpened) {
      await this.openedYesRadio.check();
    } else {
      await this.openedNoRadio.check();
    }

    if (data.comment) await this.faultDetailInput.fill(data.comment);
    await this.submitBtn.click();
  }
}

module.exports = { ReturnPage };