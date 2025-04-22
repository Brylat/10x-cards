import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { z } from "zod";

// Schema for input validation
const resetPasswordSchema = z.object({
  email: z.string().email("Niepoprawny format adresu email"),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Niepoprawne dane",
          details: result.error.issues,
        }),
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Initialize Supabase client
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Send password reset email using Supabase Auth
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${new URL(request.url).origin}/update-password`,
    });

    if (error) {
      console.error("Password reset error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, message: "Email resetujący hasło został wysłany" }), {
      status: 200,
    });
  } catch (e) {
    console.error("Server error:", e);
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas przetwarzania żądania" }), { status: 500 });
  }
};
