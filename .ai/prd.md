# Dokument wymagań produktu (PRD) - 10xCards

## 1. Przegląd produktu

Produkt jest aplikacją webową do tworzenia fiszek edukacyjnych, która umożliwia zarówno generowanie fiszek przez AI na bazie wprowadzonego tekstu, jak i manualne tworzenie fiszek. Aplikacja integruje się z gotowym, open source'owym algorytmem powtórek wykorzystującym zasadę spaced repetition, umożliwiając efektywną naukę. System posiada prosty interfejs do edycji, przeglądania, akceptacji oraz usuwania fiszek, przy czym dane użytkownika są przechowywane w systemie kont użytkowników.

## 2. Problem użytkownika

Użytkownicy często napotykają trudności związane z ręcznym tworzeniem wysokiej jakości fiszek edukacyjnych, co jest czasochłonne i demotywujące. Brak łatwej drogi do generowania własnych fiszek skutkuje rezygnacją z efektywnej metody nauki, jaką jest spaced repetition. Produkt ma za zadanie ułatwić i przyspieszyć proces tworzenia fiszek, poprzez umożliwienie korzystania z AI oraz intuicyjny interfejs, który gwarantuje, że każdy użytkownik, nawet bez specjalistycznej wiedzy, będzie mógł przygotować wartościowe fiszki.

## 3. Wymagania funkcjonalne

- Generowanie fiszek przez AI: Użytkownik może wkleić tekst (od 1000 do 10000 znaków), a system przetworzy go na zestaw fiszek.
  - Fiszki generowane przez AI muszą posiadać "przód" (do 200 znaków) i "tył" (do 500 znaków).
  - System przeprowadza walidację limitów znaków na poziomie frontendu, backendu oraz bazy danych.
  - Parametry limitów znaków dla AI są stałe, aby zapewnić zgodność wygenerowanych treści.
  - Po wygenerowaniu fiszki przedstawione są użytkownikowi w formacie listy i moze je akceptować lub odrzucić, każdą z osobna.
- Manualne tworzenie fiszek: Użytkownik ma możliwość tworzenia fiszek ręcznie.
  - Wyświetlane są one w widoku listy "Moje fiszki".
  - Widok ten udostępnia możliwość dodawania, edycji, usuwania.
- Zarządzanie fiszkami: Użytkownik ma możliwość przeglądania, edytowania oraz usuwania fiszek, zarówno tych wygenerowanych przez AI, jak i ręcznie stworzonych.
- System kont użytkowników: Aplikacja posiada prosty system rejestracji, logowania oraz autoryzacji, gdzie każdy użytkownik ma dostęp jedynie do swoich danych i fiszek.
- Integracja z algorytmem powtórek: Fiszki są przekazywane do algorytmu spaced repetition, który wspomaga proces nauki przez planowanie powtórek.
- Zbieranie informacji o tym, ile fiszek zostało wygenerowanych przez AI i ile z nich ostatecznie zaakceptowano.

## 4. Granice produktu

- Produkt będzie dostępny wyłącznie jako aplikacja webowa; aplikacje mobilne nie są uwzględnione w MVP.
- Nie jest realizowana implementacja własnego, zaawansowanego algorytmu powtórek (np. SuperMemo, Anki) – używany będzie open source'owy algorytm.
- Funkcjonalność importu plików w różnych formatach (PDF, DOCX, itp.) nie będzie obsługiwana.
- Udostępnianie fiszek między użytkownikami oraz współdzielenie zestawów fiszek nie jest częścią MVP.
- Nie mierzy się czasu poświęconego przez użytkownika na ręczne tworzenie fiszek.

## 5. Historyjki użytkowników

- ID: US-001
  Tytuł: Rejestracja i logowanie użytkownika
  Opis: Jako nowy użytkownik chcę się zarejestrować i zalogować, aby mieć bezpieczny dostęp do moich fiszek.
  Kryteria akceptacji:

  - Użytkownik może założyć konto używając adresu e-mail i hasła.
  - System waliduje unikalność e-maila oraz siłę hasła.
  - Użytkownik może się poprawnie zalogować i mieć dostęp tylko do swoich danych.

- ID: US-002
  Tytuł: Generowanie fiszek przez AI
  Opis: Jako użytkownik chcę wkleić tekst o długości od 1000 do 10000 znaków, aby system wygenerował fiszki z podziałem na "przód" (do 200 znaków) i "tył" (do 500 znaków).
  Kryteria akceptacji:

  - System przyjmuje tekst wejściowy w określonym zakresie znaków.
  - AI generuje zestaw fiszek spełniających limity znaków.
  - Użytkownik może zapoznać się z wygenerowanymi fiszkami w postaci listy przed ich zatwierdzeniem lub odrzuceniem.
  - Każda fiszka posiada przycisk służący do jej zatwierdzenia, edycji lub odrzucenia.

- ID: US-003
  Tytuł: Manualne tworzenie fiszek
  Opis: Jako użytkownik chcę móc ręcznie tworzyć fiszki, dostępne na liście "Moje fiszki", gdzie mogę je również edytować.
  Kryteria akceptacji:

  - Interfejs umożliwia tworzenie, edycję i zapis manualnych fiszek.
  - Fiszki muszą spełniać limit dla "przodu" i "tyłu" (200 i 500 znaków odpowiednio).

- ID: US-004
  Tytuł: Edycja i usuwanie fiszek
  Opis: Jako użytkownik chcę mieć możliwość przeglądania, edytowania i usuwania zarówno fiszek wygenerowanych przez AI, jak i ręcznie stworzonych, aby móc zarządzać swoim materiałem do nauki.
  Kryteria akceptacji:

  - Użytkownik widzi listę swoich fiszek.
  - Użytkownik może wybrać fiszkę do edycji lub usunięcia.
  - Zmiany są zapisywane, fiszki są usuwane z bazy danych.

- ID: US-006
  Tytuł: Sesja nauki
  Opis: Jako użytkownik chcę mieć możliwość rozpoczęcia sesji nauki, aby uczyć się na podstawie moich fiszek według algorytmu spaced repetition.
  Kryteria akceptacji:
  - Użytkownik może rozpocząć sesję nauki z poziomu interfejsu w widoku "Sesja nauki".
  - System prezentuje fiszki kolejno według algorytmu spaced repetition.
  - Na start wyświetlany jest "przód" fiszki, przez interakcje użytkownik wyświetla jej tył.
  - Użytkownik może ocenić opanowanie każdej fiszki.
  - Następnie wyświetlana jest kolejna fiszka.

## 6. Metryki sukcesu

- 75% fiszek wygenerowanych przez AI musi być zaakceptowanych przez użytkowników.
- 75% fiszek powinno być tworzonych przez użytkowników z wykorzystaniem funkcji AI.
- System rejestruje liczbę akceptacji i odrzutów fiszek, co pozwala na bieżące monitorowanie skuteczności generowania treści.
