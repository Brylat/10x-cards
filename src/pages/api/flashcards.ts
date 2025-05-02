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

// Validation schema for GET request query parameters
const listFlashcardsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(["created_at", "id", "front", "back"]).default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Validation schema for DELETE request query parameters
const deleteFlashcardQuerySchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const GET: APIRoute = async ({ request, cookies, locals, url }) => {
  try {
    // Check if user is authenticated
    if (!locals.user) {
      return new Response(
        JSON.stringify({
          error: "Authentication required",
          message: "You must be logged in to view flashcards",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse and validate query parameters
    const queryParams = Object.fromEntries(url.searchParams);
    const validationResult = listFlashcardsQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { page, limit, sortBy, sortOrder } = validationResult.data;

    // Initialize Supabase client with cookie handling
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Get flashcards using service
    const flashcardsService = new FlashcardsService(supabase);
    const result = await flashcardsService.getFlashcards(
      locals.user.id,
      page,
      limit,
      sortBy,
      sortOrder as "asc" | "desc"
    );

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing flashcards retrieval request:", error);
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

export const DELETE: APIRoute = async ({ request, cookies, locals, url }) => {
  try {
    // Check if user is authenticated
    if (!locals.user) {
      return new Response(
        JSON.stringify({
          error: "Authentication required",
          message: "You must be logged in to delete flashcards",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse and validate query parameters
    const queryParams = Object.fromEntries(url.searchParams);
    const validationResult = deleteFlashcardQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid flashcard ID",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { id } = validationResult.data;

    // Initialize Supabase client with cookie handling
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Delete the flashcard, ensuring it belongs to the current user
    const { error } = await supabase.from("flashcards").delete().eq("id", id).eq("user_id", locals.user.id);

    if (error) {
      console.error("Error deleting flashcard:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to delete flashcard",
          message: error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Flashcard deleted successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing delete request:", error);
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
