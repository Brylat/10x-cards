/_ Plan utworzony na podstawie analizy: _/

# Plan implementacji widoku Generowanie Fiszek

## 1. Przegląd

Widok służy do generowania propozycji fiszek na podstawie wprowadzonego przez użytkownika tekstu (1000-10000 znaków). Użytkownik po otrzymaniu wyników może przeglądać, akceptować, edytować lub usuwać poszczególne propozycje, a następnie zapisać zaakceptowane fiszki.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką `/generate`.

## 3. Struktura komponentów

- **GenerateFlashcardsView** (główny kontener widoku)
  - **TextInputForm** (formularz wejściowy z polem tekstowym i instrukcjami)
  - **GenerationButton** (przycisk wywołania procesu generacji)
  - **Loader/Spinner** (wskaźnik ładowania podczas wywołania API)
  - **Alert** (komponent przekazujący komunikaty o błędach)
  - **FlashcardReviewList** (lista wyświetlająca propozycje fiszek)
    - **FlashcardItem** (pojedyncza fiszka z opcjami: akceptacja, edycja, usunięcie)
  - **EditFlashcardModal** (modal do edycji fiszki)
  - **SaveAcceptedButton** (przycisk do finalnego zapisu zaakceptowanych fiszek)

## 4. Szczegóły komponentów

### GenerateFlashcardsView

- **Opis**: Główny komponent zarządzający stanem widoku oraz integracją z API.
- **Główne elementy**: Zawiera formularz wejściowy, przycisk generacji, loader, alerty oraz listę propozycji fiszek.
- **Obsługiwane interakcje**: Przekazywanie danych z formularza, wywołanie API generacji, zarządzanie edycjami fiszek i finalne zapisywanie.
- **Typy**: ViewModel widoku, stany (inputText, isLoading, error, flashcardsList, flashcardBeingEdited).
- **Propsy**: Wewnętrzne, zarządzane lokalnie.

### TextInputForm

- **Opis**: Komponent zawierający pole tekstowe do wprowadzania treści oraz instrukcje dotyczące minimalnej i maksymalnej długości.
- **Główne elementy**: Tekstowe pole `<textarea>`, etykiety/instrukcje, komunikaty o błędach walidacji.
- **Obsługiwane interakcje**: `onChange` (aktualizacja tekstu) i walidacja długości.
- **Obsługiwana walidacja**: Tekst musi zawierać od 1000 do 10000 znaków.
- **Typy**: `GenerateFlashcardsForm` z polem `source_text: string`.
- **Propsy**: `value`, `onChange`, `errorMessage`.

### GenerationButton

- **Opis**: Przycisk inicjujący API do generacji fiszek.
- **Główne elementy**: Przycisk `<button>` z etykietą "Generuj".
- **Obsługiwane interakcje**: `onClick` wyzwalający akcję wywołania endpointu `/api/generations`.
- **Obsługiwana walidacja**: Aktywowany tylko gdy tekst w `TextInputForm` spełnia kryteria.
- **Typy**: Funkcja callback bezpośrednio powiązana z API.
- **Propsy**: `onClick`, stan `disabled`.

### FlashcardReviewList

- **Opis**: Komponent wyświetlający listę wygenerowanych propozycji fiszek.
- **Główne elementy**: Lista (np. `<ul>`) zawierająca komponenty `FlashcardItem`.
- **Obsługiwane interakcje**: Akceptacja, edycja (otwarcie modalu) oraz usunięcie fiszki z listy.
- **Obsługiwana walidacja**: Poszczególne fiszki muszą mieć front <=200 znaków i back <=500 znaków (zwłaszcza przy edycji).
- **Typy**: Tablica obiektów typu `FlashcardProposalDTO` rozszerzona o flagę `accepted: boolean`.
- **Propsy**: `flashcards` (lista fiszek), `onAccept`, `onEdit`, `onDelete`.

### FlashcardItem

- **Opis**: Pojedyncza fiszka z opcjami interakcji.
- **Główne elementy**: Tekst fiszki (przód i tył), przyciski: akceptuj, edytuj, usuń.
- **Obsługiwane interakcje**: Kliknięcie przycisku akceptacji, wywołanie edycji, usunięcie.
- **Obsługiwana walidacja**: Sprawdzenie limitów tekstu przy edycji.
- **Typy**: Pojedynczy obiekt `FlashcardItemViewModel` (front, back, source, generation_id, accepted flag, opcjonalnie id).
- **Propsy**: Dane fiszki, funkcje akcji (onAccept, onEdit, onDelete).

### EditFlashcardModal

- **Opis**: Modal do edycji zawartości fiszki.
- **Główne elementy**: Formularz edycji z polami do edycji tekstu "front" i "back".
- **Obsługiwane interakcje**: `onSave` (potwierdzenie edycji), `onClose` (zamknięcie modalu).
- **Obsługiwana walidacja**: Front – max 200 znaków, Back – max 500 znaków.
- **Typy**: Obiekt edytowanej fiszki typu `FlashcardItemViewModel`.
- **Propsy**: `flashcard`, `onSave`, `onClose`, `errorMessages`.

