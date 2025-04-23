import type { APIRequestContext } from "@playwright/test";

/**
 * Interfejs reprezentujący fiszkę
 */
interface Flashcard {
  id?: string;
  front: string;
  back: string;
  topic: string;
  language: string;
}

/**
 * Klasa do testowania API aplikacji
 */
export class ApiContext {
  private request: APIRequestContext;
  private baseApiUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseApiUrl = "/api";
  }

  /**
   * Wykonuje logowanie poprzez API
   * @param email Email użytkownika
   * @param password Hasło użytkownika
   */
  async login(email: string, password: string) {
    const response = await this.request.post(`${this.baseApiUrl}/auth/login`, {
      data: {
        email,
        password,
      },
    });
    return response;
  }

  /**
   * Wykonuje wylogowanie poprzez API
   */
  async logout() {
    const response = await this.request.post(`${this.baseApiUrl}/auth/logout`);
    return response;
  }

  /**
   * Pobiera listę fiszek użytkownika poprzez API
   */
  async getFlashcards() {
    const response = await this.request.get(`${this.baseApiUrl}/flashcards`);
    if (response.ok()) {
      return await response.json();
    }
    return null;
  }

  /**
   * Generuje fiszki poprzez API
   * @param topic Temat fiszek
   * @param language Język fiszek
   */
  async generateFlashcards(topic: string, language = "Polski") {
    const response = await this.request.post(`${this.baseApiUrl}/flashcards/generate`, {
      data: {
        topic,
        language,
      },
    });
    if (response.ok()) {
      return await response.json();
    }
    return null;
  }

  /**
   * Zapisuje wygenerowane fiszki poprzez API
   * @param flashcards Fiszki do zapisania
   */
  async saveFlashcards(flashcards: Flashcard[]) {
    const response = await this.request.post(`${this.baseApiUrl}/flashcards/save`, {
      data: {
        flashcards,
      },
    });
    return response;
  }

  /**
   * Usuwa zestaw fiszek poprzez API
   * @param id Identyfikator zestawu fiszek
   */
  async deleteFlashcardSet(id: string) {
    const response = await this.request.delete(`${this.baseApiUrl}/flashcards/${id}`);
    return response;
  }
}
