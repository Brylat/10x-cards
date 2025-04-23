# Plan testów dla projektu 10xCards

## 1. Wprowadzenie i cele testowania

Niniejszy plan testów został stworzony dla aplikacji 10xCards - narzędzia do generowania i zarządzania fiszkami przy użyciu sztucznej inteligencji. Głównym celem testowania jest zapewnienie wysokiej jakości aplikacji, która będzie niezawodnie realizować wszystkie założone funkcjonalności, zapewniając przy tym bezpieczeństwo danych użytkowników i pozytywne doświadczenia użytkownika.

### Cele testowania:

- Weryfikacja poprawności działania wszystkich funkcjonalności zgodnie z wymaganiami
- Identyfikacja i eliminacja błędów przed wdrożeniem do produkcji
- Zapewnienie bezpieczeństwa danych użytkowników
- Weryfikacja integracji pomiędzy komponentami systemu
- Sprawdzenie wydajności aplikacji pod różnym obciążeniem
- Potwierdzenie użyteczności interfejsu użytkownika

## 2. Zakres testów

### 2.1. Testy funkcjonalne

- Rejestracja, logowanie i zarządzanie kontem użytkownika
- Generowanie fiszek przez AI
- Manualne tworzenie, edycja i usuwanie fiszek
- Zarządzanie listą fiszek
- Sesja nauki z algorytmem spaced repetition

### 2.2. Testy niefunkcjonalne

- Testy wydajnościowe
- Testy bezpieczeństwa
- Testy użyteczności
- Testy dostępności
- Testy kompatybilności

## 3. Typy testów do przeprowadzenia

### 3.1. Testy jednostkowe

- **Cel**: Weryfikacja poprawności działania poszczególnych modułów i komponentów w izolacji
- **Narzędzia**: Vitest, React Testing Library
- **Elementy do testowania**:
  - Serwisy: FlashcardsService, GenerationService, OpenRouterService, AIService
  - Komponenty: TextInputForm, EditFlashcardModal, FlashcardItem, FlashcardReviewList
  - Walidatory: Zod schemas

### 3.2. Testy integracyjne

- **Cel**: Weryfikacja poprawnej komunikacji między różnymi modułami aplikacji
- **Narzędzia**: Vitest, Supabase Test Helpers
- **Elementy do testowania**:
  - Integracja z Supabase (baza danych, autentykacja)
  - Integracja z OpenRouter.ai
  - Komunikacja między komponentami React a usługami backendowymi
  - Przepływ danych między komponentami

### 3.3. Testy API (end-to-end)

- **Cel**: Weryfikacja poprawności działania punktów końcowych API
- **Narzędzia**: Postman, SuperTest
- **Elementy do testowania**:
  - Endpoint `/api/flashcards`
  - Endpoint `/api/generations`
  - Endpointy autentykacji

### 3.4. Testy interfejsu użytkownika (e2e)

- **Cel**: Weryfikacja poprawności działania aplikacji z perspektywy użytkownika
- **Narzędzia**: Playwright, Cypress
- **Elementy do testowania**:
  - Proces rejestracji i logowania
  - Generowanie fiszek z tekstem wejściowym
  - Zarządzanie fiszkami
  - Sesja nauki

### 3.5. Testy wydajnościowe

- **Cel**: Weryfikacja wydajności aplikacji pod różnym obciążeniem
- **Narzędzia**: k6, Lighthouse
- **Elementy do testowania**:
  - Czas generowania fiszek
  - Ładowanie listy fiszek
  - Wydajność interfejsu użytkownika

### 3.6. Testy bezpieczeństwa

- **Cel**: Weryfikacja zabezpieczeń i ochrony danych
- **Narzędzia**: OWASP ZAP, Snyk
- **Elementy do testowania**:
  - Autentykacja i autoryzacja
  - Ochrona przed SQL Injection
  - Ochrona przed XSS
  - Bezpieczeństwo komunikacji z zewnętrznymi API

## 4. Scenariusze testowe dla kluczowych funkcjonalności

### 4.1. Rejestracja i logowanie użytkownika

1. **Rejestracja nowego użytkownika**

   - Warunki wstępne: Użytkownik nie jest zalogowany
   - Kroki:
     1. Wejście na stronę rejestracji
     2. Wprowadzenie danych: email i hasło
     3. Potwierdzenie rejestracji
   - Oczekiwany rezultat: Użytkownik zostaje zarejestrowany i zalogowany, przekierowany na stronę główną

