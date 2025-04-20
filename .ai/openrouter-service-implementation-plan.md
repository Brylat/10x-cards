# OpenRouter Service Implementation Plan

## 1. Opis usługi

Usługa OpenRouter integruje się z interfejsem API OpenRouter w celu wzbogacenia czatów opartych na LLM o strukturalne wiadomości. Usługa zapewnia:

- Budowanie odpowiednio sformatowanych wiadomości (systemowych, użytkownika, strukturyzowanych odpowiedzi).
- Konfigurację modelu LLM poprzez wybór nazwy modelu oraz ustawień parametrów.
- Bezpieczną i niezawodną komunikację z API z obsługą błędów, mechanizmem ponawiania żądań (retry) oraz logowaniem.
- Skalowalność i łatwość integracji z istniejącym stosiem technologicznym: Astro 5, TypeScript 5, React 19, Tailwind 4, Shadcn/ui.

## 2. Opis konstruktora

Konstruktor usługi inicjalizuje kluczowe komponenty:

- Konfigurację API (klucze, endpointy) pobierane ze zmiennych środowiskowych.
- Moduł klienta API odpowiedzialny za wysyłanie zapytań do OpenRouter.
- Moduł budowy wiadomości, który tworzy strukturę komunikatów:
  - Wiadomość systemowa (np. `{ role: 'system', content: 'Inicjalizacja sesji LLM z bezpiecznymi ustawieniami.' }`)
  - Wiadomość użytkownika (np. `{ role: 'user', content: 'Zapytanie użytkownika.' }`)
  - Ustrukturyzowaną odpowiedź zgodną z `response_format` (np. `{ type: 'json_schema', json_schema: { name: 'chatResponse', strict: true, schema: { result: { type: 'string' } } } }`)
- Ustawienie domyślnych parametrów modelu (np. `{ parameter: 1.0, top_p: 1.0, frequency_penalty: 0.0, presence_penalty: 0.0 }`).

## 3. Publiczne metody i pola

- **initializeClient()**: Inicjalizuje klienta API OpenRouter i wczytuje konfigurację z zmiennych środowiskowych.
- **setResponseFormat(schema: JSONSchema): void**: Konfiguruje schemat JSON dla strukturalnych odpowiedzi (response_format).
- **sendChatMessage(userMessage: string)**: Buduje zapytanie łączące wiadomość systemową, użytkownika oraz konfigurację modelu i wysyła je do API.
- **setModelParameters(params: ModelParams)**: Pozwala na konfigurację parametrów modelu LLM.

**Publiczne właściwości:**

- `apiClient` – instancja obsługująca komunikację z API.
- `config` – obiekt konfiguracji zawierający m.in. klucze API i endpointy.

## 4. Prywatne metody i pola

- **buildMessagePayload(userMessage: string): Message[]**
  - Buduje tablicę wiadomości, która zawiera:
    1. Wiadomość systemową:
       - Przykład: `{ role: 'system', content: 'Inicjalizacja sesji LLM z bezpiecznymi ustawieniami.' }`
    2. Wiadomość użytkownika:
       - Przykład: `{ role: 'user', content: userMessage }`
    3. Strukturalną konfigurację odpowiedzi:
       - Przykład: `{ type: 'json_schema', json_schema: { name: 'chatResponse', strict: true, schema: { result: { type: 'string' } } } }`
- **parseAPIResponse(response: any): ParsedResponse**
  - Przetwarza odpowiedź z API i weryfikuje jej zgodność z oczekiwanym modelem odpowiedzi.
- **handleInternalError(error: Error)**
  - Prywatna metoda odpowiedzialna za logowanie i obsługę błędów wewnętrznych modułu.

## 5. Obsługa błędów

Potencjalne scenariusze błędów:

1. **Błąd połączenia z API**

   - Przyczyny: niestabilne połączenie, problemy sieciowe.
   - Rozwiązanie: Implementacja mechanizmu retry z eksponencjalnym backoff oraz dokładne logowanie.

2. **Błąd autoryzacji**

   - Przyczyny: nieprawidłowy lub brakujący klucz API.
   - Rozwiązanie: Walidacja klucza API podczas inicjalizacji usługi i jasne komunikaty błędów.

3. **Błąd formatu odpowiedzi**

   - Przyczyny: odpowiedź niezgodna z zdefiniowanym `response_format`.
   - Rozwiązanie: Walidacja odpowiedzi za pomocą schematu JSON oraz fallback do logowania i powiadomienia użytkownika.

4. **Błąd timeoutu**
   - Przyczyny: długie oczekiwanie na odpowiedź z API.
   - Rozwiązanie: Ustawienie limitu czasu dla żądań i informowanie o przekroczeniu tego limitu.

## 6. Kwestie bezpieczeństwa

- Przechowywanie kluczy API oraz innych danych uwierzytelniających wyłącznie w zmiennych środowiskowych.
- Walidacja i sanitizacja danych wejściowych, aby zapobiec atakom (np. injection).
- Zabezpieczenie komunikacji poprzez użycie protokołu HTTPS.
- Regularny audyt logów i monitorowanie prób nieautoryzowanego dostępu.

## 7. Plan wdrożenia krok po kroku

1. **Przygotowanie środowiska:**

   - Ustalenie i konfiguracja zmiennych środowiskowych (klucze API, endpointy).
   - Weryfikacja zgodności projektu ze stosem technologicznym: Astro 5, TypeScript 5, React 19, Tailwind 4, Shadcn/ui.

2. **Implementacja modułu klienta API:**

   - Utworzenie funkcji `initializeClient()` do konfiguracji połączenia z OpenRouter API.
   - Dodanie mechanizmów retry oraz timeout.

3. **Implementacja modułu budowania wiadomości:**

   - Stworzenie metody `buildMessagePayload()` generującej tablicę wiadomości:
     - Wiadomość systemowa:
       - (Przykład 1) `{ role: 'system', content: 'Inicjalizacja sesji LLM z bezpiecznymi ustawieniami.' }`
     - Wiadomość użytkownika:
       - (Przykład 2) `{ role: 'user', content: 'Zapytanie użytkownika.' }`
     - Ustrukturyzowana odpowiedź:
       - (Przykład 3) `{ type: 'json_schema', json_schema: { name: 'chatResponse', strict: true, schema: { result: { type: 'string' } } } }`

4. **Konfiguracja modelu i parametrów:**

   - Umożliwienie wyboru nazwy modelu (np. `model: 'gpt-4'`).
   - Ustawienie parametrów modelu z domyślnymi wartościami:
     - (Przykład 4) `{ parameter: 1.0, top_p: 1.0, frequency_penalty: 0.0, presence_penalty: 0.0 }`

5. **Integracja modułu z logiką aplikacji:**

   - Połączenie funkcji `sendChatMessage(userMessage)` z interfejsem użytkownika (np. komponent czatu w React).
   - Przeprowadzenie testów komunikacji z API w środowisku deweloperskim.

6. **Implementacja obsługi błędów:**
   - Wdrożenie mechanizmów wychwytywania błędów na każdym etapie przetwarzania (klient API, budowanie wiadomości, parsowanie odpowiedzi).
   - Centralne logowanie błędów i informowanie użytkownika o problemach.
