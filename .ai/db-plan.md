/_ Schemat bazy danych PostgreSQL - 10xCards _/

# Schemat bazy danych PostgreSQL - 10xCards

## 1. Tabele

### a. Tabela `flashcards`

Kolumny:

- `id` SERIAL PRIMARY KEY
- `front` VARCHAR(200) NOT NULL
- `back` VARCHAR(500) NOT NULL
- `source` VARCHAR(20) NOT NULL CHECK (source IN ('ai-full', 'ai-edited', 'manual'))
- `generation_id` INTEGER REFERENCES generations(id) ON DELETE CASCADE
- `user_id` UUID REFERENCES auth.users(id) ON DELETE CASCADE -- (użytkownicy zarządzani przez Supabase Auth)
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- aktualizowany przez trigger

Indeksy:

- Indeks na kolumnie `user_id`
- Indeks na kolumnie `generation_id`
- Indeks na kolumnie `created_at`

### b. Tabela `generations`

Kolumny:

- `id` SERIAL PRIMARY KEY
- `hash` TEXT NOT NULL
- `source_text_length` INTEGER NOT NULL CHECK (between 1000 10000) -- długość przetwarzanego tekstu
- `source_text_hash` VARCHAR NOT NULL
- `model` TEXT NOT NULL
- `generated_count` INTEGER NOT NULL -- liczba wygenerowanych fiszek
- `accepted_count_without_edit` INTEGER NULLABLE
- `accepted_count_with_edit` INTEGER NULLABLE
- `generation_duration` INTEGER NOT NULL
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- `user_id` UUID REFERENCES auth.users(id) ON DELETE CASCADE

Indeksy:

- Indeks na kolumnie `created_at`
- Indeks na kolumnie `user_id`

### c. Tabela `generations_error_logs`

Kolumny:

- `id` SERIAL PRIMARY KEY
- `error_message` VARCHAR(1000) NOT NULL -- ograniczenie długości komunikatu błędu
- `error_code` VARCHAR(100) NOT NULL
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- `source_text_length` INTEGER NOT NULL CHECK (between 1000 10000) -- długość przetwarzanego tekstu
- `source_text_hash` VARCHAR NOT NULL
- `model` TEXT NOT NULL
- `user_id` UUID REFERENCES auth.users(id)

## 2. Relacje między tabelami

- Tabela `flashcards` posiada klucz obcy `generation_id` odnoszący się do `generations.id` z mechanizmem `ON DELETE CASCADE`. Dzięki temu, usunięcie rekordu z tabeli `generations` powoduje automatyczne usunięcie powiązanych fiszek.
- Tabela `flashcards` posiada klucz obcy `user_id` odnoszący się do tabeli użytkowników Supabase (`auth.users.id`) z mechanizmem `ON DELETE CASCADE`. Usunięcie użytkownika skutkuje usunięciem jego fiszek.
- Tabela `generations` posiada klucz obcy `user_id` odnoszący się do tabeli użytkowników Supabase (`auth.users.id`) z mechanizmem `ON DELETE CASCADE`, co umożliwia automatyczne czyszczenie danych generacji powiązanych z usuniętym użytkownikiem.
- Tabela `generations_error_logs` posiada kolumnę `user_id` odnoszącą się do tabeli użytkowników Supabase (`auth.users.id`), umożliwiając powiązanie błędów generacji z konkretnym użytkownikiem. Przy usunięciu użytkownika, rekordy nie powinny być usuwane.

## 3. Indeksy

- Tabela `flashcards`: indeksy na kolumnach `user_id`, `generation_id` oraz `created_at`.
- Tabela `generations`: indeksy na kolumnach `created_at` oraz `user_id`.

## 4. Mechanizmy automatyzacji

- Wszystkie tabele posiadają kolumnę `created_at` ustawioną domyślnie na `CURRENT_TIMESTAMP`.
- Tabela `flashcards` posiada kolumnę `updated_at` ustawioną na `CURRENT_TIMESTAMP` oraz powinna być automatycznie aktualizowana przez trigger przy modyfikacji rekordu.
- Tabela `generations` posiada kolumnę `updated_at` ustawioną na `CURRENT_TIMESTAMP` oraz powinna być automatycznie aktualizowana przez trigger przy modyfikacji rekordu.
- Tabela `generations_error_logs` korzysta z kolumny `created_at` do rejestracji czasu utworzenia rekordu.

## 5. Zasady bezpieczeństwa (RLS)

- Dla tabel zawierających kolumnę `user_id` (takich jak `flashcards`, `generations` oraz `generations_error_logs`) należy zaimplementować zasady RLS, aby każdy użytkownik miał dostęp wyłącznie do swoich danych.
- Przykładowa polityka RLS dla tabeli `flashcards`:

```
CREATE POLICY "Users can access their own flashcards" ON flashcards
  USING (user_id = current_setting('app.current_user_id')::uuid);
```

- Analogiczne polityki RLS należy wdrożyć dla tabel `generations` oraz `generations_error_logs`. W przypadku tabeli `generations_error_logs`, mimo że rekordy nie są usuwane przy usunięciu użytkownika, polityka ta powinna umożliwić dostęp jedynie do logów przypisanych do zalogowanego użytkownika.

- Uwaga: konfiguracja RLS może być rozszerzona zależnie od potrzeb wdrożenia i integracji z Supabase Auth.

## 6. Dodatkowe uwagi

- Użycie CHECK dla kolumny `source` gwarantuje, że dozwolone są tylko wartości: 'ai-full', 'ai-edited' oraz 'manual'.
- Tabela użytkowników korzysta z wbudowanego systemu Supabase Auth i nie wymaga dodatkowych modyfikacji w schemacie.
