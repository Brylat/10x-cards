import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * Page Object dla strony generowania fiszek
 */
export class GeneratePage extends BasePage {
  readonly topicInput: Locator;
  readonly languageSelect: Locator;
  readonly generateButton: Locator;
  readonly flashcardsContainer: Locator;
  readonly saveButton: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.topicInput = page.getByRole("textbox", { name: /temat|topic/i });
    this.languageSelect = page.getByRole("combobox", { name: /język|language/i });
    this.generateButton = page.getByRole("button", { name: /generuj|generate/i });
    this.flashcardsContainer = page.locator(".flashcards-view");
    this.saveButton = page.getByRole("button", { name: /zapisz|save/i });
    this.loadingIndicator = page.locator(".loading-indicator");
    this.errorMessage = page.locator('[role="alert"]');
  }

  /**
   * Nawiguj do strony generowania
   */
  async goto() {
    await super.goto("/generate");
  }

  /**
   * Generuje fiszki dla podanego tematu
   * @param topic Temat fiszek
   * @param language Język fiszek (opcjonalnie)
   */
  async generateFlashcards(topic: string, language = "Polski") {
    await this.topicInput.fill(topic);

    // Jeśli pole wyboru języka jest widoczne, wybierz język
    if (await this.languageSelect.isVisible()) {
      await this.languageSelect.selectOption(language);
    }

    await this.generateButton.click();

    // Czekaj na zakończenie generowania
    await this.waitForGenerationToComplete();
  }

  /**
   * Czeka na zakończenie generowania fiszek
   */
  async waitForGenerationToComplete() {
    // Najpierw poczekaj, aż pojawi się wskaźnik ładowania
    if (await this.loadingIndicator.isVisible()) {
      // Następnie poczekaj, aż wskaźnik ładowania zniknie
      await this.loadingIndicator.waitFor({ state: "hidden", timeout: 60000 });
    }

    // Poczekaj dodatkową chwilę na renderowanie interfejsu
    await this.page.waitForTimeout(500);
  }

  /**
   * Zapisuje wygenerowane fiszki
   */
  async saveFlashcards() {
    // Upewnij się, że fiszki zostały wygenerowane i przycisk zapisu jest widoczny
    if (await this.saveButton.isVisible()) {
      await this.saveButton.click();
      await this.page.waitForLoadState("networkidle");
    } else {
      throw new Error("Przycisk zapisu nie jest dostępny. Czy fiszki zostały wygenerowane?");
    }
  }

  /**
   * Sprawdza, czy fiszki zostały wygenerowane
   */
  async areFlashcardsGenerated(): Promise<boolean> {
    return await this.flashcardsContainer.isVisible();
  }

  /**
   * Pobiera liczbę wygenerowanych fiszek
   */
  async getFlashcardsCount(): Promise<number> {
    if (await this.flashcardsContainer.isVisible()) {
      return await this.flashcardsContainer.locator(".flashcard").count();
    }
    return 0;
  }

  /**
   * Pobiera komunikat o błędzie (jeśli jest)
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.errorMessage.isVisible()) {
      return this.errorMessage.textContent();
    }
    return null;
  }
}
