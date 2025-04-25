import type { Locator, Page } from "@playwright/test";

/**
 * Page Object Model dla komponentu EditFlashcardModal
 * Reprezentuje interakcje z modalem edycji fiszek
 */
export class EditFlashcardModalComponent {
  readonly page: Page;
  readonly dialog: Locator;
  readonly content: Locator;
  readonly frontTextarea: Locator;
  readonly backTextarea: Locator;
  readonly frontError: Locator;
  readonly backError: Locator;
  readonly frontCharCount: Locator;
  readonly backCharCount: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('[data-test-id="edit-flashcard-dialog"]');
    this.content = page.locator('[data-test-id="edit-flashcard-content"]');
    this.frontTextarea = page.locator('[data-test-id="edit-front-textarea"]');
    this.backTextarea = page.locator('[data-test-id="edit-back-textarea"]');
    this.frontError = page.locator('[data-test-id="front-error"]');
    this.backError = page.locator('[data-test-id="back-error"]');
    this.frontCharCount = page.locator('[data-test-id="front-char-count"]');
    this.backCharCount = page.locator('[data-test-id="back-char-count"]');
    this.cancelButton = page.locator('[data-test-id="cancel-edit-button"]');
    this.saveButton = page.locator('[data-test-id="save-edit-button"]');
  }

  /**
   * Sprawdza czy modal edycji jest widoczny
   * @returns true jeśli modal jest widoczny, false w przeciwnym razie
   */
  async isVisible(): Promise<boolean> {
    return await this.dialog.isVisible();
  }

  /**
   * Wprowadza tekst do pola frontu fiszki
   * @param text - Tekst do wprowadzenia
   */
  async enterFrontText(text: string): Promise<void> {
    await this.frontTextarea.fill(text);
  }

  /**
   * Wprowadza tekst do pola tyłu fiszki
   * @param text - Tekst do wprowadzenia
   */
  async enterBackText(text: string): Promise<void> {
    await this.backTextarea.fill(text);
  }

  /**
   * Pobiera tekst z pola frontu fiszki
   * @returns Tekst z pola frontu
   */
  async getFrontText(): Promise<string> {
    return await this.frontTextarea.inputValue();
  }

  /**
   * Pobiera tekst z pola tyłu fiszki
   * @returns Tekst z pola tyłu
   */
  async getBackText(): Promise<string> {
    return await this.backTextarea.inputValue();
  }

  /**
   * Sprawdza czy widoczny jest błąd dla pola frontu
   * @returns true jeśli błąd jest widoczny, false w przeciwnym razie
   */
  async isFrontErrorVisible(): Promise<boolean> {
    return await this.frontError.isVisible();
  }

  /**
   * Sprawdza czy widoczny jest błąd dla pola tyłu
   * @returns true jeśli błąd jest widoczny, false w przeciwnym razie
   */
  async isBackErrorVisible(): Promise<boolean> {
    return await this.backError.isVisible();
  }

  /**
   * Pobiera tekst błędu dla pola frontu
   * @returns Tekst błędu dla pola frontu
   */
  async getFrontErrorText(): Promise<string> {
    return (await this.frontError.textContent()) || "";
  }

  /**
   * Pobiera tekst błędu dla pola tyłu
   * @returns Tekst błędu dla pola tyłu
   */
  async getBackErrorText(): Promise<string> {
    return (await this.backError.textContent()) || "";
  }

  /**
   * Pobiera tekst licznika znaków dla pola frontu
   * @returns Tekst licznika znaków dla pola frontu
   */
  async getFrontCharCountText(): Promise<string> {
    return (await this.frontCharCount.textContent()) || "";
  }

  /**
   * Pobiera tekst licznika znaków dla pola tyłu
   * @returns Tekst licznika znaków dla pola tyłu
   */
  async getBackCharCountText(): Promise<string> {
    return (await this.backCharCount.textContent()) || "";
  }

  /**
   * Klika przycisk anulowania edycji
   */
  async clickCancelButton(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Klika przycisk zapisywania zmian
   */
  async clickSaveButton(): Promise<void> {
    await this.saveButton.click();
  }

  /**
   * Sprawdza czy przycisk zapisywania jest aktywny
   * @returns true jeśli przycisk jest aktywny, false w przeciwnym razie
   */
  async isSaveButtonEnabled(): Promise<boolean> {
    return await this.saveButton.isEnabled();
  }

  /**
   * Edytuje fiszkę i zapisuje zmiany
   * @param frontText - Nowy tekst frontu
   * @param backText - Nowy tekst tyłu
   */
  async editAndSave(frontText: string, backText: string): Promise<void> {
    await this.enterFrontText(frontText);
    await this.enterBackText(backText);
    await this.clickSaveButton();
  }
}
