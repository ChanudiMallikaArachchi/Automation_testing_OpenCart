const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../../Pages/register_page');

test.describe('Account Registration Flow', () => {
    let registerPage;

    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
        await registerPage.navigate();
    });

    test('Should register a new account successfully', async ({ page }) => {

        const uniqueEmail = `testuser_${Date.now()}@example.com`;

        await registerPage.registerUser({
            firstName: 'John',
            lastName: 'Doe',
            email: uniqueEmail,
            password: 'Password123!',
            subscribe: true,
        });

        // Verify confirmation message
        await expect(page.locator('#content')).toContainText(/Your new account has been successfully created|Your Account Has Been Created/);
    });

    test('Should show field validation errors when submitting empty form', async () => {
        await registerPage.continueBtn.click();

        // Verify inline field validation errors
        await expect(registerPage.firstNameError).toBeVisible();
        await expect(registerPage.alertWarning).toContainText('Warning: You must agree to the Privacy Policy!');
    });
});