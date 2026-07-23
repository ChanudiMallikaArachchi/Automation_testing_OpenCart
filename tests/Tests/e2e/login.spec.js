const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../Pages/login_page');
const { RegisterPage } = require('../../Pages/register_page');

test.describe('User Authentication - Login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Should display warning alert for invalid credentials', async () => {
    const invalidEmail = `nonexistent_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
    await loginPage.login(invalidEmail, 'WrongPassword123');

    await expect(loginPage.alertWarning).toContainText(/Warning: (No match for E-Mail Address and\/or Password\.|Your account has exceeded allowed number of login attempts\.)/);
  });

  test('Should register a user and log in with those credentials', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const email = `login_test_${Date.now()}@example.com`;
    const password = 'SecurePassword123!';

    await registerPage.navigate();
    await registerPage.registerUser({
      firstName: 'Test',
      lastName: 'User',
      email: email,
      password: password,
    });

    await page.goto('index.php?route=account/logout');

    await loginPage.navigate();
    await loginPage.login(email, password);

    await expect(loginPage.myAccountHeader).toBeVisible();
  });
});