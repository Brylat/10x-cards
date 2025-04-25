import type { APIRoute } from "astro";
import { z } from "zod";
import { FlashcardsService } from "../../lib/services/flashcards.service";
import { createSupabaseServerInstance } from "../../db/supabase.client";

export const prerender = false;

// Validation schema for a single flashcard
const createFlashcardCommandSchema = z.object({
  front: z.string().max(200, "Front text cannot exceed 200 characters"),
  back: z.string().max(500, "Back text cannot exceed 500 characters"),
  source: z.enum(["manual", "ai-full", "ai-edited"] as const),
  generation_id: z.number().nullable().optional(),
});

// Validation schema for the request body
const createFlashcardsSchema = z.object({
  flashcards: z.array(createFlashcardCommandSchema),
});

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  try {
    // Check if user is authenticated
    if (!locals.user) {
      return new Response(
        JSON.stringify({
          error: "Authentication required",
          message: "You must be logged in to create flashcards",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate request body
    const body = await request.json();
    const validationResult = createFlashcardsSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { flashcards } = validationResult.data;

    // Initialize Supabase client with cookie handling
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Create flashcards using service
    const flashcardsService = new FlashcardsService(supabase);
    const result = await flashcardsService.createFlashcards(flashcards, locals.user.id);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing flashcards creation request:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "An unexpected error occurred while processing your request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
