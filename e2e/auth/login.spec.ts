import { test, expect } from "../fixtures/test-base";
import { v4 as uuidv4 } from "uuid";

// Globalne zmienne testowe
const validEmail = "user@example.com";
const validPassword = "Password123!";
const invalidEmail = "invalid@example.com";
const invalidPassword = "wrongpass";

test.describe("Testy logowania", () => {
  // Test setup
  test.beforeEach(async ({ loginPage }) => {
    // Przejdź do strony logowania przed każdym testem
    await loginPage.goto();
  });

  test("Strona logowania powinna się poprawnie załadować", async ({ loginPage }) => {
    // Sprawdź, czy jesteśmy na stronie logowania
    await expect(await loginPage.isLoginPage()).toBeTruthy();

    // Sprawdź czy elementy formularza są widoczne
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test("Logowanie z prawidłowymi danymi", async ({ loginPage }) => {
    await loginPage.login(validEmail, validPassword);

    // Po poprawnym logowaniu nie powinno być komunikatu o błędzie
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeNull();
  });

  test("Logowanie z nieprawidłowymi danymi", async ({ loginPage }) => {
    await loginPage.login(invalidEmail, invalidPassword);

    // Po nieprawidłowym logowaniu powinien pojawić się komunikat o błędzie
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).not.toBeNull();
  });

  test("Nawigacja do strony rejestracji", async ({ loginPage, page }) => {
    await loginPage.navigateToRegister();

    // Po kliknięciu linku rejestracji, powinniśmy znaleźć się na stronie rejestracji
    await expect(page).toHaveURL(/.*\/register/);
  });

  test("Nawigacja do strony resetowania hasła", async ({ loginPage, page }) => {
    await loginPage.navigateToResetPassword();

    // Po kliknięciu linku resetowania hasła, powinniśmy znaleźć się na stronie resetowania hasła
    await expect(page).toHaveURL(/.*\/reset-password/);
  });
});

// Test API logowania
test.describe("Testy API logowania", () => {
  test("Logowanie przez API z poprawnymi danymi", async ({ apiContext }) => {
    const response = await apiContext.login(validEmail, validPassword);

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.user).toBeDefined();
  });

  test("Logowanie przez API z niepoprawnymi danymi", async ({ apiContext }) => {
    const randomEmail = `test-${uuidv4()}@example.com`;
    const response = await apiContext.login(randomEmail, invalidPassword);

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
  });
});
