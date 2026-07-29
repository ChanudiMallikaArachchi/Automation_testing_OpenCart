const { test, expect } = require('@playwright/test');

test.describe('Cart Management via API Context', () => {
  test('Should add item to shopping cart directly using REST endpoint', async ({ request }) => {

    const response = await request.post('/index.php?route=checkout/cart/add', {
      form: {
        product_id: '40',
        quantity: '2',
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.success).toContain('Success: You have added');
  });
});