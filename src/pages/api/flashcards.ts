import type { APIRoute } from "astro";
import { z } from "zod";
import { FlashcardsService } from "../../lib/services/flashcards.service";
import { supabaseClient, DEFAULT_USER_ID } from "../../db/supabase.client";

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

export const POST: APIRoute = async ({ request }) => {
  try {
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

    // Create flashcards using service
    const flashcardsService = new FlashcardsService(supabaseClient);
    const result = await flashcardsService.createFlashcards(flashcards, DEFAULT_USER_ID);

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
