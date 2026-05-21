# Final Project — Test Plan
**Track A: SauceDemo**
**Journey:** login → add products → cart → checkout
**Target:** https://www.saucedemo.com

## Test Cases

1. **Valid user can log in and see inventory page**
   - Login with `standard_user` / `secret_sauce`
   - Verify URL contains `/inventory`

2. **Locked user cannot log in and sees correct error**
   - Login with `locked_out_user` / `secret_sauce`
   - Verify error message: "Epic sadface: Sorry, this user has been locked out."

3. **User can add two products to cart and verify badge count**
   - Add "Sauce Labs Backpack" and "Sauce Labs Bike Light"
   - Verify cart badge shows `2`

4. **User can remove one product and verify cart updates**
   - Add two products, then remove one
   - Verify cart badge updates to `1`

5. **User can complete checkout and see success message**
   - Add a product to cart
   - Go to cart → Checkout → fill in name, last name, zip
   - Verify success message: "Thank you for your order!"
