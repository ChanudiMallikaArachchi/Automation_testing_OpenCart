class LoginPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.locator('#input-email');
    this.passwordInput = page.locator('#input-password');
    this.loginBtn = page.locator('input[value="Login"], input[type="submit"], button[type="submit"]');
    this.forgotPasswordLink = page.locator('a', { hasText: 'Forgotten Password' });

    this.alertWarning = page.locator('.alert-danger, #alert, .alert');
    this.myAccountHeader = page.locator('#content h2', { hasText: 'My Account' });
  }

  async navigate() {
    await this.page.goto('index.php?route=account/login', { waitUntil: 'domcontentloaded' });
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }
}

module.exports = { LoginPage };