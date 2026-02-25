import { test, expect } from '@playwright/test';

test('login page UX verification', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.screenshot({ path: 'login_initial.png' });

  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Wait a bit for the loading state or error to appear
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'login_loading_or_error.png' });
});