2. **Logowanie istniejącego użytkownika**

   - Warunki wstępne: Użytkownik jest zarejestrowany
   - Kroki:
     1. Wejście na stronę logowania
     2. Wprowadzenie danych: email i hasło
     3. Potwierdzenie logowania
   - Oczekiwany rezultat: Użytkownik zostaje zalogowany i przekierowany na stronę główną

3. **Resetowanie hasła**
   - Warunki wstępne: Użytkownik jest zarejestrowany
   - Kroki:
     1. Wejście na stronę resetowania hasła
     2. Wprowadzenie adresu email
     3. Potwierdzenie resetowania
   - Oczekiwany rezultat: Użytkownik otrzymuje email z linkiem do resetowania hasła

### 4.2. Generowanie fiszek przez AI

1. **Generowanie fiszek z poprawnym tekstem wejściowym**

   - Warunki wstępne: Użytkownik jest zalogowany
   - Kroki:
     1. Wejście na stronę generowania fiszek
     2. Wprowadzenie tekstu o długości 1000-10000 znaków
     3. Kliknięcie przycisku "Generuj"
   - Oczekiwany rezultat: System generuje fiszki i wyświetla je na liście

2. **Generowanie fiszek z tekstem poza zakresem długości**

   - Warunki wstępne: Użytkownik jest zalogowany
   - Kroki:
     1. Wejście na stronę generowania fiszek
     2. Wprowadzenie tekstu o długości poniżej 1000 lub powyżej 10000 znaków
     3. Kliknięcie przycisku "Generuj"
   - Oczekiwany rezultat: System wyświetla komunikat o błędzie, przycisk "Generuj" jest nieaktywny

3. **Akceptacja, edycja i odrzucanie wygenerowanych fiszek**
   - Warunki wstępne: Użytkownik jest zalogowany, fiszki zostały wygenerowane
   - Kroki:
     1. Zaakceptowanie wybranych fiszek
     2. Odrzucenie wybranych fiszek
     3. Edycja wybranych fiszek
     4. Zapisanie zaakceptowanych fiszek
   - Oczekiwany rezultat: Zaakceptowane fiszki zostają zapisane w bazie danych

### 4.3. Manualne tworzenie i zarządzanie fiszkami

1. **Manualne tworzenie fiszki**

   - Warunki wstępne: Użytkownik jest zalogowany
   - Kroki:
     1. Wejście na stronę zarządzania fiszkami
     2. Kliknięcie przycisku "Dodaj fiszkę"
     3. Wprowadzenie treści przodu (max 200 znaków) i tyłu (max 500 znaków)
     4. Zapisanie fiszki
   - Oczekiwany rezultat: Fiszka zostaje zapisana i pojawia się na liście

2. **Edycja istniejącej fiszki**

   - Warunki wstępne: Użytkownik jest zalogowany, posiada przynajmniej jedną fiszkę
   - Kroki:
     1. Wejście na stronę zarządzania fiszkami
     2. Wybranie fiszki do edycji
     3. Modyfikacja treści
     4. Zapisanie zmian
   - Oczekiwany rezultat: Fiszka zostaje zaktualizowana

3. **Usunięcie fiszki**
   - Warunki wstępne: Użytkownik jest zalogowany, posiada przynajmniej jedną fiszkę
   - Kroki:
     1. Wejście na stronę zarządzania fiszkami
     2. Wybranie fiszki do usunięcia
     3. Potwierdzenie usunięcia
   - Oczekiwany rezultat: Fiszka zostaje usunięta z bazy danych

### 4.4. Sesja nauki

1. **Rozpoczęcie sesji nauki**

   - Warunki wstępne: Użytkownik jest zalogowany, posiada przynajmniej jedną fiszkę
   - Kroki:
     1. Wejście na stronę sesji nauki
     2. Rozpoczęcie sesji
   - Oczekiwany rezultat: System wyświetla pierwszą fiszkę

2. **Przebieg sesji nauki**
   - Warunki wstępne: Użytkownik rozpoczął sesję nauki
   - Kroki:
     1. Wyświetlenie przodu fiszki
     2. Pokazanie tyłu fiszki
     3. Ocena opanowania materiału
     4. Przejście do kolejnej fiszki
   - Oczekiwany rezultat: System rejestruje postępy i dostosowuje kolejność fiszek

## 5. Środowisko testowe

### 5.1. Środowisko lokalne (development)

- **Konfiguracja**:
  - Astro 5 z lokalnym serwerem deweloperskim
  - Lokalna instancja Supabase
  - Symulowane połączenie z OpenRouter.ai

### 5.2. Środowisko testowe (staging)

- **Konfiguracja**:
  - Serwer testowy na DigitalOcean
  - Testowa instancja Supabase
  - Testowy klucz API dla OpenRouter.ai z ograniczeniami

