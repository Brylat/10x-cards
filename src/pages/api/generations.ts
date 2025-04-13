import type { APIRoute } from "astro";
import { z } from "zod";
import { GenerationService } from "../../lib/services/generation.service";
import { supabaseClient, DEFAULT_USER_ID } from "../../db/supabase.client";

export const prerender = false;

// Validation schema for the request body
const requestGenerationSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Text must be at least 1000 characters long")
    .max(10000, "Text cannot exceed 10000 characters"),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Input validation
    const body = await request.json();
    const validationResult = requestGenerationSchema.safeParse(body);

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

    const { source_text } = validationResult.data;

    // 2. Process generation request
    const generationService = new GenerationService(supabaseClient);
    const result = await generationService.createGeneration(source_text, DEFAULT_USER_ID);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing generation request:", error);
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
