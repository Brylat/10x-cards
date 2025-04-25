import type { Locator, Page } from "@playwright/test";

/**
 * Page Object Model dla komponentu GenerateFlashcardsView
 * Reprezentuje interakcje z widokiem generowania fiszek
 */
export class GenerateFlashcardsComponent {
  readonly page: Page;
  readonly container: Locator;
  readonly textInputCard: Locator;
  readonly sourceTextInput: Locator;
  readonly characterCounter: Locator;
  readonly generateButton: Locator;
  readonly flashcardsList: Locator;
  readonly flashcardsActions: Locator;
  readonly saveAllFlashcardsButton: Locator;
  readonly saveAcceptedFlashcardsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('[data-test-id="generate-flashcards-view"]');
    this.textInputCard = page.locator('[data-test-id="text-input-card"]');
    this.sourceTextInput = page.locator('[data-test-id="source-text-input"]');
    this.characterCounter = page.locator('[data-test-id="character-counter"]');
    this.generateButton = page.locator('[data-test-id="generate-button"]');
    this.flashcardsList = page.locator('[data-test-id="flashcards-list"]');
    this.flashcardsActions = page.locator('[data-test-id="flashcards-actions"]');
    this.saveAllFlashcardsButton = page.locator('[data-test-id="save-all-flashcards-btn"]');
    this.saveAcceptedFlashcardsButton = page.locator('[data-test-id="save-accepted-flashcards-btn"]');
  }

  /**
   * Wprowadza tekst źródłowy do pola tekstowego
   * @param text - Tekst do wprowadzenia
   */
  async enterSourceText(text: string): Promise<void> {
    await this.sourceTextInput.fill(text);
  }

  /**
   * Klika przycisk generowania fiszek
   */
  async clickGenerateButton(): Promise<void> {
    await this.generateButton.click();
  }

  /**
   * Sprawdza czy przycisk generowania fiszek jest aktywny
   * @returns true jeśli przycisk jest aktywny, false w przeciwnym razie
   */
  async isGenerateButtonEnabled(): Promise<boolean> {
    return await this.generateButton.isEnabled();
  }

  /**
   * Akceptuje fiszkę o podanym indeksie
   * @param index - Indeks fiszki
   */
  async acceptFlashcard(index: number): Promise<void> {
    await this.page.locator(`[data-test-id="accept-button-${index}"]`).click();
  }

  /**
   * Edytuje fiszkę o podanym indeksie
   * @param index - Indeks fiszki
   */
  async editFlashcard(index: number): Promise<void> {
    await this.page.locator(`[data-test-id="edit-button-${index}"]`).click();
  }

  /**
   * Pobiera tekst frontu fiszki o podanym indeksie
   * @param index - Indeks fiszki
   * @returns Tekst frontu fiszki
   */
  async getFlashcardFrontText(index: number): Promise<string> {
    return (await this.page.locator(`[data-test-id="flashcard-front-${index}"]`).textContent()) || "";
  }

  /**
   * Pobiera tekst tyłu fiszki o podanym indeksie
   * @param index - Indeks fiszki
   * @returns Tekst tyłu fiszki
   */
  async getFlashcardBackText(index: number): Promise<string> {
    return (await this.page.locator(`[data-test-id="flashcard-back-${index}"]`).textContent()) || "";
  }

  /**
   * Sprawdza czy fiszka o podanym indeksie istnieje
   * @param index - Indeks fiszki
   * @returns true jeśli fiszka istnieje, false w przeciwnym razie
   */
  async isFlashcardVisible(index: number): Promise<boolean> {
    return await this.page.locator(`[data-test-id="flashcard-item-${index}"]`).isVisible();
  }

  /**
   * Zapisuje wszystkie fiszki
   */
  async saveAllFlashcards(): Promise<void> {
    await this.saveAllFlashcardsButton.click();
  }

  /**
   * Zapisuje zaakceptowane fiszki
   */
  async saveAcceptedFlashcards(): Promise<void> {
    await this.saveAcceptedFlashcardsButton.click();
  }

  /**
   * Sprawdza czy przycisk zapisywania wszystkich fiszek jest aktywny
   * @returns true jeśli przycisk jest aktywny, false w przeciwnym razie
   */
  async isSaveAllFlashcardsButtonEnabled(): Promise<boolean> {
    return await this.saveAllFlashcardsButton.isEnabled();
  }

  /**
   * Sprawdza czy przycisk zapisywania zaakceptowanych fiszek jest aktywny
   * @returns true jeśli przycisk jest aktywny, false w przeciwnym razie
   */
  async isSaveAcceptedFlashcardsButtonEnabled(): Promise<boolean> {
    return await this.saveAcceptedFlashcardsButton.isEnabled();
  }

  /**
   * Pobiera liczbę wygenerowanych fiszek
   * @returns Liczba wygenerowanych fiszek
   */
  async getFlashcardsCount(): Promise<number> {
    // Jeśli lista nie jest widoczna, zwracamy 0
    if (!(await this.flashcardsList.isVisible())) {
      return 0;
    }
    return await this.page.locator('[data-test-id^="flashcard-item-"]').count();
  }

  /**
   * Pobiera tekst licznika znaków
   * @returns Tekst licznika znaków
   */
  async getCharacterCounterText(): Promise<string> {
    return (await this.characterCounter.textContent()) || "";
  }
}
