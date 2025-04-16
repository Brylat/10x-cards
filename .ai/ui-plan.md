# Architektura UI dla 10xCards

## 1. Przegląd struktury UI

Interfejs użytkownika został podzielony na kilka głównych widoków, zaprojektowanych z myślą o responsywności, dostępności (WCAG AA) oraz intuicyjnym przepływie użytkownika. Używamy Astro 5, React 19, Tailwind CSS 4 oraz komponentów Shadcn/ui, aby zapewnić wysoką jakość doświadczenia. Główne widoki obejmują ekran logowania/rejestracji, widok generowania fiszek (zintegrowany z komponentem akceptacji), widok listy fiszek (Moje fiszki), panel użytkownika oraz ekran sesji powtórkowych. Nawigator (topbar) zapewnia spójny dostęp do wszystkich funkcji.

## 2. Lista widoków

1. **Ekran logowania/rejestracji (Auth)**

   - Ścieżka widoku: `/auth`
   - Główny cel: Umożliwienie użytkownikowi logowania i rejestracji, z obsługą komunikatów błędów inline.
   - Kluczowe informacje: Formularze logowania i rejestracji, komunikaty o błędach, link do odzyskiwania hasła.
   - Kluczowe komponenty: Formularze, pola input, przyciski, alerty błędów.
   - UX, dostępność i bezpieczeństwo: Formularze responsywne, zgodne z WCAG AA, z wyraźnymi komunikatami błędów. Walidacja po stronie klienta i serwera zabezpiecza dane logowania.

2. **Widok generowania fiszek (zintegrowany komponent akceptacji)**

   - Ścieżka widoku: `/generate`
   - Główny cel: Umożliwić użytkownikowi wprowadzenie tekstu, wysłanie go do AI oraz recenzję wygenerowanych fiszek w ramach jednego widoku.
   - Kluczowe informacje: Pole tekstowe do wprowadzenia tekstu, instrukcje generacji, przycisk wywołania AI, podgląd wygenerowanych fiszek wraz z interaktywnymi elementami do akceptacji, edycji (modal) i usuwania propozycji. Finalny zapis następuje przy wykorzystaniu przycisku „Zapisz zaakceptowane”.
   - Kluczowe komponenty: Formularz tekstowy, przycisk generowania, komponent recenzji fiszek, loader/spinner, alerty błędów inline.
   - UX, dostępność i bezpieczeństwo: Walidacja długości tekstu, podpowiedzi, responsywność oraz ochrona przed wstrzyknięciami poprzez walidację wejścia. Komponent recenzji umożliwia bezpośrednią interakcję z fiszkami, zapewniając intuicyjny i spójny przepływ pracy.

3. **Widok listy fiszek (Moje fiszki)**

   - Ścieżka widoku: `/flashcards`
   - Główny cel: Umożliwić użytkownikowi przegląd, zarządzanie i edycję już istniejących fiszek, zarówno tych generowanych przez AI, jak i ręcznie utworzonych.
   - Kluczowe informacje: Prezentacja listy fiszek z opcjami wyszukiwania, filtrowania oraz sortowania. Uwzględnia możliwość otwarcia modalnego okna do edycji zawartości fiszki oraz przyciski do usuwania poszczególnych wpisów.
   - Kluczowe komponenty: Lista lub karty fiszek, modal edycji, przyciski akcji (edycja, usunięcie), możliwość dodania nowej fiszki.
   - UX, dostępność i bezpieczeństwo: Intuicyjny layout, responsywność, potwierdzenie przed usunięciem oraz walidacja danych w formularzach edycji. Zapewnienie zgodności z WCAG AA.

4. **Panel użytkownika**

   - Ścieżka widoku: `/profile`
   - Główny cel: Prezentacja informacji o koncie oraz ustawieniach użytkownika.
   - Kluczowe informacje: Dane profilu, opcje zmiany hasła i ustawienia powiadomień.
   - Kluczowe komponenty: Formularze edycji, tabele lub listy historii, przyciski do modyfikacji ustawień.
   - UX, dostępność i bezpieczeństwo: Jasny układ informacji, responsywność, ochrona danych osobowych oraz walidacja zmian.

