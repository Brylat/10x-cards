# Specyfikacja modułu autentykacji (auth) dla 10xCards

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### Strony i Layouty
- Utworzenie dedykowanych stron: 
  - Rejestracja: `/register`
  - Logowanie: `/login`
  - Reset hasła: `/reset-password`
- Layouty:
  - `NonAuthLayout.astro` – opakowanie dla stron, które nie wymagają autentykacji (logowanie, rejestracja, reset hasła). Zapewnia spójny wygląd i strukturę dla formularzy autentykacyjnych.
  - `AuthLayout.astro` – layout dla stron dostępnych tylko dla zalogowanych użytkowników (np. generowanie fiszek) z widocznym TopMenu.

### Komponenty Client-Side (React)
- Utworzenie katalogu `src/components/auth/` z następującymi komponentami:
  - `RegisterForm.tsx` – formularz rejestracji użytkownika, zawiera pola: email, hasło, potwierdzenie hasła. Walidacja obejmuje sprawdzenie formatu email oraz siły hasła (np. minimalna liczba znaków, mieszanie liter i cyfr).
  - `LoginForm.tsx` – formularz logowania z polami email i hasło. Walidacja poprawności danych oraz obsługa błędów (np. nieistniejący użytkownik lub błędne hasło).
  - `PasswordResetForm.tsx` – formularz do odzyskiwania hasła, przyjmujący adres email i inicjujący procedurę resetowania hasła.
- Wykorzystanie komponentów z biblioteki Shadcn/ui oraz stylów Tailwind CSS w celu zapewnienia spójnego, nowoczesnego wyglądu.
- Separacja odpowiedzialności:
  - Strony Astro odpowiadają za routing, osadzanie komponentów React oraz przekazywanie danych konfiguracyjnych.
  - Komponenty React zajmują się interakcjami użytkownika, walidacją na żywo i wysyłaniem żądań do backendu.

### Walidacja i Komunikaty Błędów
- Formularze realizują walidację po stronie klienta (np. wymagane pola, format email, siła hasła) oraz obsługują komunikaty błędów przesyłane z backendu.
- Przykładowe scenariusze:
  - Rejestracja: unikalność emaila; walidacja hasła; przejrzyste komunikaty o błędach (np. "Adres email jest już w użyciu").
  - Logowanie: weryfikacja poprawnych danych; informowanie użytkownika o błędnej kombinacji email/hasło.
  - Reset hasła: sprawdzenie, czy podany email istnieje w systemie; komunikaty informujące o wysłaniu maila resetującego.

### Integracja i Nawigacja
- Niezalogowani użytkownicy są domyślnie przekierowywani na stronę logowania.
- Po poprawnym logowaniu następuje przekierowanie na stronę generowania fiszek.
- TopMenu (widoczny tylko dla zalogowanych) zawiera m.in. przycisk wylogowania.

## 2. LOGIKA BACKENDOWA

### Struktura Endpointów API
- Utworzenie endpointów w katalogu `src/pages/api/auth/`:
  - `registration.ts` – obsługa rejestracji; przyjmuje dane JSON (email, hasło) i wykorzystuje Supabase Auth do rejestracji użytkownika.
  - `login.ts` – obsługa logowania; waliduje dane wejściowe, inicjuje sesję poprzez Supabase Auth i zwraca token sesji.
  - `reset-password.ts` – obsługa resetowania hasła; przyjmuje email i inicjuje procedurę wysyłania maila z linkiem resetującym.

### Modele Danych i Kontrakty
- Definicja modeli w `src/types.ts`:
  - `User` – struktura przechowująca dane użytkownika (email, id, token itp.).
  - `AuthResponse` – jednolity format odpowiedzi API zawierający sukces lub błędy wraz z komunikatami.

### Mechanizmy Walidacji i Obsługi Wyjątków
- Walidacja danych wejściowych odbywa się na poziomie endpointów (np. sprawdzenie formatu email, minimalnej długości hasła, unikalności emaila).
- Implementacja bloków try/catch, aby wychwytywać wyjątki, logować błędy oraz zwracać odpowiednie kody HTTP (np. 400 dla błędnych danych, 500 dla błędów serwera).

### Renderowanie Stron Server-Side
- Aktualizacja renderowania stron Astro:
  - Wstrzykiwanie tokenów sesji w ciasteczkach HTTP-only na etapie odpowiedzi serwera.
  - Wdrożenie middleware (w `src/middleware/index.ts`) w celu ochrony stron wymagających autentykacji, sprawdzając ważność tokena sesji.
  - Konfiguracja w `astro.config.mjs` zapewniająca prawidłowe działanie mechanizmów server-side dla stron zabezpieczonych autentykacją.

## 3. SYSTEM AUTENTYKACJI

### Integracja z Supabase Auth
- Wykorzystanie Supabase Auth do:
  - Rejestracji: metoda `supabase.auth.signUp` do tworzenia nowego konta na podstawie emaila i hasła.
  - Logowania: metoda `supabase.auth.signInWithPassword` do autentykacji użytkownika.
  - Wylogowywania: metoda `supabase.auth.signOut` usuwająca aktywną sesję oraz czyszczenie ciasteczek.
  - Resetowania hasła: metoda `supabase.auth.resetPasswordForEmail` inicjująca wysyłkę maila resetującego.
- Klient Supabase jest skonfigurowany w katalogu `src/db/`, co umożliwia dostęp do metod autentykacyjnych zarówno z poziomu API, jak i komponentów frontendowych.

### Zarządzanie Sesją i Middleware
- Po udanym logowaniu sesja jest przechowywana w bezpiecznych, HTTP-only ciasteczkach.
- Middleware (umieszczony w `src/middleware/index.ts`) sprawdza autentyczność użytkownika przed udostępnieniem stron, przekierowując niezalogowanych na stronę logowania.
- Wylogowanie usuwa token sesji oraz resetuje stan autentykacji po stronie klienta.

### Bezpieczeństwo i Skalowalność
- Dane uwierzytelniające (hasła) są szyfrowane przed zapisaniem w bazie.
- Wszystkie endpointy API posiadają walidację danych wejściowych i mechanizmy zapobiegające atakom (np. brute force, SQL injection).
- Wykorzystanie standardowych mechanizmów Supabase zapewnia dodatkową warstwę bezpieczeństwa, w tym weryfikację adresu email oraz limity zapytań.

## PODSUMOWANIE

Implementacja modułu autentykacji w 10xCards obejmuje:
- Rozdzielenie interfejsu na strony publiczne (rejestracja, logowanie, reset hasła) oraz chronione strony dla autoryzowanych użytkowników.
- Użycie komponentów React (formularze) w stronach Astro, zapewniając spójność wizualną (Tailwind, Shadcn/ui) i funkcjonalną walidację.
- Integrację z Supabase Auth do obsługi rejestracji, logowania, wylogowywania oraz resetowania hasła, z zachowaniem standardów bezpieczeństwa.
- Implementację API z logiką walidacji, obsługą wyjątków oraz odpowiednim renderowaniem stron server-side.
- Middleware, który zabezpiecza strony wymagające autentykacji, zgodnie z konfiguracją w `astro.config.mjs`.

Powyższa specyfikacja stanowi kompleksowy opis architektury modułu autentykacji, uwzględniający zarówno warstwę interfejsu użytkownika, logikę backendową, jak i integrację z systemem Supabase Auth. 