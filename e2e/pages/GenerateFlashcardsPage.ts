import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { GenerateFlashcardsComponent } from "../components/GenerateFlashcardsComponent";
import { EditFlashcardModalComponent } from "../components/EditFlashcardModalComponent";

/**
 * Page Object Model dla strony generowania fiszek
 * Integruje komponenty podrzędne
 */
export class GenerateFlashcardsPage extends BasePage {
  readonly generateFlashcards: GenerateFlashcardsComponent;
  readonly editFlashcardModal: EditFlashcardModalComponent;

  constructor(page: Page) {
    super(page);
    this.generateFlashcards = new GenerateFlashcardsComponent(page);
    this.editFlashcardModal = new EditFlashcardModalComponent(page);
  }

  /**
   * Nawiguje do strony generowania fiszek
   */
  async goto(): Promise<void> {
    await super.goto("/generate");
    await this.waitForPageLoad();
  }

  /**
   * Generuje fiszki na podstawie podanego tekstu
   * @param text - Tekst źródłowy
   */
  async generateFlashcardsFromText(text: string): Promise<void> {
    await this.generateFlashcards.enterSourceText(text);
    await this.generateFlashcards.clickGenerateButton();
    // Czekamy na zakończenie generowania
    await this.page.waitForSelector('[data-test-id="flashcards-list"]', { state: "visible", timeout: 30000 });
  }

  /**
   * Akceptuje fiszkę o podanym indeksie, edytuje ją i zapisuje
   * @param index - Indeks fiszki
   * @param newFrontText - Nowy tekst frontu
   * @param newBackText - Nowy tekst tyłu
   */
  async acceptEditAndSaveFlashcard(index: number, newFrontText: string, newBackText: string): Promise<void> {
    await this.generateFlashcards.acceptFlashcard(index);
    await this.generateFlashcards.editFlashcard(index);
    await this.editFlashcardModal.editAndSave(newFrontText, newBackText);
  }

  /**
   * Akceptuje wszystkie fiszki
   */
  async acceptAllFlashcards(): Promise<void> {
    const count = await this.generateFlashcards.getFlashcardsCount();
    for (let i = 0; i < count; i++) {
      await this.generateFlashcards.acceptFlashcard(i);
    }
  }

  /**
   * Zapisuje wszystkie zaakceptowane fiszki
   */
  async saveAcceptedFlashcards(): Promise<void> {
    await this.generateFlashcards.saveAcceptedFlashcards();
    // Czekamy na zakończenie zapisywania i powrót do pustego stanu
    await this.page.waitForSelector('[data-test-id="flashcards-list"]', { state: "detached", timeout: 10000 });
  }

  /**
   * Zapisuje wszystkie fiszki bez względu na to czy są zaakceptowane
   */
  async saveAllFlashcards(): Promise<void> {
    await this.generateFlashcards.saveAllFlashcards();
    // Czekamy na zakończenie zapisywania i powrót do pustego stanu
    await this.page.waitForSelector('[data-test-id="flashcards-list"]', { state: "detached", timeout: 10000 });
  }

  /**
   * Wykonuje pełny proces generowania i zapisywania fiszek
   * @param text - Tekst źródłowy
   * @param acceptAll - Czy zaakceptować wszystkie fiszki
   */
  async completeFlashcardsGeneration(text: string, acceptAll = true): Promise<void> {
    await this.generateFlashcardsFromText(text);

    if (acceptAll) {
      await this.acceptAllFlashcards();
      await this.saveAcceptedFlashcards();
    } else {
      await this.saveAllFlashcards();
    }
  }
}
