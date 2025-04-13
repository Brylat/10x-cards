# API Endpoint Implementation Plan: Request Flashcard Generation via AI

## 1. Przegląd punktu końcowego
- Endpoint dedykowany generowaniu propozycji fiszek przy użyciu AI na podstawie otrzymanego tekstu wejściowego.
- Umożliwia otrzymanie natychmiastowych propozycji fiszek po przesłaniu tekstu o wymaganej długości.
- Wykorzystuje mechanizm Supabase do autentykacji oraz interakcję z bazą danych PostgreSQL.

## 2. Szczegóły żądania
- **Metoda HTTP**: POST
- **URL**: `/api/generations`
- **Parametry żądania**:
  - **Wymagane**:
    - `source_text`: string, tekst wejściowy o długości między 1000 a 10000 znaków
  - **Opcjonalne**: Brak
- **Payload (Request Body)**:
  ```json
  {
    "source_text": "<tekst o długości 1000-10000 znaków>"
  }
  ```

## 3. Wykorzystywane typy
- **Request DTO**: `RequestGenerationCommandDTO`
- **Response DTO**: `GenerationResponseDTO`
- Powiązane typy:
  - `GenerationRow` (model rekordu generacji)
  - `FlashcardProposalDTO` (reprezentuje pojedynczą propozycję fiszki generowanej przez AI; zawiera pola `front`, `back`, `source` oraz opcjonalnie `generation_id`. Ten typ jest używany do mapowania i przekazywania szczegółów propozycji fiszek w zwracanej odpowiedzi.)

## 4. Szczegóły odpowiedzi
- **Status powodzenia**: 201 Created
- **Struktura odpowiedzi**:
  ```json
  {
    "generation_id": <number>,
    "status": "completed" | "failed",
    "generated_count": <number>,
    "flashcards_proposals": [
      {
        "id": <number>,
        "front": "<tekst>",
        "back": "<tekst>",
        "source": "ai_full",
        "generation_id": <number>
      }
    ]
  }
  ```
- **Kody błędów**:
  - 400 Bad Request: nieprawidłowy format lub długość `source_text`
  - 401 Unauthorized: brak autoryzacji
  - 500 Internal Server Error: błąd wewnętrzny, np. niepowodzenie generacji

## 5. Przepływ danych
1. Klient wysyła żądanie POST na `/api/generations` z kluczem `source_text` w treści żądania.
2. Na serwerze:
   - Walidacja wejściowa z wykorzystaniem schema zod, sprawdzająca długość tekstu (1000-10000 znaków).
   - Sprawdzenie autoryzacji użytkownika za pomocą Supabase Auth (np. w `context.locals`).
   - Przekazanie żądania do warstwy serwisowej (np. `generation.service`) odpowiedzialnej za logikę biznesową:
     - Utworzenie rekordu w tabeli `generations` z informacjami o generacji, takich jak długość tekstu, hash, model, czasy utworzenia i aktualizacji.
     - Wywołanie zewnętrznego serwisu AI (lub modułu odpowiedzialnego za integrację z Openrouter.ai) w celu generacji propozycji fiszek.
     - W przypadku powodzenia, zapisanie propozycji do tabeli `flashcards` z kluczem `generation_id`.
     - W przypadku niepowodzenia, zapisanie szczegółów błędu w tabeli `generations_error_logs`.
3. Serwer zwraca odpowiedź JSON zawierającą `generation_id`, `status`, `generated_count` oraz listę `flashcards_proposals`.

## 6. Względy bezpieczeństwa
- **Autoryzacja**: Endpoint powinien być zabezpieczony mechanizmem autoryzacji (Supabase Auth); użytkownik musi być uwierzytelniony.
- **Walidacja danych**: Użycie biblioteki zod do weryfikacji, że `source_text` spełnia wymogi długościowe.
- **Bezpieczeństwo bazy danych**: Użycie parametrów zapobiegających SQL Injection oraz stosowanie odpowiednich uprawnień.
- **Obsługa poufnych informacji**: Unikanie ujawniania szczegółów błędów klientowi.

## 7. Obsługa błędów
- **400 Bad Request**: Zwracane, gdy `source_text` nie mieści się w wymaganej długości.
- **401 Unauthorized**: Zwracane w przypadku braku lub nieprawidłowego tokenu autoryzacyjnego.
- **500 Internal Server Error**: Zwracane, gdy wystąpi błąd w logice serwera lub w trakcie integracji z usługą AI. W takim przypadku, szczegóły błędu powinny być zapisane w tabeli `generations_error_logs`.

## 8. Rozważania dotyczące wydajności
- Optymalizacja zapytań do bazy danych przez indeksowanie kolumn (np. `created_at`, `user_id`, `generation_id`).
- Timeout dla wywołania generowania przy użyciu AI na poziomie 60 sec.
- Ewentualne wykorzystanie cache dla często wykonywanych operacji, jeśli to możliwe.

## 9. Etapy wdrożenia
1. Utworzenie nowego endpointu w strukturze projektu (np. `/src/pages/api/generations.ts`).
2. Implementacja walidacji wejściowej przy użyciu zod (sprawdzenie `source_text` pod kątem długości).
3. Dodanie kontroli autoryzacji użytkownika wykorzystując mechanizm Supabase Auth (np. sprawdzenie `context.locals`).
4. Utworzenie lub rozszerzenie warstwy serwisowej (np. `generation.service` w katalogu `src/lib/services`)
   - Logika zapisu do tabeli `generations`.
   - Integracja z zewnętrznym serwisem AI w celu generacji fiszek.
   - Logika zapisu propozycji fiszek do tabeli `flashcards` lub logowania błędów do `generations_error_logs`.
5. Implementacja odpowiedzi na poprawne wykonanie operacji (201 Created) oraz właściwe mapowanie DTO.