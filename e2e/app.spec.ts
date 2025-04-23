import { test, expect } from "./fixtures/test-base";

/**
 * Podstawowe testy sprawdzające działanie aplikacji
 */
test.describe("Podstawowa funkcjonalność aplikacji", () => {
  test("Przekierowanie do strony logowania dla niezalogowanego użytkownika", async ({ page }) => {
    // Wejście na stronę główną jako niezalogowany użytkownik
    await page.goto("/");

    // Powinno przekierować na stronę logowania
    await expect(page).toHaveURL(/.*\/login/);
  });

  test.skip("Nawigacja w aplikacji", async ({ page, loginPage }) => {
    // Zaloguj użytkownika
    await loginPage.goto();
    await expect(loginPage.heading).toBeVisible();

    // Testuj przekierowania i nawigację
    await page.getByRole("link", { name: /generate/i }).click();
    await expect(page).toHaveURL(/.*\/generate/);

    // Testuj powrót na stronę główną
    await page.getByText(/10x cards/i).click();
    await expect(page).toHaveURL(/.*\/$/);
  });

  test("Wyświetlanie i ukrywanie elementów UI na podstawie stanu aplikacji", async ({ page }) => {
    await page.goto("/login");

    // Sprawdzenie, czy na stronie logowania widoczne są właściwe elementy
    await expect(page.getByRole("heading", { name: /logowanie/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /zaloguj/i })).toBeVisible();

    // Sprawdzenie, czy elementy, które powinny być ukryte, są ukryte
    const logoutButton = page.getByRole("button", { name: /wyloguj/i });
    await expect(logoutButton).not.toBeVisible();
  });

  test("Responsywność UI - sprawdzenie na różnych rozmiarach ekranu", async ({ page }) => {
    await page.goto("/login");

    // Najpierw na dużym ekranie
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole("button", { name: /zaloguj/i })).toBeVisible();

    // Potem na tablecie
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole("button", { name: /zaloguj/i })).toBeVisible();

    // Na końcu na telefonie
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole("button", { name: /zaloguj/i })).toBeVisible();
  });
});
