import { test, expect } from "../fixtures/test-base";
import { faker } from "@faker-js/faker/locale/pl";

// Dane do testów
const validEmail = "user@example.com";
const validPassword = "Password123!";

test.describe("Testy generowania fiszek", () => {
  // Setup - zaloguj użytkownika przed testami
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(validEmail, validPassword);
  });

  test("Strona generowania fiszek powinna się poprawnie załadować", async ({ generatePage }) => {
    await generatePage.goto();

    // Sprawdzamy, czy elementy formularza są widoczne
    await expect(generatePage.topicInput).toBeVisible();
    await expect(generatePage.generateButton).toBeVisible();
  });

  test("Generowanie fiszek z prawidłowym tematem", async ({ generatePage }) => {
    await generatePage.goto();

    // Generujemy losowy temat przy użyciu Faker
    const randomTopic = faker.word.sample(3);

    // Generujemy fiszki
    await generatePage.generateFlashcards(randomTopic);

    // Sprawdzamy, czy fiszki zostały wygenerowane
    const flashcardsVisible = await generatePage.areFlashcardsGenerated();
    expect(flashcardsVisible).toBeTruthy();

    // Sprawdzamy, czy są fiszki
    const flashcardsCount = await generatePage.getFlashcardsCount();
    expect(flashcardsCount).toBeGreaterThan(0);
  });

  test("Próba generowania fiszek z pustym tematem", async ({ generatePage }) => {
    await generatePage.goto();

    // Klikamy przycisk generowania bez podania tematu
    await generatePage.generateFlashcards("");

    // Powinien pojawić się komunikat o błędzie
    const errorMessage = await generatePage.getErrorMessage();
    expect(errorMessage).not.toBeNull();
  });

  test("Zapisywanie wygenerowanych fiszek", async ({ generatePage, homePage }) => {
    await generatePage.goto();

    // Generujemy fiszki
    const randomTopic = faker.word.sample();
    await generatePage.generateFlashcards(randomTopic);

    // Zapisujemy fiszki
    await generatePage.saveFlashcards();

    // Po zapisaniu powinniśmy zostać przekierowani na stronę główną
    await expect(await homePage.isLoggedIn()).toBeTruthy();
  });
});

// Testy API generowania fiszek
test.describe("Testy API generowania fiszek", () => {
  test("Generowanie fiszek przez API", async ({ apiContext }) => {
    // Generujemy losowy temat
    const randomTopic = faker.word.sample();

    // Generujemy fiszki przez API
    const response = await apiContext.generateFlashcards(randomTopic);

    // Sprawdzamy, czy otrzymaliśmy odpowiedź
    expect(response).not.toBeNull();

    // Jeśli response nie jest null, sprawdzamy strukturę danych
    if (response) {
      expect(Array.isArray(response.flashcards)).toBeTruthy();
      expect(response.flashcards.length).toBeGreaterThan(0);

      // Sprawdzamy strukturę pierwszej fiszki
      const firstFlashcard = response.flashcards[0];
      expect(firstFlashcard.front).toBeDefined();
      expect(firstFlashcard.back).toBeDefined();
      expect(firstFlashcard.topic).toBe(randomTopic);
    }
  });
});