5. **Ekran sesji powtórkowych**
   - Ścieżka widoku: `/study`
   - Główny cel: Przeprowadzenie sesji nauki z wykorzystaniem algorytmu spaced repetition.
   - Kluczowe informacje: Prezentacja fiszki (przód), możliwość odsłonięcia tyłu, opcje oceny opanowania materiału i wskaźnik postępu.
   - Kluczowe komponenty: Wyświetlacz fiszki, przycisk odsłonięcia odpowiedzi, przyciski oceny, elementy wskazujące postęp sesji.
   - UX, dostępność i bezpieczeństwo: Duże, czytelne przyciski, intuicyjny interfejs, wysoki kontrast, responsywność oraz ochrona danych sesyjnych użytkownika.

## 3. Mapa podróży użytkownika

1. Użytkownik wchodzi na stronę i trafia na ekran logowania/rejestracji.
2. Po pomyślnym zalogowaniu użytkownik przechodzi do widoku generowania fiszek.
3. W widoku generowania fiszek użytkownik wprowadza tekst i wysyła żądanie generacji do AI. Po otrzymaniu propozycji, zintegrowany komponent recenzji umożliwia akceptację, edycję lub usunięcie poszczególnych fiszek.
4. Użytkownik zatwierdza wybrane fiszki przyciskiem „Zapisz zaakceptowane”, finalizując proces generacji i zapisując fiszki.
5. Użytkownik może przejść do widoku listy fiszek (Moje fiszki) w celu dalszego przeglądu lub modyfikacji zapisanych fiszek.
6. Panel użytkownika umożliwia przeglądanie profilu oraz zarządzanie ustawieniami konta.
7. W przypadku rozpoczęcia sesji nauki, użytkownik trafia do ekranu sesji powtórkowych, gdzie system prezentuje fiszki według algorytmu spaced repetition.

## 4. Układ i struktura nawigacji

Główna nawigacja opiera się na topbarze, który:

- Zawiera linki do kluczowych widoków: Widok generowania fiszek, Widok listy fiszek (Moje fiszki), Panel użytkownika, Ekran sesji powtórkowych.
- Na urządzeniach mobilnych zamieniany jest na menu hamburgerowe.
- Wykorzystuje komponenty Shadcn/ui z intuicyjnymi ikonami i etykietami, zapewniającymi zgodność z WCAG AA.
- Informuje użytkownika o aktualnie wybranym widoku poprzez wyraźne oznaczenie stanu aktywnego.

## 5. Kluczowe komponenty

- **Topbar nawigacyjny:** Umożliwia szybki dostęp do wszystkich głównych widoków. Zintegrowany z Shadcn/ui, zapewnia responsywność i zgodność z WCAG AA.
- **Formularze:** Używane w ekranach autoryzacji, generowania fiszek oraz edycji profilu. Zapewniają walidację i czytelne komunikaty o błędach.
- **Modal:** Służy do edycji szczegółów fiszek w widoku generowania oraz w widoku listy fiszek, umożliwiając bezpieczną modyfikację zawartości.
- **Lista/Karty:** Prezentują fiszki, historię aktywności oraz dane użytkownika, zapewniając przejrzysty i intuicyjny layout.
- **Przyciski:** Służą do akcji, takich jak akceptacja, edycja, usuwanie czy zapisywanie danych. Zaprojektowane z myślą o stanach aktywnych, hover oraz focus.
- **Loader/Spinner:** Informuje użytkownika o trwających operacjach, np. generowaniu fiszek przez AI.
- **Komponenty komunikatów błędów:** Wyświetlają inline komunikaty i alerty, przekazując jasne informacje o problemach, zwłaszcza podczas logowania i operacji na danych.
