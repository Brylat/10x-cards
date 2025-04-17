import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenerationResponseDTO, GenerationStatus } from "../../types";
import { OpenRouterService } from "./openrouter.service";
import crypto from "crypto";

export class GenerationService {
  private aiService: OpenRouterService;
  private readonly MODEL = "openai/gpt-4o-mini"; // Define model at class level for reuse

  constructor(private readonly supabase: SupabaseClient) {
    this.aiService = new OpenRouterService(this.MODEL);

    // Set system message for flashcard generation
    this.aiService.setSystemMessage(
      "You are an AI assistant specialized in creating high-quality flashcards from provided text. " +
        "Generate concise, clear, and effective flashcards that capture key concepts and knowledge. " +
        "Each flashcard should have a front (question/prompt) and back (answer/explanation). " +
        "Focus on important facts, definitions, concepts, and relationships."
    );

    // Set response format for array of flashcards
    this.aiService.setResponseFormat({
      name: "flashcards",
      schema: {
        type: "object",
        properties: {
          flashcards: {
            type: "array",
            items: {
              type: "object",
              properties: {
                front: { type: "string" },
                back: { type: "string" },
              },
              required: ["front", "back"],
              additionalProperties: false,
            },
          },
        },
        required: ["flashcards"],
        additionalProperties: false,
      },
    });

    // Set model parameters for optimal flashcard generation
    this.aiService.setModelParameters({
      temperature: 0.7,
      top_p: 0.9,
    });
  }

  async createGeneration(sourceText: string, userId: string): Promise<GenerationResponseDTO> {
    try {
      const startTime = Date.now();

      // 1. Create generation record
      const { data: generation, error: generationError } = await this.supabase
        .from("generations")
        .insert({
          user_id: userId,
          source_text_length: sourceText.length,
          source_text_hash: this.generateHash(sourceText),
          model: this.MODEL, // Use the same model constant
          generated_count: 0,
          generation_duration: 0,
        })
        .select()
        .single();

      if (generationError || !generation) {
        throw new Error("Failed to create generation record" + JSON.stringify(generationError));
      }

      try {
        // 2. Generate flashcards using AI service
        const prompt = `${sourceText}`;

        const response = await this.aiService.sendChatMessage(prompt);
        const { flashcards } = JSON.parse(response);

        const generationDuration = Date.now() - startTime;

        // 3. Update generation record with success
        const { error: updateError } = await this.supabase
          .from("generations")
          .update({
            generated_count: flashcards.length,
            generation_duration: generationDuration,
          })
          .eq("id", generation.id);

        if (updateError) {
          throw new Error("Failed to update generation status");
        }

        // 4. Return successful response
        return {
          generation_id: generation.id,
          status: "completed" as GenerationStatus,
          generated_count: flashcards.length,
          generation_duration: generationDuration,
          flashcards_proposals: flashcards,
        };
      } catch (aiError) {
        const generationDuration = Date.now() - startTime;

        // Log error and update generation status
        await this.logGenerationError(generation.id, aiError);
        await this.supabase
          .from("generations")
          .update({
            status: "failed",
            generation_duration: generationDuration,
          })
          .eq("id", generation.id);

        throw aiError;
      }
    } catch (error) {
      console.error("Error in createGeneration:", error);
      throw error;
    }
  }

  private generateHash(text: string): string {
    return crypto.createHash("md5").update(text).digest("hex");
  }

  private async logGenerationError(generationId: number, error: unknown): Promise<void> {
    try {
      await this.supabase.from("generations_error_logs").insert({
        generation_id: generationId,
        error_code: "AI_GENERATION_FAILED",
        error_message: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } catch (logError) {
      console.error("Failed to log generation error:", logError);
    }
  }
}
