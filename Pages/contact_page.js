class ContactPage {
  
  constructor(page) {
    this.page = page;

    this.nameInput = page.locator('#input-name');
    this.emailInput = page.locator('#input-email');
    this.enquiryInput = page.locator('#input-enquiry');
    this.submitBtn = page.locator('input[type="submit"], button[type="submit"], input.btn-primary');

    this.successHeader = page.locator('#content h1, #content p');
    this.enquiryError = page.locator('#error-enquiry, .text-danger');
  }

  async navigate() {
    await this.page.goto('index.php?route=information/contact', { waitUntil: 'domcontentloaded' });
  }

  async submitEnquiry(name, email, enquiry) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.enquiryInput.fill(enquiry);
    await this.submitBtn.click();
  }
}

module.exports = { ContactPage };