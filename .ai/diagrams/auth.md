<authentication_analysis>
Proces autentykacji obejmuje następujące przepływy:

1. Rejestracja – użytkownik wypełnia formularz rejestracji (email, hasło) i wysyła żądanie do Astro API, które wywołuje metodę supabase.auth.signUp. Po sukcesie zwracany jest token sesji, ustawiany w HTTP-only cookie.
2. Logowanie – użytkownik loguje się poprzez formularz logowania; Astro API wywołuje supabase.auth.signInWithPassword i otrzymuje token sesji, który jest zapisywany w ciasteczce.
3. Reset hasła – użytkownik inicjuje reset hasła, wysyłając email poprzez formularz; Astro API wywołuje supabase.auth.resetPasswordForEmail, a użytkownik otrzymuje link resetujący.
4. Middleware – przy każdym żądaniu do stron chronionych, middleware weryfikuje ważność tokenu. W przypadku nieważnego tokenu następuje przekierowanie na stronę logowania.
5. Odświeżanie tokenu – w przypadku wygaśnięcia tokenu, system podejmuje próbę jego odświeżenia; nieudana próba skutkuje wylogowaniem użytkownika.
   </authentication_analysis>

<mermaid_diagram>

```mermaid
sequenceDiagram
    autonumber
    participant Przeglądarka as Przeglądarka
    participant Middleware as Middleware
    participant API as Astro API
    participant Supabase as Supabase Auth

    %% Proces rejestracji
    Note over Przeglądarka,API: Rejestracja
    Przeglądarka->>API: Żądanie rejestracji (email, hasło)
    activate API
    API->>Supabase: supabase.auth.signUp(email, hasło)
    Supabase-->>API: Potwierdzenie + token
    API-->>Przeglądarka: Ustawienie tokenu (HTTP-only cookie)
    deactivate API

    %% Proces logowania
    Note over Przeglądarka,API: Logowanie
    Przeglądarka->>API: Żądanie logowania (email, hasło)
    activate API
    API->>Supabase: supabase.auth.signInWithPassword(email, hasło)
    Supabase-->>API: Token sesji
    API-->>Przeglądarka: Ustawienie tokenu (HTTP-only cookie)
    deactivate API

    %% Dostęp do stron chronionych
    Note over Przeglądarka,Middleware: Weryfikacja autentykacji
    Przeglądarka->>Middleware: Żądanie strony chronionej
    activate Middleware
    Middleware->>API: Weryfikacja tokenu
    API-->>Middleware: Token ważny lub nieważny
    alt Token ważny
        Middleware-->>Przeglądarka: Dostęp zatwierdzony
    else Token nieważny
        Middleware-->>Przeglądarka: Przekierowanie do logowania
    end
    deactivate Middleware

    %% Proces resetu hasła
    Note over Przeglądarka,API: Reset hasła
    Przeglądarka->>API: Żądanie resetu hasła (email)
    activate API
    API->>Supabase: supabase.auth.resetPasswordForEmail(email)
    Supabase-->>API: Link resetujący wysłany
    API-->>Przeglądarka: Potwierdzenie wysyłki
    deactivate API

    %% Proces odświeżania tokenu
    Note over API,Supabase: Odświeżanie tokenu
    API->>Supabase: Weryfikacja/odświeżenie tokenu
    Supabase-->>API: Nowy token lub błąd
```

</mermaid_diagram>
