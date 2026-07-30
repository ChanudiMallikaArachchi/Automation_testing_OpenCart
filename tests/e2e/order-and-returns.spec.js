const { test, expect } = require('@playwright/test');
const { OrderHistoryPage } = require('../../Pages/order_history_page');
const { ReturnPage } = require('../../Pages/return_page');
const { RegisterPage } = require('../../Pages/register_page');

test.describe('Order History & Return Workflows', () => {
  let orderHistoryPage;
  let returnPage;

  test.beforeEach(async ({ page }) => {
    orderHistoryPage = new OrderHistoryPage(page);
    returnPage = new ReturnPage(page);
  });

  test('Should display empty message for a newly registered user with no order history', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const email = `new_buyer_${Date.now()}@example.com`;

    await registerPage.navigate();
    await registerPage.registerUser({
      firstName: 'Fresh',
      lastName: 'User',
      email: email,
      password: 'Password123!',
    });
    await expect(page.locator('#content')).toContainText(/Your new account has been successfully created|Your Account Has Been Created/);

    await orderHistoryPage.navigate();
    await expect(orderHistoryPage.noOrdersMessage).toBeVisible();
    expect(await orderHistoryPage.getOrderCount()).toBe(0);
  });

  test('Should submit a product return request successfully', async () => {
    await returnPage.navigate();

    await returnPage.fillReturnForm({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      telephone: '1234567890',
      orderId: '10045',
      productName: 'iPhone',
      productCode: 'product 11',
      quantity: 1,
      reasonId: '1',
      isOpened: true,
      comment: 'Screen is cracked upon opening the package.',
    });

    await expect(returnPage.successMessage).toBeVisible();
  });

  test('Should show error when mandatory return fields are missing', async () => {
    await returnPage.navigate();

    await returnPage.submitBtn.click();

    await expect(returnPage.orderIdError).toBeVisible();
  });
});