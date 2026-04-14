import { test, expect } from '@playwright/test';

test.describe('Product Catalogue', () => {
  test('should display products on the products page', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('h1')).toContainText('Products');
    // Wait for product cards to load
    const cards = page.locator('[class*="rounded-lg"][class*="shadow"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to product detail page', async ({ page }) => {
    await page.goto('/products');
    // Click the first product link
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await firstProduct.click();
    // Should show product detail with Add to Cart button
    await expect(page.locator('text=Add to Cart')).toBeVisible();
  });

  test('should search for products', async ({ page }) => {
    await page.goto('/products');
    await page.fill('input[name="search"]', 'keyboard');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/search=keyboard/);
  });
});
