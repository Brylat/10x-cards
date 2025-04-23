import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * Page Object dla strony logowania
 */
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;
  readonly resetPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/hasło/i);
    this.loginButton = page.getByRole("button", { name: /zaloguj/i });
    this.errorMessage = page.locator('[role="alert"]');
    this.registerLink = page.getByRole("link", { name: /zarejestruj/i });
    this.resetPasswordLink = page.getByRole("link", { name: /zapomniałem hasła/i });
  }

  /**
   * Nawiguj do strony logowania
   */
  async goto() {
    await super.goto("/login");
  }

  /**
   * Logowanie użytkownika
   * @param email Email użytkownika
   * @param password Hasło użytkownika
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Czekamy na przekierowanie lub odpowiedź serwera
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Sprawdza, czy jesteśmy na stronie logowania
   */
  async isLoginPage(): Promise<boolean> {
    // Sprawdzamy, czy URL zawiera "/login"
    const url = this.page.url();
    return url.includes("/login");
  }

  /**
   * Przejście do strony rejestracji
   */
  async navigateToRegister() {
    await this.registerLink.click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Przejście do strony resetowania hasła
   */
  async navigateToResetPassword() {
    await this.resetPasswordLink.click();
    await this.page.waitForLoadState("networkidle");
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
