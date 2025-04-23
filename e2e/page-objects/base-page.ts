import type { Page, Locator } from "@playwright/test";

/**
 * Klasa bazowa dla wszystkich Page Objects
 * Zawiera wspólne metody i właściwości
 */
export abstract class BasePage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1").first();
  }

  /**
   * Nawiguj do strony
   * @param path Ścieżka do strony (względem baseUrl)
   */
  async goto(path = "") {
    await this.page.goto(path);
  }

  /**
   * Metoda zwracająca tytuł strony
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Metoda zwraca treść nagłówka strony
   */
  async getHeadingText(): Promise<string | null> {
    return await this.heading.textContent();
  }

  /**
   * Czeka na załadowanie strony
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }
}
