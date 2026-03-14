import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Imohon|Login/i);
  });

  test('should have navbar elements', async ({ page }) => {
    await page.goto('/');
    // This will redirect to login if not authenticated
    const navbar = page.locator('.navbar-vertical');
    await expect(navbar).toBeVisible();
  });
});
