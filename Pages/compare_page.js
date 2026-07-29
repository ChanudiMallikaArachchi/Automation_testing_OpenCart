class ComparePage {

  constructor(page) {
    this.page = page;

    this.compareTable = page.locator('table.table-bordered');
    this.productNames = page.locator('table.table-bordered tbody tr:first-child td strong, table.table-bordered tbody tr:first-child td a');
    this.emptyCompareMessage = page.locator('#content p').filter({
      hasText: /You have not chosen any products to compare|Your shopping cart is empty/i,
    }).first();

    this.alertSuccess = page.locator('.alert-success');
  }

  async navigate() {
    await this.page.goto('index.php?route=product/compare', { waitUntil: 'domcontentloaded' });
  }

  async getComparedProductNames() {
    return await this.productNames.allTextContents();
  }

  async addProductToCart(productName) {

    const cell = this.page.locator('td', { hasText: productName });
    const row = cell.locator('xpath=..');
    const index = await cell.evaluate((node) => node.cellIndex);

    await this.page
      .locator('table.table-bordered tbody tr:last-child td')
      .nth(index)
      .locator('input[type="button"], button')
      .click();
  }

  async removeProduct(productName) {
    const cell = this.page.locator('td', { hasText: productName });
    const index = await cell.evaluate((node) => node.cellIndex);

    await this.page
      .locator('a.btn-danger, a[href*="remove"]')
      .nth(index - 1)
      .click();
  }
}

module.exports = { ComparePage };