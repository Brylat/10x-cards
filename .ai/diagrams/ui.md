<architecture_analysis>
Analiza modułu autentykacji:

1. Komponenty:
   - RegisterForm.tsx: Formularz rejestracji, odpowiedzialny za walidację danych i przesyłanie informacji do endpointu rejestracji.
   - LoginForm.tsx: Formularz logowania, walidujący dane i wysyłający żądanie logowania do API.
   - PasswordResetForm.tsx: Formularz resetowania hasła, inicjujący proces wysyłki maila resetującego.
2. Strony:
   - /register, /login, /reset-password: Dedykowane strony korzystające z NonAuthLayout.astro, zapewniające spójny interfejs.
   - AuthLayout.astro: Layout dla stron dostępnych dla zalogowanych użytkowników (z TopMenu i zabezpieczeniem).
3. API:
   - registration.ts, login.ts, reset-password.ts w katalogu /api/auth: Endpointy obsługujące rejestrację, logowanie i reset hasła, integrujące się z Supabase Auth.
4. Middleware:
   - src/middleware/index.ts: Chroni strony wymagające autentykacji poprzez weryfikację sesji/tokenu.
5. Przepływ danych:
   - Użytkownik wchodzi na stronę (np. /login), która korzysta z NonAuthLayout do renderowania odpowiedniego formularza (LoginForm).
   - Formularz wysyła dane do odpowiedniego API (login.ts), gdzie następuje weryfikacja.
   - Middleware sprawdza autentyczność i w razie sukcesu przekierowuje do chronionych zasobów (AuthLayout).
     </architecture_analysis>

<mermaid_diagram>

```mermaid
flowchart TD
    U[Użytkownik]

    subgraph "Strony Autentykacji"
      L["Strona Logowania (/login)"]
      R["Strona Rejestracji (/register)"]
      P["Strona Reset Hasła (/reset-password)"]
      NL[NonAuthLayout.astro]
    end

    subgraph "Komponenty Formularzy"
      LF[(LoginForm.tsx)]
      RF[(RegisterForm.tsx)]
      PRF[(PasswordResetForm.tsx)]
    end

    subgraph "API Autentykacji"
      API_L[login.ts]
      API_R[registration.ts]
      API_P[reset-password.ts]
    end

    subgraph "Middleware & Layout Chroniony"
      MW[src/middleware/index.ts]
      AL[AuthLayout.astro]
    end

    U --> L
    U --> R
    U --> P

    L --> NL
    R --> NL
    P --> NL

    NL --> LF
    NL --> RF
    NL --> PRF

    LF -- "Wysyła dane logowania" --> API_L
    RF -- "Wysyła dane rejestracji" --> API_R
    PRF -- "Inicjuje reset hasła" --> API_P

    API_L -- "Weryfikacja sesji" --> MW
    API_R -- "Weryfikacja sesji" --> MW
    API_P -- "Inicjacja resetu hasła" --> MW

    MW -- "Dostęp do stron chronionych" --> AL
```

</mermaid_diagram>
