import { test, expect } from "@playwright/test";
import { GenerateFlashcardsPage } from "../pages/GenerateFlashcardsPage";

// Przykładowy długi tekst używany do generowania fiszek
const SAMPLE_TEXT = `
W informatyce i programowaniu, zarządzanie pamięcią dotyczy procesu kontrolowania i koordynowania pamięci komputerowej, przydzielania porcji pamięci do programów w momencie ich żądania i zwalniania jej kiedy nie jest już potrzebna.

Zarządzanie pamięcią jest kluczowym aspektem każdego systemu komputerowego, który obsługuje wielozadaniowość. Głównym celem zarządzania pamięcią jest zapewnienie efektywnego działania programów poprzez:
1. Utrzymywanie śledzenia tego, które części pamięci są używane,
2. Przydzielanie pamięci do procesów kiedy jej potrzebują,
3. Zwalnianie pamięci kiedy proces został zakończony,
4. Zarządzanie wymianą danych między pamięcią RAM a dyskiem, jeśli nie ma wystarczającej ilości RAM (stronicowanie i segmentacja).

W różnych językach programowania, zarządzanie pamięcią jest realizowane na różne sposoby. W językach takich jak C czy C++, programista musi samodzielnie zarządzać alokacją i zwalnianiem pamięci (zarządzanie manualne), co może prowadzić do błędów takich jak wycieki pamięci lub problemy z dangling pointers. Z drugiej strony, języki takie jak Java, Python czy JavaScript posiadają systemy automatycznego zarządzania pamięcią zwane garbage collectors, które automatycznie identyfikują i zwalniają nieużywaną pamięć.

W kontekście systemów operacyjnych, zarządzanie pamięcią obejmuje obsługę pamięci wirtualnej, która tworzy iluzję większej pamięci niż fizycznie dostępna RAM, poprzez używanie przestrzeni na dysku twardym jako rozszerzenia pamięci RAM. Stronicowanie pamięci wirtualnej polega na podzieleniu pamięci na małe stałej wielkości kawałki zwane stronami, które można przesuwać pomiędzy pamięcią główną a dyskiem.
`.repeat(2); // Powtarzamy tekst, aby przekroczyć minimalną długość

test.describe("Generowanie fiszek", () => {
  let page: GenerateFlashcardsPage;

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext();
    const pageInstance = await context.newPage();

    page = new GenerateFlashcardsPage(pageInstance);
    await page.goto();
  });

  test("powinno umożliwiać generowanie fiszek z tekstu", async () => {
    // Wprowadzamy tekst źródłowy
    await page.generateFlashcards.enterSourceText(SAMPLE_TEXT);

    // Sprawdzamy czy przycisk generowania jest aktywny
    expect(await page.generateFlashcards.isGenerateButtonEnabled()).toBeTruthy();

    // Generujemy fiszki
    await page.generateFlashcards.clickGenerateButton();

    // Sprawdzamy czy lista fiszek została wyświetlona
    await page.page.waitForSelector('[data-test-id="flashcards-list"]', { state: "visible" });

    // Sprawdzamy czy wygenerowano przynajmniej jedną fiszkę
    const flashcardsCount = await page.generateFlashcards.getFlashcardsCount();
    expect(flashcardsCount).toBeGreaterThan(0);
  });

  test("powinno umożliwiać akceptację i edycję fiszek", async () => {
    // Generujemy fiszki
    await page.generateFlashcardsFromText(SAMPLE_TEXT);

    // Akceptujemy pierwszą fiszkę
    await page.generateFlashcards.acceptFlashcard(0);

    // Edytujemy pierwszą fiszkę
    await page.generateFlashcards.editFlashcard(0);

    // Sprawdzamy czy modal edycji jest widoczny
    expect(await page.editFlashcardModal.isVisible()).toBeTruthy();

    // Edytujemy treść fiszki
    const newFrontText = "Nowa treść frontu";
    const newBackText = "Nowa treść tyłu";
    await page.editFlashcardModal.enterFrontText(newFrontText);
    await page.editFlashcardModal.enterBackText(newBackText);

    // Zapisujemy zmiany
    await page.editFlashcardModal.clickSaveButton();

    // Sprawdzamy czy modal został zamknięty
    expect(await page.editFlashcardModal.isVisible()).toBeFalsy();

    // Sprawdzamy czy treść fiszki została zaktualizowana
    expect(await page.generateFlashcards.getFlashcardFrontText(0)).toContain(newFrontText);
    expect(await page.generateFlashcards.getFlashcardBackText(0)).toContain(newBackText);
  });

  test("powinno umożliwiać zapisanie zaakceptowanych fiszek", async () => {
    // Generujemy fiszki
    await page.generateFlashcardsFromText(SAMPLE_TEXT);

    // Akceptujemy wszystkie fiszki
    await page.acceptAllFlashcards();

    // Sprawdzamy czy przycisk zapisywania jest aktywny
    expect(await page.generateFlashcards.isSaveAcceptedFlashcardsButtonEnabled()).toBeTruthy();

    // Zapisujemy fiszki
    await page.saveAcceptedFlashcards();

    // Sprawdzamy czy wróciliśmy do pustego stanu (lista fiszek zniknęła)
    const flashcardsCount = await page.generateFlashcards.getFlashcardsCount();
    expect(flashcardsCount).toBe(0);
  });

  test("powinno umożliwiać zapisanie wszystkich fiszek", async () => {
    // Generujemy fiszki
    await page.generateFlashcardsFromText(SAMPLE_TEXT);

    // Sprawdzamy czy przycisk zapisywania wszystkich jest aktywny
    expect(await page.generateFlashcards.isSaveAllFlashcardsButtonEnabled()).toBeTruthy();

    // Zapisujemy wszystkie fiszki
    await page.saveAllFlashcards();

    // Sprawdzamy czy wróciliśmy do pustego stanu (lista fiszek zniknęła)
    const flashcardsCount = await page.generateFlashcards.getFlashcardsCount();
    expect(flashcardsCount).toBe(0);
  });

  test("powinno kończyć proces generowania fiszek od początku do końca", async () => {
    // Wykonujemy pełny proces generowania i zapisywania fiszek
    await page.completeFlashcardsGeneration(SAMPLE_TEXT);

    // Sprawdzamy czy wróciliśmy do pustego stanu (pole tekstowe jest puste)
    const inputValue = await page.generateFlashcards.sourceTextInput.inputValue();
    expect(inputValue).toBe("");
  });
});
