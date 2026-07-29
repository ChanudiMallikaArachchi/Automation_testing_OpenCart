class OrderHistoryPage {
  
  constructor(page) {
    this.page = page;

    this.orderRows = page.locator('table.table-bordered tbody tr');
    this.noOrdersMessage = page.locator('#content p').filter({
      hasText: /You have not made any previous orders!|Your shopping cart is empty!/,
    });

    this.viewOrderBtn = (orderId) =>
      this.orderRows
        .filter({ hasText: orderId })
        .locator('a.btn-info, a[data-bs-original-title="View"]');

    this.orderDetailsHeading = page.locator('#content h2', {
      hasText: 'Order Details',
    });
    this.reorderBtn = page.locator('a.btn-primary[href*="reorder"]');
    this.returnBtn = page.locator('a.btn-danger[href*="return/add"]');
  }

  async navigate() {
    await this.page.goto('index.php?route=account/order', { waitUntil: 'domcontentloaded' });
  }

  async getOrderCount() {
    return await this.orderRows.count();
  }

  async viewOrderDetails(orderId) {
    await this.viewOrderBtn(orderId).click();
  }
}

module.exports = { OrderHistoryPage };