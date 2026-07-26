const { test, expect } = require('@playwright/test');
const { ContactPage } = require('../../Pages/contact_page');

test.describe('Contact Us Module', () => {
  let contactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.navigate();
  });

  test('Should submit customer enquiry successfully', async () => {
    await contactPage.submitEnquiry(
      'Jane Smith',
      'jane.smith@example.com',
      'Hello, I would like to inquire about bulk ordering discounts for your products.'
    );

    await expect(contactPage.successHeader).toContainText('Contact Us');
  });

  test('Should show error when enquiry text is under character limit', async () => {

    await contactPage.submitEnquiry('Jane Smith', 'jane.smith@example.com', 'Short');

    await expect(contactPage.enquiryError).toContainText(
      'Enquiry must be between 10 and 3000 characters!'
    );
  });
});