import { test, expect } from '@playwright/test';

test.describe('Cart & Checkout', () => {
  test('should show empty cart message', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('text=Your Cart is Empty')).toBeVisible();
  });

  test('should add product to cart from product page', async ({ page }) => {
    await page.goto('/products');
    // Click "Add to Cart" on the first product
    const addButton = page.locator('text=Add to Cart').first();
    await addButton.click();
    // Cart badge should show count
    const cartLink = page.locator('a[href="/cart"]');
    await expect(cartLink.locator('span')).toContainText('1');
  });

  test('should display cart items and total', async ({ page }) => {
    // First add a product
    await page.goto('/products');
    await page.locator('text=Add to Cart').first().click();
    // Navigate to cart
    await page.goto('/cart');
    // Should show product and total
    await expect(page.locator('text=Total')).toBeVisible();
    await expect(page.locator('text=Proceed to Checkout')).toBeVisible();
  });
});
