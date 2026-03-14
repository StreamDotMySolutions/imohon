import { test, expect } from '@playwright/test';

test.describe('Sidebar Toggle', () => {
  test('login as user@local and test sidebar toggle', async ({ page }) => {
    // Navigate to login
    await page.goto('/login');

    // Wait for login form to appear
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    // Login with user@local
    await page.fill('input[type="email"]', 'user@local');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    // Wait for dashboard to load
    await page.waitForURL(/\/user/, { timeout: 10000 });
    await page.waitForSelector('.navbar-vertical', { timeout: 10000 });

    // Get initial measurements
    const mainPage = page.locator('.page');
    const sidebar = page.locator('.navbar-vertical');
    const pageWrapper = page.locator('.page-wrapper');

    const windowWidth = await page.evaluate(() => window.innerWidth);
    const initialPageWidth = await mainPage.evaluate(el => window.getComputedStyle(el).width);
    const initialSidebarWidth = await sidebar.evaluate(el => window.getComputedStyle(el).width);
    const initialWrapperWidth = await pageWrapper.evaluate(el => window.getComputedStyle(el).width);
    console.log('\n=== EXPANDED STATE ===');
    console.log('Window width:', windowWidth);
    console.log('Total page width:', initialPageWidth);
    console.log('Sidebar width:', initialSidebarWidth);
    console.log('Content width:', initialWrapperWidth);

    // Find and click toggle button
    const toggleButton = page.locator('button[aria-label="Toggle sidebar"]');
    await expect(toggleButton).toBeVisible();
    console.log('Toggle button found and visible');

    // Click to collapse
    await toggleButton.click();
    await page.waitForTimeout(500); // Wait for transition

    const collapsedPageWidth = await mainPage.evaluate(el => window.getComputedStyle(el).width);
    const collapsedSidebarWidth = await sidebar.evaluate(el => window.getComputedStyle(el).width);
    const collapsedWrapperWidth = await pageWrapper.evaluate(el => window.getComputedStyle(el).width);

    console.log('\n=== COLLAPSED STATE ===');
    console.log('Total page width:', collapsedPageWidth);
    console.log('Sidebar width:', collapsedSidebarWidth);
    console.log('Content width:', collapsedWrapperWidth);

    // Check if width actually changed
    if (initialSidebarWidth === collapsedSidebarWidth) {
      console.log('❌ PROBLEM: Sidebar width did not change!');
    } else {
      console.log('✓ Sidebar width changed correctly');
    }

    // Calculate expected content width
    const expectedInitialContent = parseInt(initialPageWidth) - parseInt(initialSidebarWidth);
    const expectedCollapsedContent = parseInt(collapsedPageWidth) - parseInt(collapsedSidebarWidth);

    console.log(`\nCalculated content width should expand by ${expectedCollapsedContent - expectedInitialContent}px`);
    console.log(`Expected initial content: ${expectedInitialContent}px`);
    console.log(`Expected collapsed content: ${expectedCollapsedContent}px`);

    // Check if content should have expanded
    if (expectedCollapsedContent > expectedInitialContent) {
      console.log(`✓ Content should expand when sidebar collapses`);
    } else {
      console.log('❌ PROBLEM: Math shows content should not expand');
    }

    // Check if toggle button is still visible when collapsed
    const toggleButtonVisible = await toggleButton.isVisible();
    if (toggleButtonVisible) {
      console.log('✓ Toggle button remains visible when collapsed');
    } else {
      console.log('❌ PROBLEM: Toggle button not visible when collapsed!');
    }

    // Click to expand again
    await toggleButton.click();
    await page.waitForTimeout(500);

    const expandedSidebarWidth = await sidebar.evaluate(el => window.getComputedStyle(el).width);
    const expandedWrapperWidth = await pageWrapper.evaluate(el => window.getComputedStyle(el).width);

    console.log('\n=== RE-EXPANDED STATE ===');
    console.log('Sidebar width:', expandedSidebarWidth);
    console.log('Content width:', expandedWrapperWidth);

    if (initialSidebarWidth !== expandedSidebarWidth) {
      console.log('❌ PROBLEM: Sidebar did not expand back to original width!');
    } else {
      console.log('✓ Sidebar expanded back correctly');
    }

    if (parseInt(expandedWrapperWidth) < parseInt(initialWrapperWidth)) {
      console.log('❌ PROBLEM: Content did not contract back!');
    } else {
      console.log('✓ Content contracted back correctly');
    }

    // Take screenshot
    await page.screenshot({ path: 'sidebar-test.png', fullPage: true });
    console.log('Screenshot saved: sidebar-test.png');
  });
});
