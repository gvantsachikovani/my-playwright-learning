import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Valid credentials redirect to inventory page', async ({ page }) => {
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory/);
  });

  test('Locked out user sees error message', async ({ page }) => {
    await page.locator('#user-name').fill('locked_out_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('Wrong password shows error message', async ({ page }) => {
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('wrong_password');
    await page.locator('#login-button').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Empty form shows username required error', async ({ page }) => {
    await page.locator('#login-button').click();

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username is required'
    );
  });
});
