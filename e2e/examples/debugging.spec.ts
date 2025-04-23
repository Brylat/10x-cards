import { test } from "../fixtures/test-base";

/**
 * Ten plik zawiera przykłady pokazujące, jak używać funkcji debugowania w Playwright
 */
test.describe("Przykłady debugowania testów E2E", () => {
  // Ten test używa funkcji trace, która zapisuje szczegółowe informacje o przebiegu testu
  test("Test z trace do analizy z Trace Viewer", async ({ page }) => {
    // Uruchom test z --trace on, aby zapisać trace
    // npx playwright test e2e/examples/debugging.spec.ts --trace on

    // Rozpoczynamy nagrywanie trace
    await page.context().tracing.start({ screenshots: true, snapshots: true });

    // Wykonujemy akcje, które chcemy debugować
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("testuser@example.com");
    await page.getByLabel(/hasło/i).fill("password123");
    await page.getByRole("button", { name: /zaloguj/i }).click();

    // Zatrzymujemy nagrywanie trace i zapisujemy je do pliku
    await page.context().tracing.stop({ path: "./test-results/debug-trace.zip" });

    // Po wykonaniu testu możesz otworzyć trace używając:
    // npx playwright show-trace ./test-results/debug-trace.zip
  });

  // Test używający trybu debug (uruchom z --debug)
  test("Test z trybem debug do interaktywnego debugowania", async ({ page }) => {
    // Uruchom ten test z:
    // npx playwright test e2e/examples/debugging.spec.ts --debug

    // Otworzy się przeglądarka w trybie debug i zatrzyma się na breakpointach
    await page.goto("/login");

    // Zatrzyma się na tym punkcie w trybie debug
    await page.pause();

    await page.getByLabel(/email/i).fill("testuser@example.com");
    await page.getByLabel(/hasło/i).fill("password123");

    // Kolejne zatrzymanie do sprawdzenia stanu
    await page.pause();

    await page.getByRole("button", { name: /zaloguj/i }).click();
  });

  // Test ze zrzutami ekranu do analizy wizualnej
  test("Test ze zrzutami ekranu do analizy wizualnej", async ({ page }) => {
    await page.goto("/login");

    // Zrób zrzut ekranu formularza logowania
    await page.screenshot({ path: "./test-results/login-form.png" });

    await page.getByLabel(/email/i).fill("invalid@example.com");
    await page.getByLabel(/hasło/i).fill("wrongpassword");
    await page.getByRole("button", { name: /zaloguj/i }).click();

    // Poczekaj na pojawienie się komunikatu o błędzie
    const errorMessage = page.locator('[role="alert"]');
    await errorMessage.waitFor({ state: "visible" });

    // Zrób zrzut ekranu z komunikatem o błędzie
    await page.screenshot({ path: "./test-results/login-error.png" });
  });
});
