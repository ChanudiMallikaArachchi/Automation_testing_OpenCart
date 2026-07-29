const { chromium } = require('@playwright/test');
const fs = require('fs');

module.exports = async (config) => {

    if (!fs.existsSync('.auth')) {
    fs.mkdirSync('.auth');
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const baseURL = config.projects[0]?.use?.baseURL || 'https://opencart.abstracta.us';
  await page.goto(`${baseURL}/index.php?route=account/login`, { waitUntil: 'domcontentloaded' });
  await page.locator('#input-email').fill('testuser_demo@example.com');
  await page.locator('#input-password').fill('Password123!');
  await page.locator('input[type="submit"], button[type="submit"]').first().click();
  await page.waitForTimeout(1000);

  await page.context().storageState({ path: '.auth/user.json' });
  await browser.close();
};