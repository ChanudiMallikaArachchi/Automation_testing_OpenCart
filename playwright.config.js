const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({

  workers: process.env.CI ? 1 : 2,
  globalSetup: require.resolve('./config/global-setup.js'),
  use: {

    baseURL: process.env.BASE_URL || 'https://opencart.abstracta.us',

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 20000,
  },

  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'Webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
});
