# Testy E2E dla aplikacji 10x-cards

Ten katalog zawiera testy end-to-end napisane przy użyciu Playwright.

## Struktura testów

Testy są zorganizowane według wzorca Page Object Model (POM), który zapewnia modularną i łatwą w utrzymaniu strukturę:

```
e2e/
├── components/             # Komponenty POM dla mniejszych elementów UI
│   ├── GenerateFlashcardsComponent.ts
│   └── EditFlashcardModalComponent.ts
├── pages/                  # Modele stron POM
│   ├── BasePage.ts         # Klasa bazowa dla wszystkich stron
│   └── GenerateFlashcardsPage.ts
├── tests/                  # Faktyczne testy e2e
│   └── generate-flashcards.spec.ts
└── fixtures/               # Dane testowe i pomoce testowe
```

## Wzorzec Page Object Model

Struktura Page Object Model (POM) pozwala na:

1. **Izolację logiki testów od elementów UI** - W testach odwołujemy się do metod POM, a nie bezpośrednio do selektorów
2. **Lepszą możliwość ponownego wykorzystania kodu** - Logika interakcji z UI jest napisana raz i używana w wielu testach
3. **Łatwiejsze utrzymanie** - Zmiana w UI wymaga aktualizacji tylko w jednym miejscu

### Warstwy POM

1. **BasePage** - Klasa bazowa dla wszystkich stron, zawierająca wspólne metody
2. **Strony** - Reprezentują całe strony aplikacji, używają komponentów
3. **Komponenty** - Reprezentują powtarzalne części interfejsu

### Atrybuty testowe

Wszystkie selektory używają atrybutów `data-test-id` dodanych do komponentów:

```html
<button data-test-id="save-button">Zapisz</button>
```

W POM odnosimy się do nich poprzez:

```typescript
this.saveButton = page.locator('[data-test-id="save-button"]');
```

## Uruchamianie testów

Aby uruchomić testy e2e:

```
npx playwright test
```

Aby uruchomić konkretny test:

```
npx playwright test generate-flashcards
```

## Dobre praktyki

1. Używaj metod Page Object zamiast bezpośrednich selektorów w testach
2. Dodawaj komentarze do testów wyjaśniające co testujesz
3. Grupuj powiązane testy w bloki describe
4. Upewnij się, że testy są niezależne od siebie
5. Używaj odpowiednich timeoutów i warunków oczekiwania
6. Generuj zrzuty ekranu dla błędów

## Kluczowe funkcje

- **Page Object Model (POM)** - Testy korzystają z wzorca POM, który oddziela logikę testowania od struktury stron
- **Fixture System** - Testy wykorzystują system fixture'ów Playwright do współdzielenia konfiguracji
- **API Testing** - Zaimplementowane jest testowanie API obok testów UI
- **Visual Testing** - Dostępne jest porównywanie wizualne dla testów regresyjnych
- **Trace Viewer** - Zapewnia zaawansowane możliwości debugowania

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
