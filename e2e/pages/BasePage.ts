import type { Page } from "@playwright/test";

/**
 * Bazowa klasa dla wszystkich stron w aplikacji
 * Zawiera wspólne elementy i funkcjonalności
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Nawiguje do podanej ścieżki
   * @param path - Ścieżka do nawigacji
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Pobiera aktualny URL
   * @returns Aktualny URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Czeka na załadowanie strony
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Sprawdza czy tytuł strony zawiera dany tekst
   * @param text - Tekst do sprawdzenia
   */
  async hasTitle(text: string): Promise<boolean> {
    return await this.page.title().then((title) => title.includes(text));
  }

  /**
   * Sprawdza czy strona zawiera dany tekst
   * @param text - Tekst do sprawdzenia
   */
  async hasText(text: string): Promise<boolean> {
    return await this.page.getByText(text, { exact: false }).isVisible();
  }

  /**
   * Wykonuje zrzut ekranu
   * @param name - Nazwa zrzutu ekranu
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `./test-results/screenshots/${name}.png` });
  }
}
