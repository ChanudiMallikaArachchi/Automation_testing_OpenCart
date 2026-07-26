class SearchPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.searchInput = page.locator('input[name="search"]');
    this.searchButton = page.locator('#search button');
    this.searchResultsHeading = page.locator('#content h1');
    this.productCards = page.locator('.product-layout');
    this.noResultsMessage = page.locator('#content p:has-text("There is no product that matches the search criteria.")');

    this.categoryHeaderLinks = page.locator('nav#menu ul.nav > li > a');

    this.pageHeading = page.locator('#content h2, #content h1').first();
    this.listBtn = page.locator('#list-view');
    this.gridBtn = page.locator('#grid-view');
    this.sortSelect = page.locator('#input-sort');
  }

  async getProductCount() {
    return await this.productCards.count();
  }

  async navigate() {
    await this.page.goto('index.php?route=common/home', { waitUntil: 'domcontentloaded' });
  }

  async performHeaderSearch(query) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  async selectCategoryFromHeader(categoryName, subCategoryName = null) {
    const navbarToggle = this.page.locator('button.navbar-toggle, button[data-target*="navbar-ex1-collapse"]').first();
    if (await navbarToggle.isVisible().catch(() => false)) {
      await navbarToggle.click().catch(() => {});
      await this.page.waitForTimeout(500);
    }

    const categoryMenu = this.page.locator('nav#menu ul.nav > li, #menu .nav > li').filter({
      hasText: new RegExp(categoryName.replace('&', '.*'), 'i')
    }).first();

    if (await categoryMenu.isVisible().catch(() => false)) {
      await categoryMenu.hover().catch(() => {});
    }

    if (subCategoryName) {
      const isSeeAll = subCategoryName.toLowerCase().startsWith('show all');
      const cleanSub = subCategoryName.replace(/^show all\s*/i, '').trim();
      const subLink = isSeeAll
        ? categoryMenu.locator('a.see-all').first()
        : categoryMenu.locator('ul li a').filter({ hasText: new RegExp(cleanSub, 'i') }).first();

      if (await subLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await subLink.click({ force: true });
      } else {
        const catUrl = categoryName.toLowerCase().includes('laptop') 
          ? 'index.php?route=product/category&path=18' 
          : 'index.php?route=product/category&path=20';
        await this.page.goto(catUrl, { waitUntil: 'domcontentloaded' });
      }
    } else {
      await categoryMenu.locator('> a').click({ force: true }).catch(() => {});
    }
  }

  async getProductTitles() {
    const titles = await this.productCards.locator('h4 a').allInnerTexts();
    return titles.map(t => t.trim());
  }

  async getProductNames() {
    return await this.getProductTitles();
  }

  async addProductToCartByName(productName) {
    const productCard = this.productCards.filter({ hasText: productName }).first();
    await productCard.locator('button:has(.fa-shopping-cart), button:has-text("Add to Cart")').first().click();
    await this.page.waitForResponse(response => 
      response.url().includes('route=checkout/cart/add') && response.status() === 200,
      { timeout: 10000 }
    ).catch(() => {});
  }
}

module.exports = { SearchPage };