### Loader/Spinner oraz Alert

- **Opis**: Komponenty do wizualnej informacji o ładowaniu oraz przekazywaniu błędów.
- **Obsługiwane interakcje**: Brak interakcji; wyświetlanie stanu UI.
- **Typy**: Proste komponenty wyświetlające komunikaty.

## 5. Typy

- **GenerateFlashcardsForm**: { source_text: string }
- **FlashcardProposalDTO**: { front: string, back: string, source: 'ai_full' | 'ai_edited', generation_id?: number | null }
- **FlashcardItemViewModel**: Rozszerzenie FlashcardProposalDTO o dodatkowe pole: accepted: boolean oraz opcjonalnie id (przy zapisie).
- Dodatkowo typy pochodzące z `src/types.ts` jak `GenerationResponseDTO`.

## 6. Zarządzanie stanem

- W głównym komponencie `GenerateFlashcardsView` użyjemy hooków `useState` do zarządzania stanem:
  - `inputText` (wartość z `TextInputForm`)
  - `isLoading` (stan ładowania API)
  - `error` (komunikaty o błędach)
  - `flashcardsList` (lista propozycji fiszek z flagą zaakceptowania)
  - `editingFlashcard` (aktualnie edytowana fiszka w modalu)
- Rozważenie wykorzystania custom hooka `useFlashcardGeneration` w celu enkapsulacji logiki wywołań API i aktualizacji stanu.

## 7. Integracja API

- **/api/generations**:
  - Metoda: POST
  - Payload: { source_text: string }
  - Odpowiedź: obiekt typu `GenerationResponseDTO` zawierający m.in. `flashcards_proposals`.
  - Obsługa błędów: komunikaty walidacyjne (400), problemy serwera (500).
- **/api/flashcards**:
  - Metoda: POST
  - Payload: { flashcards: FlashcardProposalDTO[] } – tylko zaakceptowane propozycje.
  - Odpowiedź: lista zapisanych fiszek.

## 8. Interakcje użytkownika

- Wprowadzanie tekstu oraz walidacja jego długości w czasie rzeczywistym.
- Kliknięcie przycisku "Generuj" uruchamia loader i wysyła żądanie do API generacji.
- Po otrzymaniu odpowiedzi, wyświetlenie listy fiszek w komponencie `FlashcardReviewList`.
- Użytkownik może:
  - Akceptować fiszkę – oznaczenie jej jako zaakceptowanej.
  - Edytować fiszkę – otwarcie modalu z możliwością modyfikacji treści (przy zachowaniu limitów znaków).
  - Usunąć fiszkę – usunięcie z listy propozycji.
- Kliknięcie przycisku "Zapisz zaakceptowane" wysyła dane zaakceptowanych fiszek do endpointu `/api/flashcards`.

## 9. Warunki i walidacja

- Pole tekstowe: minimalnie 1000 i maksymalnie 10000 znaków.
- Formularz edycji:
  - Front: maks. 200 znaków.
  - Back: maks. 500 znaków.
- Aktywacja przycisku generacji tylko po pomyślnej walidacji tekstu.
- Sprawdzanie odpowiedzi API i walidacja poprawności struktury odpowiedzi zgodnie z typem `GenerationResponseDTO`.

## 10. Obsługa błędów

- Walidacja wejścia w `TextInputForm` z natychmiastowym feedbackiem.
- Wyświetlanie komunikatu błędu w przypadku nieprawidłowych danych wejściowych lub błędów API (400, 500).
- W modalu edycji: wyświetlenie informacji o błędach walidacji dla poszczególnych pól.
- Użycie globalnego alertu lub komponentu ErrorBoundary do przechwytywania nieoczekiwanych błędów.

## 11. Kroki implementacji

1. Utworzenie nowej strony `/generate` w folderze `src/pages`, wykorzystując Astro do integracji React.
2. Utworzenie głównego komponentu `GenerateFlashcardsView` w folderze `src/components` lub bezpośrednio w stronie.
3. Implementacja komponentu `TextInputForm` z obsługą walidacji długości tekstu.
4. Implementacja komponentu `GenerationButton` wraz z logiką wywołania API `/api/generations`.
5. Dodanie komponentu loadera/spinnera oraz alertów błędów.
6. Utworzenie komponentu `FlashcardReviewList`, który renderuje listę `FlashcardItem`.
7. Implementacja logiki akceptacji, edycji (otwarcie `EditFlashcardModal`) i usuwania fiszek z listy.
8. Utworzenie i implementacja `EditFlashcardModal` z walidacją pól (front i back).
9. Implementacja przycisku "Zapisz zaakceptowane" i logiki przesłania danych do `/api/flashcards`.
10. Testowanie interakcji użytkownika oraz walidacji – przetestowanie scenariuszy błędów i poprawności danych.
11. Dokonanie przeglądu kodu i finalnej optymalizacji pod kątem UX, dostępności oraz bezpieczeństwa.
