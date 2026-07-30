class RegisterPage {
  
  constructor(page) {
    this.page = page;

    this.firstNameInput = page.locator('#input-firstname');
    this.lastNameInput = page.locator('#input-lastname');
    this.emailInput = page.locator('#input-email');
    this.telephoneInput = page.locator('#input-telephone');
    this.passwordInput = page.locator('#input-password');
    this.confirmPasswordInput = page.locator('#input-confirm');
    this.newsletterToggle = page.locator('#input-newsletter, input[name="newsletter"][value="1"]');
    this.privacyPolicyToggle = page.locator('input[name="agree"]');
    this.continueBtn = page.locator('input[value="Continue"], input[type="submit"], button[type="submit"]');

    this.successHeader = page.locator('#content h1');
    this.alertWarning = page.locator('.alert-danger, #alert, .alert');
    this.firstNameError = page.locator('#error-firstname, #input-firstname + .text-danger, .form-group:has(#input-firstname) .text-danger');
    this.emailError = page.locator('#error-email, #input-email + .text-danger, .form-group:has(#input-email) .text-danger');
  }

  async navigate() {
    await this.page.goto('index.php?route=account/register', { waitUntil: 'domcontentloaded' });
  }

  async registerUser({ firstName, lastName, email, telephone = '1234567890', password, subscribe = false }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);

    if (await this.telephoneInput.count() > 0) {
      await this.telephoneInput.fill(telephone);
    }

    await this.passwordInput.fill(password);

    if (await this.confirmPasswordInput.count() > 0) {
      await this.confirmPasswordInput.fill(password);
    }

    if (subscribe) {
      await this.newsletterToggle.check({ force: true }).catch(async () => {
        await this.newsletterToggle.click({ force: true });
      });
    }

    await this.privacyPolicyToggle.check({ force: true }).catch(async () => {
      await this.privacyPolicyToggle.click({ force: true });
    });
    await this.continueBtn.click();
  }
}

module.exports = { RegisterPage };