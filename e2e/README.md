# E2E Testing Guide

Ten katalog zawiera testy end-to-end (E2E) dla aplikacji 10x Cards, zaimplementowane zgodnie z najlepszymi praktykami Playwright.

## Struktura katalogów

```
e2e/
├── fixtures/         # Fixtures i konfiguracja współdzielona przez testy
├── page-objects/     # Implementacje Page Object Model
├── helpers/          # Klasy pomocnicze i konteksty API
├── auth/             # Testy dotyczące uwierzytelniania
├── flashcards/       # Testy dotyczące fiszek
├── examples/         # Przykładowe testy pokazujące różne funkcje Playwright
├── app.spec.ts       # Główne testy aplikacji
└── README.md         # Ta dokumentacja
```

## Kluczowe funkcje

- **Page Object Model (POM)** - Testy korzystają z wzorca POM, który oddziela logikę testowania od struktury stron
- **Fixture System** - Testy wykorzystują system fixture'ów Playwright do współdzielenia konfiguracji
- **API Testing** - Zaimplementowane jest testowanie API obok testów UI
- **Visual Testing** - Dostępne jest porównywanie wizualne dla testów regresyjnych
- **Trace Viewer** - Zapewnia zaawansowane możliwości debugowania

## Uruchamianie testów

```bash
# Uruchomienie wszystkich testów E2E
npm run test:e2e

# Uruchomienie testów z interfejsem użytkownika
npm run test:e2e:ui

# Uruchomienie testów w trybie debug
npm run test:e2e:debug

# Uruchomienie określonego testu
npx playwright test e2e/auth/login.spec.ts

# Uruchomienie testów z generowaniem trace
npx playwright test --trace on

# Przeglądanie trace
npx playwright show-report
```

## Najlepsze praktyki

### Browser Context Isolation

Każdy test otrzymuje nowy kontekst przeglądarki, co zapewnia izolację między testami.

```typescript
test("Test izolacji", async ({ context }) => {
  const page1 = await context.newPage();
  const page2 = await context.newPage();
  // Każda strona jest izolowana od innych
});
```

### Lokatory

Testy używają odpornych lokatorów zamiast selektorów CSS/XPath:

```typescript
// Dobrze: Odporny na zmiany w strukturze UI
page.getByRole("button", { name: "Submit" });
page.getByLabel("Password");

// Unikaj: Kruche selektory
page.locator("#submit-button");
page.locator('div.form > input[type="password"]');
```

### Hooki testowe

Używają hooków `beforeEach` i `afterEach` do konfiguracji i czyszczenia stanu:

```typescript
test.beforeEach(async ({ page }) => {
  // Konfiguracja przed każdym testem
});

test.afterEach(async ({ page }) => {
  // Czyszczenie po każdym teście
});
```

### Asercje

Używaj jawnych asercji i czekaj na elementy:

```typescript
// Dobrze: Czeka na element i wykonuje asercję
await expect(page.getByText("Success")).toBeVisible();

// Unikaj: Może spowodować race condition
expect(await page.getByText("Success").isVisible()).toBe(true);
```

## Testowanie API

Klasa `ApiContext` pozwala na testowanie endpointów API:

```typescript
test("Test API", async ({ apiContext }) => {
  const response = await apiContext.login("user@example.com", "password");
  expect(response.ok()).toBeTruthy();
});
```
