import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Sign In');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show register page and navigate to login', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h1')).toContainText('Create Account');
    // Click "Sign in" link
    await page.click('text=Sign in');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    // Should show error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible({
      timeout: 10000,
    });
  });
});
