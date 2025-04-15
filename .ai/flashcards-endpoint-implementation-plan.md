# API Endpoint Implementation Plan: Create Flashcards

## 1. Przegląd punktu końcowego

Endpoint odpowiedzialny za tworzenie jednego lub wielu fiszek. Fiszki mogą być tworzone ręcznie lub na podstawie generacji AI. Kluczowe elementy to walidacja danych wejściowych, integracja z bazą danych PostgreSQL oraz zapewnienie autoryzacji użytkowników przez Supabase Auth.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** /api/flashcards
- **Parametry:**
  - **Wymagane:**
    - `flashcards`: tablica obiektów, gdzie każdy obiekt zawiera:
      - `front`: string (maks. 200 znaków)
      - `back`: string (maks. 500 znaków)
      - `source`: string, jedna z wartości: "manual", "ai_full", "ai_edited"
  - **Opcjonalne:**
    - `generation_id`: numer (lub null) – opcjonalny identyfikator generacji, gdy fiszka powstaje na podstawie AI
- **Request Body:** JSON zgodny z przedstawioną specyfikacją

## 3. Wykorzystywane typy

- `CreateFlashcardsDTO`: DTO zawierający pole `flashcards`, które jest listą `CreateFlashcardCommandDTO`.
- `CreateFlashcardCommandDTO`: Command model dla pojedynczej fiszki, zawiera pola: `front`, `back`, `source` oraz opcjonalnie `generation_id`.
- `CreateFlashcardsResponseDTO`: DTO odpowiedzi, zawiera pole `created` – listę utworzonych fiszek (typu `FlashcardListItemDTO`) oraz `failed` – listę błędów, jeśli jakieś wystąpiły.

## 4. Szczegóły odpowiedzi

- **Sukces:**
  - **Status:** 201 Created
  - **Body:**
    ```json
    {
      "created": [
        {
          "id": 1,
          "front": "Example front text",
          "back": "Example back text",
          "source": "manual",
          "generation_id": null,
          "created_at": "2023-10-01T00:00:00Z"
        }
      ],
      "failed": []
    }
    ```
- **Błędy:**
  - 400 Bad Request – błędy walidacji (np. przekroczenie długości pól)
  - 401 Unauthorized – brak autoryzacji
  - 500 Internal Server Error – błędy po stronie serwera, np. problemy z operacją na bazie danych

## 5. Przepływ danych

1. Żądanie trafia do endpointu `/api/flashcards`.
2. Middleware autoryzacji sprawdza tożsamość użytkownika, pobierając `user_id` z `context.locals` (Supabase Auth).
3. Walidacja danych wejściowych na podstawie schematu określonego przez `CreateFlashcardsDTO` oraz `CreateFlashcardCommandDTO` (np. używając Zod).
4. Przekazanie danych do warstwy serwisowej (np. `FlashcardsService`), która:
   - Iteruje po przekazanej tablicy fiszek
   - Waliduje każdy element (długość `front`, `back` oraz poprawność `source`)
   - Mapuje dane na model bazodanowy, przypisując `user_id` z kontekstu
5. Wykonanie operacji w bazie danych – bulk insert do tabeli `flashcards`.
6. Zwrócenie odpowiedzi zawierającej listę utworzonych rekordów oraz ewentualnie listę błędów, jeśli wystąpiły problemy z niektórymi wpisami.

## 6. Względy bezpieczeństwa

- **Autoryzacja:** Endpoint powinien być dostępny tylko dla zalogowanych użytkowników. Użytkownik musi być zweryfikowany przez mechanizm Supabase Auth (dostępny w `context.locals`).
- **Walidacja Danych:** Weryfikacja długości pól `front` (maks. 200) i `back` (maks. 500) oraz sprawdzanie, czy `source` jest jedną z dozwolonych wartości.
- **Sanityzacja:** Upewnić się, że wszystkie dane wejściowe są poprawnie sanetyzowane, aby zapobiec atakom typu SQL Injection czy XSS.
- **Obsługa `generation_id`:** Jeśli pole jest podane, należy zweryfikować, czy odnosi się ono do istniejącej generacji i czy należy do aktualnego użytkownika.

## 7. Obsługa błędów

- **400 Bad Request:**
  - Niezgodność schematu wejścia (np. brak wymaganych pól lub przekroczenie limitów znaków).
  - Walidacja niepoprawnych wartości dla pól.
- **401 Unauthorized:**
  - Próba dostępu bez ważnego tokenu lub gdy użytkownik nie jest uwierzytelniony.
- **500 Internal Server Error:**
  - Błędy bazodanowe lub nieoczekiwane wyjątki podczas przetwarzania.
- **Logowanie błędów:**
  - W przypadku krytycznych błędów serwerowych zaleca się logowanie za pomocą mechanizmu logowania.
  - Rozważenie zapisu krytycznych błędów do tabeli `generations_error_logs` (jeśli dotyczy generacji) lub innego systemu monitoringu.

## 8. Rozważania dotyczące wydajności

- Wykorzystanie bulk insert do jednorazowego dodania wielu fiszek, co zmniejsza liczbę zapytań do bazy.
- Korzystanie z indeksów na kolumnach `user_id`, `generation_id` i `created_at` dla szybkiego dostępu do danych.
- Implementacja limitów dla maksymalnej liczby fiszek przesyłanych w jednym żądaniu, aby zapobiec przeciążeniu serwera.

## 9. Etapy wdrożenia

1. **Utworzenie endpointu:**
   - Stworzenie pliku endpointu w katalogu `./src/pages/api/flashcards`.
2. **Implementacja middleware autoryzacji:**
   - Zapewnienie, że `user_id` jest wyciągany z `context.locals` i przekazywany do logiki biznesowej.
3. **Walidacja danych:**
   - Definicja schematu walidacji przy użyciu Zod na podstawie `CreateFlashcardsDTO` oraz `CreateFlashcardCommandDTO`.
4. **Warstwa serwisowa:**
   - Utworzenie serwisu (np. `FlashcardsService`) odpowiedzialnego za logikę biznesową tworzenia fiszek.
5. **Operacja bazodanowa:**
   - Implementacja mechanizmu bulk insert do tabeli `flashcards` przy użyciu klienta Supabase.
6. **Mapowanie odpowiedzi:**
   - Przekształcenie wyników operacji na format `CreateFlashcardsResponseDTO`.
7. **Obsługa błędów i logowanie:**
   - Implementacja mechanizmów obsługi błędów i odpowiedniego logowania (w tym ewentualne zapisywanie błędów do tabeli `generations_error_logs`).
8. **Testy:**
   - Implementacja testów jednostkowych i integracyjnych dla endpointu.
9. **Przegląd i wdrożenie:**
   - Code review przez zespół oraz wdrożenie w środowisku testowym przed wdrożeniem produkcyjnym.