### 5.3. Środowisko produkcyjne

- **Konfiguracja**:
  - Serwer produkcyjny na DigitalOcean
  - Produkcyjna instancja Supabase
  - Produkcyjny klucz API dla OpenRouter.ai

## 6. Narzędzia do testowania

### 6.1. Testy jednostkowe i integracyjne

- Vitest - framework testowy
- React Testing Library - biblioteka do testowania komponentów React
- Supabase JS SDK - do testowania integracji z Supabase

### 6.2. Testy end-to-end

- Playwright/Cypress - do testów interfejsu użytkownika
- Postman/SuperTest - do testów API

### 6.3. Testy wydajnościowe

- k6 - do testów obciążeniowych
- Lighthouse - do testów wydajności frontendu

### 6.4. Testy bezpieczeństwa

- OWASP ZAP - do testów bezpieczeństwa
- Snyk - do wykrywania podatności w zależnościach

### 6.5. Narzędzia do CI/CD

- GitHub Actions - do automatyzacji testów w pipeline CI/CD

## 7. Harmonogram testów

### 7.1. Faza przygotowawcza (2 tygodnie)

- Konfiguracja środowiska testowego
- Przygotowanie narzędzi testowych
- Implementacja podstawowych testów jednostkowych

### 7.2. Faza testów wewnętrznych (3 tygodnie)

- Testy jednostkowe i integracyjne
- Testy bezpieczeństwa
- Testy wydajnościowe
- Testy API

### 7.3. Faza testów użytkownika (2 tygodnie)

- Testy end-to-end
- Testy akceptacyjne
- Testy użyteczności

### 7.4. Faza przygotowania do produkcji (1 tydzień)

- Rozwiązywanie zidentyfikowanych problemów
- Testy regresji
- Finalne testy bezpieczeństwa

## 8. Kryteria akceptacji testów

### 8.1. Pokrycie kodu testami

- Minimum 80% pokrycia kodu testami jednostkowymi dla serwisów
- Minimum 70% pokrycia kodu testami jednostkowymi dla komponentów

### 8.2. Funkcjonalność

- Wszystkie krytyczne scenariusze testowe przechodzą pomyślnie
- Brak błędów krytycznych i poważnych

### 8.3. Wydajność

- Czas generowania fiszek poniżej 10 sekund
- Czas ładowania strony poniżej 1.5 sekundy
- Czas odpowiedzi API poniżej 200ms dla 90% zapytań

### 8.4. Bezpieczeństwo

- Brak podatności o wysokim i średnim ryzyku
- Poprawna implementacja autoryzacji i autentykacji

## 9. Role i odpowiedzialności w procesie testowania

### 9.1. Kierownik testów

- Planowanie i koordynacja procesu testowania
- Monitorowanie postępów testowania
- Raportowanie wyników testów

### 9.2. Testerzy

- Implementacja testów
- Wykonywanie testów manualnych
- Raportowanie znalezionych błędów

### 9.3. Programiści

- Implementacja testów jednostkowych
- Naprawianie znalezionych błędów
- Code review zmian związanych z naprawami

### 9.4. DevOps

- Konfiguracja środowiska testowego
- Utrzymanie infrastruktury CI/CD
- Integracja testów z pipeline'em CI/CD

## 10. Procedury raportowania błędów

### 10.1. Format zgłoszenia błędu

- **Tytuł**: Krótki, opisowy tytuł błędu
- **Priorytet**: Krytyczny, Wysoki, Średni, Niski
- **Środowisko**: Lokalne, Testowe, Produkcyjne
- **Kroki reprodukcji**: Dokładne kroki prowadzące do wystąpienia błędu
- **Oczekiwane zachowanie**: Co powinno się stać
- **Aktualne zachowanie**: Co się dzieje
- **Załączniki**: Zrzuty ekranu, logi, nagrania

### 10.2. Proces obsługi błędów

1. Zgłoszenie błędu w systemie śledzenia błędów (GitHub Issues)
2. Triage błędu i przypisanie priorytetu
3. Przypisanie błędu do odpowiedzialnej osoby
4. Naprawa błędu
5. Weryfikacja naprawy
6. Zamknięcie zgłoszenia

### 10.3. Metryki błędów

- Liczba znalezionych/naprawionych błędów
- Średni czas naprawy
- Rozkład błędów według priorytetu
- Trendy w czasie (poprawa/pogorszenie jakości)

---

Ten plan testów będzie regularnie aktualizowany w miarę rozwoju projektu. Wszelkie zmiany w wymaganiach lub architekturze systemu powinny być odzwierciedlone w niniejszym dokumencie.
