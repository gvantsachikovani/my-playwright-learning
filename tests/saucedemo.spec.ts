import { test, expect } from '@playwright/test';

test.describe('SauceDemo', () => {
  // ===================================================================
  // Login-flow tests — these MUST start unauthenticated, so this group
  // only navigates to the login page in beforeEach.
  // ===================================================================
  test.describe('Login flow', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('https://www.saucedemo.com/');
    });

    // ---------- Task 1: Login (happy path) ----------
    test('Task 1 — Login with valid credentials redirects to inventory', async ({ page }) => {
      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      await expect(
        page,
        'User should land on the inventory page after a successful login'
      ).toHaveURL(/inventory/);
    });

    // ---------- Task 2: Negative login ----------
    test('Task 2 — Wrong password shows error message', async ({ page }) => {
      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('wrong_password');
      await page.locator('#login-button').click();

      await expect(
        page.locator('[data-test="error"]'),
        'Error message should appear when login credentials are invalid'
      ).toBeVisible();
    });

    // ---------- Task 5: Empty form validation ----------
    test('Task 5 — Empty login shows username-required error', async ({ page }) => {
      await page.locator('#login-button').click();

      await expect(
        page.locator('[data-test="error"]'),
        'Error banner should appear when both fields are empty'
      ).toBeVisible();
      await expect(
        page.locator('[data-test="error"]'),
        'Error text should specifically call out the missing username'
      ).toContainText('Username is required');
    });

    test('Task 5 (bonus) — Only username filled shows password-required error', async ({ page }) => {
      await page.locator('#user-name').fill('standard_user');
      await page.locator('#login-button').click();

      await expect(
        page.locator('[data-test="error"]'),
        'Error banner should appear when password is missing'
      ).toBeVisible();
      await expect(
        page.locator('[data-test="error"]'),
        'Error text should specifically call out the missing password'
      ).toContainText('Password is required');
    });

    test('Task 5 (bonus) — Only password filled shows username-required error', async ({ page }) => {
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      await expect(
        page.locator('[data-test="error"]'),
        'Error banner should appear when username is missing'
      ).toBeVisible();
      await expect(
        page.locator('[data-test="error"]'),
        'Error text should specifically call out the missing username'
      ).toContainText('Username is required');
    });
  });

  // ===================================================================
  // Authenticated tests — these all start with a logged-in user, so
  // beforeEach handles the full login flow once and we skip straight
  // to the actual behavior under test.
  // ===================================================================
  test.describe('Authenticated user', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('https://www.saucedemo.com/');
      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();
      // Sanity check: don't continue if login somehow didn't land us on inventory.
      await expect(
        page,
        'beforeEach should leave user on the inventory page'
      ).toHaveURL(/inventory/);
    });

    // ---------- Task 3: Add product to cart ----------
    test('Task 3 — Adding a product updates the cart badge to 1', async ({ page }) => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

      await expect(
        page.locator('.shopping_cart_badge'),
        'Cart badge should show 1 item after adding a single product'
      ).toHaveText('1');
    });

    // ---------- Task 4: Remove product from cart ----------
    test('Task 4 — Removing a product hides the cart badge', async ({ page }) => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

      await expect(
        page.locator('.shopping_cart_badge'),
        'Cart badge should disappear once the cart is empty'
      ).not.toBeVisible();
    });

    // ---------- Task 7: Edge case / bug-hunting ----------
    test('Task 7 — Rapid clicks on Add to Cart still result in only one item', async ({ page }) => {
      const addButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');

      // After the first click the button swaps to "Remove", so a second
      // rapid click hits a different element entirely. This test documents
      // that the UI prevents double-add by design.
      await addButton.click();

      await expect(
        page.locator('.shopping_cart_badge'),
        'Cart badge must remain at 1 — UI should not allow duplicate adds'
      ).toHaveText('1');

      await expect(
        addButton,
        'The Add-to-Cart button should be replaced after a successful add'
      ).toHaveCount(0);
      await expect(
        page.locator('[data-test="remove-sauce-labs-backpack"]'),
        'A Remove button should appear in place of Add-to-Cart'
      ).toBeVisible();
    });

    test('Task 7 — Fast add/remove cycles leave cart empty', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
      }

      await expect(
        page.locator('.shopping_cart_badge'),
        'Cart badge should not be visible after equal add/remove cycles'
      ).not.toBeVisible();
    });
  });

  // ---------- Task 6: Stability ----------
  // Task 6 is a command, not a test. Run from terminal:
  //   npx playwright test tests/saucedemo.spec.ts --repeat-each=3
  // All tests above use stable selectors (#id, [data-test=...], .class) and
  // Playwright auto-waiting assertions — no waitForTimeout, no sleeps.
});