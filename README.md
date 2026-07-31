# Automation Testing — OpenCart

Playwright-based end-to-end and API tests for OpenCart.

## Overview

This repository contains Playwright tests and configuration used to automate testing for an OpenCart application. It includes example tests and a project structure to add more e2e and API tests.

## Prerequisites

- Node.js (recommended >= 18)
- npm

## Install

1. Install dependencies:

   npm install

2. Install Playwright browsers (required for running tests that use real browsers):

   npx playwright install

## Run tests

- Run the full test suite:

  npx playwright test

- Run tests in a specific folder (e.g., e2e):

  npx playwright test tests/e2e

- Run a single test file:

  npx playwright test tests/example.spec.js

Notes:
- The repository already includes a `playwright.config.js` file and dev dependency `@playwright/test` in package.json.
- You may want to add an npm script to package.json for convenience, for example:

  "scripts": {
    "test": "playwright test"
  }

## Project structure

- tests/ — test files and folders (e2e, API, and example.spec.js)
- Pages/ — (page objects or helpers can go here)
- config/ — configuration files
- playwright.config.js — Playwright configuration

## Contributing

1. Create a branch for your change
2. Run and add tests
3. Open a pull request describing the change

## License

This project uses the ISC license (see package.json).
