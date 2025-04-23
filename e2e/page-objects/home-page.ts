import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * Page Object dla strony głównej
 */
export class HomePage extends BasePage {
  readonly topMenu: Locator;
  readonly generateButton: Locator;
  readonly logoutButton: Locator;
  readonly flashcardsList: Locator;

  constructor(page: Page) {
    super(page);
    this.topMenu = page.locator("nav");
    this.generateButton = page.getByRole("link", { name: /generate flashcards/i });
    this.logoutButton = page.getByRole("button", { name: /wyloguj/i });
    this.flashcardsList = page.locator(".flashcard-list");
  }

  /**
   * Nawiguj do strony głównej
   */
  async goto() {
    await super.goto("/");
  }

  /**
   * Przejście do strony generowania fiszek
   */
  async navigateToGenerate() {
    await this.generateButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Wylogowanie się
   */
  async logout() {
    await this.logoutButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Sprawdza, czy użytkownik jest zalogowany
   */
  async isLoggedIn(): Promise<boolean> {
    return await this.logoutButton.isVisible();
  }

  /**
   * Pobiera liczbę zestawów fiszek, jeśli są dostępne
   */
  async getFlashcardsCount(): Promise<number> {
    if (await this.flashcardsList.isVisible()) {
      const items = await this.flashcardsList.locator("li").count();
      return items;
    }
    return 0;
  }
}
