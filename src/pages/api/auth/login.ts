import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { z } from "zod";

// Schema walidacji danych wejściowych
const loginSchema = z.object({
  email: z.string().email("Niepoprawny format adresu email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // 1. Walidacja danych wejściowych
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowe dane logowania",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { email, password } = validationResult.data;

    // 2. Inicjalizacja klienta Supabase z obsługą ciasteczek
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // 3. Próba logowania
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. Zwracanie danych użytkownika (bez danych wrażliwych)
    return new Response(
      JSON.stringify({
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error during login:", error);
    return new Response(
      JSON.stringify({
        error: "Błąd serwera podczas logowania",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
