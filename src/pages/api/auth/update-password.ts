import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { z } from "zod";

// Schema for input validation
const updatePasswordSchema = z.object({
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = updatePasswordSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Niepoprawne dane",
          details: result.error.issues,
        }),
        { status: 400 }
      );
    }

    const { password } = result.data;

    // Initialize Supabase client
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error("Password update error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, message: "Hasło zostało zaktualizowane" }), { status: 200 });
  } catch (e) {
    console.error("Server error:", e);
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas przetwarzania żądania" }), { status: 500 });
  }
};
