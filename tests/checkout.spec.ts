import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users } from '../test-data/users';

test.describe('Checkout flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test('User can complete checkout and see success message', async () => {
    await test.step('Add product to cart', async () => {
      await inventoryPage.addProductToCart('sauce-labs-backpack');
      await expect(inventoryPage.cartBadge).toHaveText('1');
    });

    await test.step('Open cart and start checkout', async () => {
      await inventoryPage.openCart();
      await cartPage.checkout();
    });

    await test.step('Fill in checkout info', async () => {
      await checkoutPage.fillInfo('John', 'Smith', '12345');
    });

    await test.step('Verify overview shows the product', async () => {
      await expect(cartPage.getItemName('Sauce Labs Backpack')).toBeVisible();
    });

    await test.step('Complete the order', async () => {
      await checkoutPage.finish();
      await expect(checkoutPage.successMessage).toBeVisible();
      await expect(checkoutPage.successMessage).toContainText('Thank you for your order!');
    });
  });
});
