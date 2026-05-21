# Final Project — Playwright Test Suite

## Test target
SauceDemo (https://www.saucedemo.com)

## Covered user journey
Login → product selection → cart → checkout

## Test cases
- Valid user can log in and see inventory page
- Locked user cannot log in and sees correct error message
- Wrong password shows error message
- Empty form shows username required error
- Adding a product updates cart badge to 1
- Adding two products updates cart badge to 2
- Removing a product hides the cart badge
- Removing one of two products updates badge to 1
- Cart page shows the added product name
- User can complete checkout and see success message

## Project structure
- `pages/` — Page Object classes (LoginPage, InventoryPage, CartPage, CheckoutPage)
- `tests/` — test specs (login.spec.ts, cart.spec.ts, checkout.spec.ts)
- `test-data/` — credentials and test inputs (users.ts)
- `playwright.config.ts` — configuration (baseURL, testIdAttribute)

## How to run
```bash
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

## Run a specific test file
```bash
npx playwright test tests/login.spec.ts --project=chromium
```

## Notes
- No hard waits (`waitForTimeout`) are used
- Tests use semantic locators (`getByRole`, `getByPlaceholder`, `[data-test=...]`)
- Test data is stored separately in `test-data/users.ts`
- SauceDemo uses `data-test` attributes — configured via `testIdAttribute` in playwright.config.ts

## Known limitations
- This suite covers only the selected user journey
- It does not cover all possible edge cases
- Payment and address validation edge cases are not tested
